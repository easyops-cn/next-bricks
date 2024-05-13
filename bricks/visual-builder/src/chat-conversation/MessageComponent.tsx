import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { micromark } from "micromark";
import { wrapBrick } from "@next-core/react-element";
import type { AvatarProps, EoAvatar } from "@next-bricks/basic/avatar";
import Prism from "prismjs";
import type { Message } from "./index";

// Prism.manual = true;

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
  const markdownRef = useRef<HTMLDivElement>(null);

  const chunkHtml = useMemo(() => {
    if (chunk.type === "text") {
      return {
        __html: micromark(chunk.content),
      };
    }
  }, [chunk.type, chunk.content]);

  const [prismLanguageLoaded, setPrismLanguageLoaded] = useState(false);

  useEffect(() => {
    const elements = markdownRef.current?.querySelectorAll(
      'code[class*="language-"]'
    );
    const languages: string[] = [];
    for (const element of elements ?? []) {
      const language = (
        Prism.util as unknown as { getLanguage(element: Element): string }
      ).getLanguage(element);
      if (language !== "none") {
        languages.push(language);
      }
    }
    Promise.allSettled(
      languages.map(
        (language) => import(`prismjs/components/prism-${language}.min.js`)
      )
    ).then((results) => {
      for (const result of results) {
        if (result.status === "rejected") {
          // eslint-disable-next-line no-console
          console.error("load prism language failed:", result.reason);
        }
      }
      setPrismLanguageLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (prismLanguageLoaded && chunk.type === "text" && markdownRef.current) {
      Prism.highlightAllUnder(markdownRef.current);
    }
  }, [chunk.type, chunkHtml, prismLanguageLoaded]);

  return (
    <>
      {chunk.type === "text" ? (
        <div
          className="markdown"
          ref={markdownRef}
          dangerouslySetInnerHTML={chunkHtml}
        />
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
