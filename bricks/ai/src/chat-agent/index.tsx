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
import styleText from "./styles.shadow.css";

const { defineElement, property, event, method } = createDecorators();

export interface ChatAgentProps {
  agentId?: string;
  conversationId?: string;
}

export interface Message extends BaseMessage {
  key: number;
  partial?: boolean;
  failed?: boolean;
}

export interface BaseMessage {
  role: "user" | "assistant";
  content: string;
}

export interface MessageChunk {
  delta: BaseMessage;
  conversationId?: string;
  key: number;
  partial?: boolean;
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
  accessor conversationId: string | undefined;

  @method()
  postMessage(content: string) {
    return this.#ref.current?.postMessage(content);
  }

  @method()
  sendRequest(content: string, url: string, options: Options<MessageChunk>) {
    return this.#ref.current?.sendRequest(content, url, options);
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
        conversationId={this.conversationId}
        // onMessageChunkPush={this.#handleMessageChunkPush}
        onMessagesUpdate={this.#handleMessagesUpdate}
        onBusyChange={this.#handleBusyChange}
        onConversationIdChange={this.#handleConversationIdChange}
      />
    );
  }
}

export interface ChatAgentComponentProps extends ChatAgentProps {
  onMessageChunkPush?(msg: MessageChunk): void;
  onMessagesUpdate?(messages: Message[]): void;
  onBusyChange?(busy: boolean): void;
  onConversationIdChange?(conversationId: string | null): void;
}

export interface ChatAgentRef {
  postMessage(content: string): Promise<string | null>;
  sendRequest(
    content: string,
    url: string,
    options: Options<MessageChunk>
  ): Promise<string | null>;
  newConversation(): void;
}

export function LegacyChatAgentComponent(
  {
    agentId,
    conversationId: propConversationId,
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
    (chunk: MessageChunk) => {
      onMessageChunkPush?.(chunk);
      setFullMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.key === chunk.key) {
          last.content += chunk.delta.content;
          return [...prev];
        }
        if (last?.partial) {
          last.partial = false;
        }
        return [
          ...prev,
          { ...chunk.delta, key: chunk.key, partial: chunk.partial },
        ];
      });
    },
    [onMessageChunkPush]
  );

  const sendRequest = useCallback(
    async (content: string, url: string, options: Options<MessageChunk>) => {
      // Use ref instead of state to handle sync sequential calls.
      if (busyRef.current) {
        return null;
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

      const userKey = getMessageChunkKey();
      const assistantKey = getMessageChunkKey();
      let currentConversationId = conversationId;

      onBusyChange?.((busyRef.current = true));

      try {
        pushPartialMessage?.({
          key: userKey,
          delta: {
            content: content,
            role: "user",
          },
        });
        const request = createSSEStream<MessageChunk>(
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
        });

        const stream = await request;
        for await (const value of stream) {
          // istanbul ignore next
          // if (process.env.NODE_ENV === "development") {
          //   // eslint-disable-next-line no-console
          //   console.log("stream iterated:", value);
          // }

          await checkNewConversation();

          pushPartialMessage?.({
            delta: value.delta,
            key: assistantKey,
            partial: true,
          });
          if (value.conversationId && !currentConversationId) {
            setConversationId((currentConversationId = value.conversationId));
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
    [conversationId, getMessageChunkKey, onBusyChange, pushPartialMessage]
  );

  useImperativeHandle(
    ref,
    () => ({
      sendRequest,
      postMessage(content: string) {
        return sendRequest(
          content,
          "api/gateway/easyops.api.aiops_chat.manage.LLMChatProxy@1.0.0/api/aiops_chat/v1/chat/completions",
          {
            method: "POST",
            body: JSON.stringify({
              agentId,
              input: content,
              stream: true,
              conversationId,
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
    [agentId, conversationId, onBusyChange, sendRequest]
  );

  useEffect(() => {
    didMountRef.current && onMessagesUpdate?.(fullMessages);
  }, [fullMessages, onMessagesUpdate]);

  useEffect(() => {
    didMountRef.current = true;
  }, []);

  return null;
}
