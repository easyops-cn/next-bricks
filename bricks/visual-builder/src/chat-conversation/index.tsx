import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { upperFirst } from "lodash";
import classNames from "classnames";
import type { BrickConf } from "@next-core/types";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface Message {
  role: "user" | "assistant";
  content: string;
  key: number;
  partial?: boolean;
  failed?: boolean;
}

export interface ChatConversationProps {
  messages?: Message[];
}

type StoryboardChunk = StoryboardChunkBlock | StoryboardChunkBlockItem;

interface StoryboardChunkBlock {
  type: "block";
  uuid: string;
  children: string[];
  name: string;
  seq: number;
  hasContainer?: boolean;
}

interface StoryboardChunkBlockItem {
  type: "item";
  uuid: string;
  storyboard?: BrickConf;
}

type MessageChunk = MessageChunkText | MessageChunkCommand;

interface MessageChunkText {
  type: "text";
  content: string;
}

interface MessageChunkCommand {
  type: "command";
  command: string;
  content: string;
  raw: string;
}

export const ChatConversationComponent = forwardRef(
  LegacyChatConversationComponent
);

/**
 * 用于 Visual Builder 的智能聊天对话列表
 */
export
@defineElement("visual-builder.chat-conversation", {
  styleTexts: [styleText],
})
class ChatConversation
  extends ReactNextElement
  implements ChatConversationProps
{
  @property({ attribute: false })
  accessor messages: Message[] | undefined;

  @event({ type: "storyboard.update" })
  accessor #storyboardUpdate!: EventEmitter<BrickConf[]>;

  #handleStoryboardUpdate = (storyboard: BrickConf[]) => {
    this.#storyboardUpdate.emit(storyboard);
  };

  render() {
    return (
      <ChatConversationComponent
        messages={this.messages}
        onStoryboardUpdate={this.#handleStoryboardUpdate}
      />
    );
  }
}

export interface ChatConversationComponentProps extends ChatConversationProps {
  onStoryboardUpdate?: (storyboard: BrickConf[]) => void;
}

