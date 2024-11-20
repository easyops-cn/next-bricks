import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { MarkdownComponent, type LinkOptions } from "@next-shared/markdown";
import "@next-shared/markdown/dist/esm/host-context.css";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface MarkdownDisplayProps {
  content?: string;
}

/**
 * 用于展示 markdown 内容的构件。
 */
export
@defineElement("eo-markdown-display", {
  styleTexts: [styleText],
})
class MarkdownDisplay extends ReactNextElement implements MarkdownDisplayProps {
  @property()
  accessor content: string | undefined;

  @property({ attribute: false })
  accessor linkOptions: LinkOptions | undefined;

  render() {
    return (
      <MarkdownComponent
        content={this.content}
        linkOptions={this.linkOptions}
      />
    );
  }
}
