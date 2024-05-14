import React, { useEffect, useMemo, useRef } from "react";
import classNames from "classnames";
import { MarkdownComponent } from "@next-shared/markdown";
import { wrapBrick } from "@next-core/react-element";
import type { AvatarProps, EoAvatar } from "@next-bricks/basic/avatar";
import type { Message } from "./index";

const WrappedAvatar = wrapBrick<EoAvatar, AvatarProps>("eo-avatar");

export interface MessageComponentProps {
  message: Message;
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

export function MessageComponent({ message }: MessageComponentProps) {
  const messageChunks = useMemo(() => {
    const chunks: MessageChunk[] = [];
    const chunkRegExp = /(?:^|\n)```(easy_cmd_\S+)\n([\s\S]*?)\n```(?:$|\n)/gm;

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

  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) {
      return;
    }
    setTimeout(() => {
      const textingElements =
        contentElement.parentElement.querySelectorAll(".texting");
      for (const element of textingElements) {
        element.classList.remove("texting");
      }
      if (!message.partial) {
        return;
      }
      // Find the last text element descendant of the message element,
      // and apply a texting effect to it.
      let current = contentElement as HTMLElement;
      while (current) {
        const lastChild = current.lastChild;
        if (
          lastChild?.nodeType === Node.ELEMENT_NODE &&
          ((lastChild as HTMLElement)?.tagName !== "DETAILS" ||
            (lastChild as HTMLDetailsElement).open)
        ) {
          current = lastChild as HTMLElement;
        } else {
          // Handle a special case: the last child is a text node without any
          // non-whitespace content. In such case, we should apply the texting
          // effect to the previous sibling element.
          if (
            lastChild?.nodeType === Node.TEXT_NODE &&
            lastChild.textContent.trim().length === 0 &&
            lastChild.previousSibling?.nodeType === Node.ELEMENT_NODE
          ) {
            current = lastChild.previousSibling as HTMLElement;
          } else {
            break;
          }
        }
      }
      current.classList.add("texting");
    }, 1);
  }, [message.partial, message.content]);

  return (
    <div className={classNames("message", { failed: message.failed })}>
      <div className="avatar">
        <WrappedAvatar
          icon={{
            lib: "fa",
            icon: message.role === "assistant" ? "robot" : "user",
          }}
          size="small"
        />
      </div>
      <div className="main">
        <div className="label">
          {message.role === "assistant" ? "Assistant" : "You"}
        </div>
        <div className="content" ref={contentRef}>
          {messageChunks.map((chunk, index) => (
            <MessageChunkComponent key={index} chunk={chunk} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageChunkComponent({ chunk }: { chunk: MessageChunk }) {
  return (
    <>
      {chunk.type === "text" ? (
        <div className="markdown">
          <MarkdownComponent content={chunk.content} />
        </div>
      ) : (
        <>
          <details className="command">
            <summary>```{chunk.command}</summary>
            <pre>
              <code>{chunk.content}</code>
            </pre>
          </details>
        </>
      )}
    </>
  );
}
