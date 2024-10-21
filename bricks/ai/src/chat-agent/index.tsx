import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { getBasePath } from "@next-core/runtime";
import { createSSEStream, type Options } from "@next-core/utils/general";
import { pick } from "lodash";
import styleText from "./styles.shadow.css";

const { defineElement, property, event, method } = createDecorators();

export interface ChatAgentProps {
  agentId?: string;
  robotId?: string;
  conversationId?: string;
  alwaysUseNewConversation?: boolean;
}

export interface Message extends Omit<BaseMessage, "tool_call_id"> {
  key: string | number;
  content: string;
  partial?: boolean;
  failed?: boolean;
  tool_calls?: ProcessedToolCall[];
  placeholder?: boolean;
}

export type ChatRole = "user" | "assistant" | "tool";
export type ChatType =
  | "TEXT"
  | "RELATED_QUESTIONS"
  | "tool_call"
  | "tool_response";

const GENERAL_TEXT_TYPES: readonly ChatType[] = [
  "TEXT",
  "tool_call",
  "tool_response",
];

function isGeneralTextType(type: ChatType | undefined) {
  return GENERAL_TEXT_TYPES.includes(type ?? "TEXT");
}

/**
 * - role 为 `assistant` 且 `type` 为 `tool_call` 且 `tool_calls` 非空，表示执行了工具调用；
 * - role 为 `tool` 且 `type` 为 `tool_call_response` 且 `tool_call_id` 非空，表示工具调用结果。
 */
export interface BaseMessage {
  role: ChatRole;
  content?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  type: "function";
  function: ToolCallFunction;
}

export interface ToolCallFunction {
  name: string;
  arguments: string;
}

export interface ProcessedToolCall extends ToolCall {
  function: ProcessedToolCallFunction;
}

export interface ProcessedToolCallFunction extends ToolCallFunction {
  response?: string;
}

export interface PartialMessageChunk {
  delta: BaseMessage;
  conversationId?: string;
  key: string | number;
  partial?: boolean;
  placeholder?: boolean;
  type?: ChatType;
}

export interface RawMessageChunk {
  delta: BaseMessage;
  conversationId?: string;
  type?: ChatType;
  /** `taskId` 主要用于在界面上区分消息块 */
  taskId?: string;
}

export interface LowLevelMessageChunk {
  choices: LowLevelChoice[];
}

export interface LowLevelChoice {
  delta: {
    role: "assistant";
    content?: string;
  };
}

export const ChatAgentComponent = forwardRef(LegacyChatAgentComponent);

/**
 * 用于与 AI 机器人进行对话的代理构件，处理通信并整合消息。
 */
export
@defineElement("ai.chat-agent", {
  styleTexts: [styleText],
})
class ChatAgent extends ReactNextElement implements ChatAgentProps {
  @property()
  accessor agentId: string | undefined;

  @property()
  accessor robotId: string | undefined;

  @property()
  accessor conversationId: string | undefined;

  @property()
  accessor alwaysUseNewConversation: boolean | undefined;

  /**
   * 发送消息到默认的聊天 API
   */
  @method()
  postMessage(content: string) {
    return this.#ref.current?.postMessage(content);
  }

  /**
   * 发送聊天请求到指定的 URL
   */
  @method()
  sendRequest(
    leadingMessages: string | BaseMessage[],
    url: string,
    options: Options<RawMessageChunk>
  ) {
    return this.#ref.current?.sendRequest(leadingMessages, url, options);
  }

