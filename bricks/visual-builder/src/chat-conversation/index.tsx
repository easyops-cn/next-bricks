import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
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

type Chunk = ChunkBlock | ChunkBlockItem | ChunkStoryboard;

interface ChunkBlock {
  type: "block";
  uuid: string;
  children: string[];
  name: string;
  seq: number;
  hasContainer?: boolean;
}

interface ChunkBlockItem {
  type: "item";
  uuid: string;
  storyboard?: BrickConf;
}

interface ChunkStoryboard {
  type: "storyboard";
  uuid: string;
  storyboard: BrickConf;
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
  const [chunks, setChunks] = useState<Chunk[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    for (const message of messages ?? []) {
      if (message.role !== "assistant") {
        continue;
      }
      chunkRegExp.lastIndex = lastIndexMapRef.current.get(message.key) ?? 0;
      let match: RegExpExecArray | null;
      const newChunks: Chunk[] = [];
      while ((match = chunkRegExp.exec(message.content))) {
        lastIndexMapRef.current.set(message.key, chunkRegExp.lastIndex);
        const [, type, content] = match;
        try {
          const parsed = JSON.parse(content) as unknown;
          if (type === "page") {
            newChunks.push(...(parsed as (ChunkBlock | ChunkBlockItem)[]));
          } else {
            newChunks.push({
              ...(parsed as ChunkStoryboard),
              type: "storyboard",
            });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("parse storyboard failed:", e);
        }
      }
      if (newChunks.length > 0) {
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
              iid: `item-${child}`,
            });
            hasContent = true;
          }
        }
      } else {
        const rawBrick = storyboardMap.get(block.uuid);
        if (rawBrick) {
          const brick: BrickConf = {
            ...rawBrick,
            children: [],
            iid: `block-${block.uuid}`,
          };
          hasContent = true;
          contentLayout.children.push(brick);
          for (const child of block.children) {
            const childBrick = storyboardMap.get(child);
            if (childBrick) {
              brick.children.push({
                ...childBrick,
                iid: `item-${child}`,
              });
            }
          }
        } else if (!block.hasContainer) {
          for (const child of block.children) {
            const childBrick = storyboardMap.get(child);
            if (childBrick) {
              contentLayout.children.push({
                ...childBrick,
                iid: `item-${child}`,
              });
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
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      containerRef.current?.scrollTo(0, containerRef.current?.scrollHeight!);
    }, 0);
  }, [storyboard]);

  return (
    <div className="chat" ref={containerRef}>
      {messages?.map((message, index) => (
        <p
          key={message.key ?? `index-${index}`}
          className={classNames({ failed: message.failed })}
        >
          {upperFirst(message.role)}: {message.content}
          {message.partial && <Dots />}
        </p>
      ))}
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
