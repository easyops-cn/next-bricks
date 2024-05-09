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
import { createSSEStream } from "@next-core/utils/general";
import styleText from "./styles.shadow.css";

const { defineElement, property, event, method } = createDecorators();

export interface ChatAgentProps {
  agentId?: string;
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

  @method()
  postMessage(content: string) {
    this.#ref.current?.postMessage(content);
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

  #ref = createRef<ChatAgentRef>();

  render() {
    return (
      <ChatAgentComponent
        ref={this.#ref}
        agentId={this.agentId}
        // onMessageChunkPush={this.#handleMessageChunkPush}
        onMessagesUpdate={this.#handleMessagesUpdate}
        onBusyChange={this.#handleBusyChange}
      />
    );
  }
}

export interface ChatAgentComponentProps extends ChatAgentProps {
  onMessageChunkPush?(msg: MessageChunk): void;
  onMessagesUpdate?(messages: Message[]): void;
  onBusyChange?(busy: boolean): void;
}

export interface ChatAgentRef {
  postMessage(content: string): Promise<void>;
}

export function LegacyChatAgentComponent(
  {
    agentId,
    onMessageChunkPush,
    onMessagesUpdate,
    onBusyChange,
  }: ChatAgentComponentProps,
  ref: React.Ref<ChatAgentRef>
) {
  const [busy, setBusy] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

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

  useImperativeHandle(
    ref,
    () => ({
      async postMessage(content: string) {
        if (busy) {
          return;
        }
        const userKey = getMessageChunkKey();
        const assistantKey = getMessageChunkKey();
        try {
          setBusy(true);
          pushPartialMessage?.({
            key: userKey,
            delta: {
              content,
              role: "user",
            },
          });
          const request = createSSEStream<MessageChunk>(
            `${getBasePath()}api/gateway/easyops.api.aiops_chat.manage.LLMChatProxy@1.0.0/api/aiops_chat/v1/chat/completions`,
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

          // Put a placeholder assistant message to indicate that the assistant
          // is processing if the request takes longer than one second.
          await Promise.race([
            request,
            new Promise((resolve) => setTimeout(resolve, 1000)),
          ]);
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
            pushPartialMessage?.({
              delta: value.delta,
              key: assistantKey,
              partial: true,
            });
            setConversationId((prev) => prev || value.conversationId);
          }
          setFullMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.partial) {
              last.partial = false;
            }
            return [...prev];
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("stream failed:", error);
          setFullMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.key === assistantKey) {
              last.partial = false;
              last.failed = true;
            }
            return [
              ...prev,
              {
                role: "assistant",
                content: "系统错误",
                key: getMessageChunkKey(),
                failed: true,
              },
            ];
          });
        } finally {
          setBusy(false);
        }
      },
    }),
    [agentId, busy, conversationId, getMessageChunkKey, pushPartialMessage]
  );

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  useEffect(() => {
    onMessagesUpdate?.(fullMessages);
  }, [fullMessages, onMessagesUpdate]);

  return null;
}