  /**
   * 发送底层聊天请求到指定的 URL。接口的请求和响应的数据结构和 OpenAI 聊天接口一致。
   */
  @method()
  lowLevelSendRequest(
    leadingMessages: string | BaseMessage[],
    url: string,
    options: Options<LowLevelMessageChunk>
  ) {
    return this.#ref.current?.lowLevelSendRequest(
      leadingMessages,
      url,
      options
    );
  }

  @method()
  newConversation() {
    this.#ref.current?.newConversation();
  }

  // @event({ type: "messageChunk.push" })
  // accessor #messageChunkPushEvent!: EventEmitter<MessageChunk>;

  // #handleMessageChunkPush = (msg: MessageChunk) => {
  //   this.#messageChunkPushEvent.emit(msg);
  // };

  @event({ type: "messages.update" })
  accessor #messagesUpdate!: EventEmitter<Message[]>;

  #handleMessagesUpdate = (messages: Message[]) => {
    this.#messagesUpdate.emit(messages);
  };

  @event({ type: "busy.change" })
  accessor #busyChangeEvent!: EventEmitter<boolean>;

  #handleBusyChange = (busy: boolean) => {
    this.#busyChangeEvent.emit(busy);
  };

  @event({ type: "conversationId.change" })
  accessor #conversationIdChangeEvent!: EventEmitter<string | null>;

  #handleConversationIdChange = (conversationId: string | null) => {
    this.#conversationIdChangeEvent.emit(conversationId);
  };

  #ref = createRef<ChatAgentRef>();

  render() {
    return (
      <ChatAgentComponent
        ref={this.#ref}
        agentId={this.agentId}
        robotId={this.robotId}
        conversationId={this.conversationId}
        alwaysUseNewConversation={this.alwaysUseNewConversation}
        // onMessageChunkPush={this.#handleMessageChunkPush}
        onMessagesUpdate={this.#handleMessagesUpdate}
        onBusyChange={this.#handleBusyChange}
        onConversationIdChange={this.#handleConversationIdChange}
      />
    );
  }
}

export interface ChatAgentComponentProps extends ChatAgentProps {
  onMessageChunkPush?(msg: PartialMessageChunk): void;
  onMessagesUpdate?(messages: Message[]): void;
  onBusyChange?(busy: boolean): void;
  onConversationIdChange?(conversationId: string | null): void;
}

export interface ChatAgentRef {
  postMessage(content: string): Promise<string | null>;
  sendRequest(
    leadingMessages: string | BaseMessage[],
    url: string,
    options: Options<RawMessageChunk>
  ): Promise<string | null>;
  lowLevelSendRequest(
    leadingMessages: string | BaseMessage[],
    url: string,
    options: Options<LowLevelMessageChunk>
  ): Promise<string | null>;
  newConversation(): void;
}

export function LegacyChatAgentComponent(
  {
    agentId,
    robotId,
    conversationId: propConversationId,
    alwaysUseNewConversation,
    onMessageChunkPush,
    onMessagesUpdate,
    onBusyChange,
    onConversationIdChange,
  }: ChatAgentComponentProps,
  ref: React.Ref<ChatAgentRef>
) {
  const didMountRef = useRef(false);
  const chatIdRef = useRef(1);
  const busyRef = useRef(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    setConversationId(propConversationId ?? null);
  }, [propConversationId]);

  useEffect(() => {
    didMountRef.current && onConversationIdChange?.(conversationId);
  }, [conversationId, onConversationIdChange]);

  const counterRef = useRef(0);
  const getMessageChunkKey = useCallback(() => counterRef.current++, []);

  const [fullMessages, setFullMessages] = useState<Message[]>([]);

  const pushPartialMessage = useCallback(
    (chunk: PartialMessageChunk) => {
      onMessageChunkPush?.(chunk);
      setFullMessages((prev) => {
        const last = prev[prev.length - 1];
        const chunkType = chunk.type ?? "TEXT";
        if (last && (last.key === chunk.key || last.placeholder)) {
          if (last.placeholder) {
            last.key = chunk.key;
            delete last.placeholder;
          }
          switch (chunkType) {
            case "TEXT":
              last.content += chunk.delta.content;
              break;
            case "tool_call":
              last.tool_calls = (last.tool_calls ?? []).concat(
                chunk.delta.tool_calls ?? []
              );
              break;
            case "tool_response":
              last.tool_calls = last.tool_calls?.map((call) =>
                call.id === chunk.delta.tool_call_id
                  ? { ...call, response: chunk.delta.content }
                  : call
              );
              break;
          }

          return [...prev];
        }
        if (last?.partial) {
          last.partial = false;
        }
        if (chunkType === "tool_response") {
          throw new Error(
            "Unexpected tool_response message: cannot be the first message chunk"
          );
        }
        return [
          ...prev,
          {
            ...pick(chunk, ["key", "partial", "placeholder"]),
            role: chunk.delta.role,
            content: chunk.delta.content ?? "",
            tool_calls: chunk.delta.tool_calls,
          },
        ];
      });
    },
    [onMessageChunkPush]
  );

  const legacySendRequest = useCallback(
    async (
      isLowLevel: boolean,
      leadingMessages: string | BaseMessage[],
      url: string,
      options: Options<RawMessageChunk | LowLevelMessageChunk>
    ) => {
      // Use ref instead of state to handle sync sequential calls.
      if (busyRef.current) {
        return null;
      }
      if (alwaysUseNewConversation || isLowLevel) {
        setFullMessages((prev) => (prev.length === 0 ? prev : []));
      }
      const thisChatId = chatIdRef.current;
      let newConversationError: Error | undefined;
      const checkNewConversation = async () => {
        if (thisChatId !== chatIdRef.current) {
          // istanbul ignore else: should never happen
          if (!newConversationError) {
            newConversationError = new Error("New conversation started");
          }
          throw newConversationError;
        }
      };

      const assistantKey = `assistant:${getMessageChunkKey()}`;
      let currentConversationId =
        alwaysUseNewConversation || isLowLevel ? null : conversationId;

      onBusyChange?.((busyRef.current = true));

      try {
        if (Array.isArray(leadingMessages)) {
          for (const msg of leadingMessages) {
            pushPartialMessage?.({
              delta: msg,
              key: `${msg.role}:${getMessageChunkKey()}`,
            });
          }
        } else {
          pushPartialMessage?.({
            key: `user:${getMessageChunkKey()}`,
            delta: {
              content: leadingMessages,
              role: "user",
            },
          });
        }
        const request = createSSEStream<RawMessageChunk | LowLevelMessageChunk>(
          new URL(url, `${location.origin}${getBasePath()}`).toString(),
          options
        );

        // Put a placeholder assistant message to indicate that the assistant
        // is processing if the request takes longer than one second.
        await Promise.race([
          request,
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);

        await checkNewConversation();

        pushPartialMessage?.({
          key: assistantKey,
          delta: {
            content: "",
            role: "assistant",
          },
          partial: true,
          placeholder: true,
        });

        const stream = await request;
        for await (const value of stream) {
          // istanbul ignore next
          // if (process.env.NODE_ENV === "development") {
          //   // eslint-disable-next-line no-console
          //   console.log("stream iterated:", value);
          // }

          await checkNewConversation();

          if (isLowLevel) {
            const delta = (value as LowLevelMessageChunk).choices?.[0]?.delta;
            if (delta?.content) {
              pushPartialMessage({
                delta: delta as BaseMessage,
                key: assistantKey,
                partial: true,
              });
            }
          } else {
            const raw = value as RawMessageChunk;
            pushPartialMessage?.({
              delta: raw.delta,
              key: `assistant:${isGeneralTextType(raw.type) ? "TEXT" : raw.type}:${raw.taskId ?? getMessageChunkKey()}`,
              partial: true,
            });
            if (
              !alwaysUseNewConversation &&
              raw.conversationId &&
              !currentConversationId
            ) {
              setConversationId((currentConversationId = raw.conversationId));
            }
          }
        }

        await checkNewConversation();

        setFullMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.partial) {
            last.partial = false;
          }
          return [...prev];
        });
      } catch (error) {
        if (error && error === newConversationError) {
          throw error;
        }

        // eslint-disable-next-line no-console
        console.error("stream failed:", error);
        await checkNewConversation();

        setFullMessages((prev) => {
          const last = prev[prev.length - 1];
          let keep = prev;
          if (last?.key === assistantKey) {
            if (last.content) {
              last.partial = false;
              last.failed = true;
            } else {
              // Ignore the empty assistant message.
              keep = prev.slice(0, -1);
            }
          }
          return [
            ...keep,
            {
              role: "assistant",
              content: "系统错误",
              key: getMessageChunkKey(),
              failed: true,
            },
          ];
        });
      }

      await checkNewConversation();

      onBusyChange?.((busyRef.current = false));

      return currentConversationId;
    },
    [
      conversationId,
      alwaysUseNewConversation,
      getMessageChunkKey,
      onBusyChange,
      pushPartialMessage,
    ]
  );

  useImperativeHandle(
    ref,
    () => ({
      lowLevelSendRequest: (...args) => legacySendRequest(true, ...args),
      sendRequest: (...args) => legacySendRequest(false, ...args),
      postMessage(content: string) {
        return legacySendRequest(
          false,
          content,
          "api/gateway/easyops.api.aiops_chat.manage.LLMChatProxy@1.0.0/api/aiops_chat/v1/chat/completions",
          {
            method: "POST",
            body: JSON.stringify({
              agentId,
              robotId,
              input: content,
              stream: true,
              conversationId:
                alwaysUseNewConversation || conversationId === null
                  ? undefined
                  : conversationId,
            }),
            headers: {
              "giraffe-contract-name":
                "easyops.api.aiops_chat.manage.LLMChatProxy",
            },
          }
        );
      },
      newConversation() {
        chatIdRef.current++;
        setConversationId(null);
        setFullMessages((prev) => (prev.length === 0 ? prev : []));
        if (busyRef.current) {
          onBusyChange?.((busyRef.current = false));
        }
      },
    }),
    [
      legacySendRequest,
      agentId,
      robotId,
      alwaysUseNewConversation,
      conversationId,
      onBusyChange,
    ]
  );

  useEffect(() => {
    didMountRef.current && onMessagesUpdate?.(fullMessages);
  }, [fullMessages, onMessagesUpdate]);

  useEffect(() => {
    didMountRef.current = true;
  }, []);

  return null;
}
