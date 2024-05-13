import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import type { BrickConf } from "@next-core/types";
import { MessageComponent } from "./MessageComponent";
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
        host={this}
        messages={this.messages}
        onStoryboardUpdate={this.#handleStoryboardUpdate}
      />
    );
  }
}

export interface ChatConversationComponentProps extends ChatConversationProps {
  host: Element;
  onStoryboardUpdate?: (storyboard: BrickConf[]) => void;
}

export function LegacyChatConversationComponent({
  messages,
  host,
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

  const verticalScrollParent = useMemo(() => {
    // Lookup the nearest scrollable parent (on axis y)
    let current = host;
    while (current) {
      const overflowY = getComputedStyle(current, null).getPropertyValue(
        "overflow-y"
      );
      if (overflowY === "auto" || overflowY === "scroll") {
        return current;
      }
      if (current.parentNode instanceof ShadowRoot) {
        current = current.parentNode.host;
      } else if (current.parentNode instanceof Element) {
        current = current.parentNode;
      } else {
        break;
      }
    }
    return document.scrollingElement || document.documentElement;
  }, [host]);

  useEffect(() => {
    if (manualScrolledRef.current) {
      return;
    }
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      verticalScrollParent.scrollTo(0, verticalScrollParent.scrollHeight!);
    }, 0);
  }, [messages, verticalScrollParent]);

  useEffect(() => {
    const handleScroll = () => {
      manualScrolledRef.current =
        verticalScrollParent.scrollTop +
          verticalScrollParent.clientHeight! +
          6 <
        verticalScrollParent.scrollHeight;
    };
    verticalScrollParent.addEventListener("scroll", handleScroll);
    return () => {
      verticalScrollParent.removeEventListener("scroll", handleScroll);
    };
  }, [verticalScrollParent]);

  return (
    <>
      {messages?.map((message, index) => (
        <MessageComponent
          key={message.key ?? `index-${index}`}
          message={message}
        />
      ))}
    </>
  );
}
