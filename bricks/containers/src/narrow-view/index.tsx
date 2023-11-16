import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface NarrowViewProps {
  size?: NarrowViewSize;
}

export type NarrowViewSize = "small" | "medium" | "large" | "full";

/**
 * 窄布局视图（居中）
 *
 * @author steve
 *
 * @slot - 内容区
 *
 * @category container-layout
 */
export
@defineElement("eo-narrow-view", {
  styleTexts: [styleText],
})
class EoNarrowView extends ReactNextElement {
  /**
   * @default "medium"
   */
  @property()
  accessor size: NarrowViewSize | undefined;

  render() {
    return <slot />;
  }
}
