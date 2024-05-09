import React, { useCallback, useEffect, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { getBasePath } from "@next-core/runtime";
import type { BrickConf } from "@next-core/types";
import { JSON_SCHEMA, safeDump } from "js-yaml";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface ChatPreviewProps {
  storyboard?: BrickConf | BrickConf[];
}

/**
 * 构件 `visual-builder.chat-preview`
 */
export
@defineElement("visual-builder.chat-preview", {
  styleTexts: [styleText],
})
class ChatPreview extends ReactNextElement {
  @property({ attribute: false })
  accessor storyboard: BrickConf | BrickConf[] | undefined;

  render() {
    return <ChatPreviewComponent storyboard={this.storyboard} />;
  }
}

export function ChatPreviewComponent({ storyboard }: ChatPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>();
  const [ready, setReady] = useState(false);

  const handleIframeLoad = useCallback(() => {
    const check = () => {
      if ((iframeRef.current?.contentWindow as any)?._preview_only_render) {
        setReady(true);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    const render = (iframeRef.current?.contentWindow as any)
      ?._preview_only_render;
    if (!render) {
      return;
    }
    render("yaml", {
      yaml: safeDump(storyboard, {
        schema: JSON_SCHEMA,
        skipInvalid: true,
        noRefs: true,
        noCompatMode: true,
      }),
    });
  }, [ready, storyboard]);

  return (
    <iframe
      ref={iframeRef}
      src={`${getBasePath()}_brick-preview-v3_/preview/`}
      loading="lazy"
      onLoad={handleIframeLoad}
    />
  );
}
