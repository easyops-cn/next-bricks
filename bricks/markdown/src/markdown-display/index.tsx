import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { MarkdownComponent } from "@next-shared/markdown";
import styleText from "./styles.shadow.css";
import "./host-context.css";

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

  render() {
    return <MarkdownComponent content={this.content} />;
  }
}