export function LegacyChatConversationComponent({
  messages,
  onStoryboardUpdate,
}: ChatConversationComponentProps) {
  const chunkRegExp = useMemo(
    () =>
      /(?:^|\n)```easy_cmd_vb_block_(page|storyboard)\n([\s\S]*?)\n```(?:$|\n)/gm,
    []
  );
  const lastIndexMapRef = useRef(new Map<number, number>());
  const [chunks, setChunks] = useState<StoryboardChunk[]>([]);
  const manualScrolledRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    for (const message of messages ?? []) {
      if (message.role !== "assistant") {
        continue;
      }
      chunkRegExp.lastIndex = lastIndexMapRef.current.get(message.key) ?? 0;
      let match: RegExpExecArray | null;
      const newChunks: StoryboardChunk[] = [];
      let newPage = false;
      while ((match = chunkRegExp.exec(message.content))) {
        lastIndexMapRef.current.set(message.key, chunkRegExp.lastIndex);
        const [, type, content] = match;
        try {
          const parsed = JSON.parse(content) as unknown;
          if (type === "page") {
            newPage = true;
            newChunks.push(
              ...(parsed as (StoryboardChunkBlock | StoryboardChunkBlockItem)[])
            );
          } else {
            newChunks.push({
              ...(parsed as StoryboardChunkBlockItem),
              type: "item",
            });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("parse storyboard failed:", e);
        }
      }
      if (newPage) {
        setChunks(newChunks);
      } else if (newChunks.length > 0) {
        setChunks((prev) => [...prev, ...newChunks]);
      }
    }
  }, [chunkRegExp, messages]);

  const [storyboard, setStoryboard] = useState<BrickConf[]>([]);

  useEffect(() => {
    const blocks = [];
    const storyboardMap = new Map<string, BrickConf>();
    for (const chunk of chunks) {
      if (chunk.type === "block") {
        blocks.push(chunk);
      } else if (chunk.storyboard) {
        storyboardMap.set(chunk.uuid, chunk.storyboard);
      }
    }

    // Sort by seq ascent
    blocks.sort((a, b) => a.seq - b.seq);

    const contentLayout: BrickConf = {
      brick: "eo-content-layout",
      children: [],
    };
    const main: BrickConf = {
      brick: "eo-main-view",
      children: [
        {
          brick: "eo-page-title",
          slot: "pageTitle",
          properties: {
            pageTitle: "测试页面",
          },
        },
      ],
    };

    let hasContent = false;
    for (const block of blocks) {
      // No container
      if (block.name === "全局操作区") {
        for (const child of block.children) {
          const childBrick = storyboardMap.get(child);
          if (childBrick) {
            main.children.push({
              ...childBrick,
              properties: {
                ...childBrick.properties,
                slot: undefined,
              },
              slot: "toolbar",
              iid: `item:${child}`,
              meta: {
                type: "item",
                uuid: child,
                block: {
                  uuid: block.uuid,
                  name: block.name,
                },
              },
            } as BrickConf);
            hasContent = true;
          }
        }
      } else {
        const rawBrick = storyboardMap.get(block.uuid);
        if (rawBrick) {
          const brick: BrickConf = {
            ...rawBrick,
            children: [],
            iid: `block:${block.uuid}`,
            meta: {
              type: "block",
              uuid: block.uuid,
              name: block.name,
            },
          } as BrickConf;
          hasContent = true;
          contentLayout.children.push(brick);
          for (const child of block.children) {
            const childBrick = storyboardMap.get(child);
            if (childBrick) {
              brick.children.push({
                ...childBrick,
                iid: `item:${child}`,
                meta: {
                  type: "item",
                  uuid: child,
                },
              } as BrickConf);
            }
          }
        } else if (!block.hasContainer) {
          for (const child of block.children) {
            const childBrick = storyboardMap.get(child);
            if (childBrick) {
              contentLayout.children.push({
                ...childBrick,
                iid: `item:${child}`,
                meta: {
                  type: "item",
                  uuid: child,
                },
              } as BrickConf);
              hasContent = true;
            }
          }
        }
      }
    }

    main.children.push(contentLayout);

    setStoryboard((prev) =>
      hasContent ? [main] : prev.length === 0 ? prev : []
    );
  }, [chunks]);

  useEffect(() => {
    onStoryboardUpdate?.(storyboard);
  }, [onStoryboardUpdate, storyboard]);

  useEffect(() => {
    if (manualScrolledRef.current) {
      return;
    }
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      containerRef.current?.scrollTo(0, containerRef.current?.scrollHeight!);
    }, 0);
  }, [messages]);

  const handleScroll = useCallback(() => {
    manualScrolledRef.current =
      containerRef.current!.scrollTop +
        containerRef.current!.clientHeight! +
        6 <
      containerRef.current!.scrollHeight;
  }, []);

  return (
    <div className="chat" ref={containerRef} onScroll={handleScroll}>
      {messages?.map((message, index) => (
        <MessageBox key={message.key ?? `index-${index}`} message={message} />
      ))}
    </div>
  );
}

interface MessageBoxProps {
  message: Message;
}

function MessageBox({ message }: MessageBoxProps) {
  const messageChunks = useMemo(() => {
    const chunks: MessageChunk[] = [];
    const chunkRegExp = /(?:^|\n)```(\S*)\n([\s\S]*?)\n```(?:$|\n)/gm;

    let match: RegExpExecArray | null;
    let lastIndex = 0;
    while ((match = chunkRegExp.exec(message.content))) {
      const [fullMatch, command, content] = match;
      const start = match.index;
      const previousText = message.content.slice(lastIndex, start).trim();
      if (previousText.length > 0) {
        chunks.push({
          type: "text",
          content: previousText,
        });
      }
      chunks.push({
        type: "command",
        command,
        content: content.trim(),
        raw: fullMatch,
      });
      lastIndex = chunkRegExp.lastIndex;
    }
    const lastText = message.content.slice(lastIndex).trim();
    if (lastText.length > 0) {
      chunks.push({
        type: "text",
        content: lastText,
      });
    }
    return chunks;
  }, [message.content]);

  return (
    <div className={classNames("message", { failed: message.failed })}>
      <span>{upperFirst(message.role)}: </span>
      {messageChunks.map((chunk, index) => (
        <React.Fragment key={index}>
          {chunk.type === "text" ? (
            <span>{chunk.content}</span>
          ) : (
            <details className="command">
              <summary>```{chunk.command}</summary>
              {chunk.content}
            </details>
          )}
        </React.Fragment>
      ))}
      {message.partial && <Dots />}
    </div>
  );
}

function Dots() {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    setInterval(() => {
      setDots((dots) => (dots + 1) % 4);
    }, 500);
  }, []);
  return (
    <>
      <span>{".".repeat(dots)}</span>
      <span className="invisible-dots">{".".repeat(3 - dots)}</span>
    </>
  );
}
