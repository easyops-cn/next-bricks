import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement } = createDecorators();

/**
 * 内容区流式布局（上下），为子元素之间提供默认的间距。
 *
 * @author steve
 *
 * @slot - 内容区
 */
export
@defineElement("eo-content-layout", {
  styleTexts: [styleText],
})
class EoContentLayout extends ReactNextElement {
  render() {
    return <slot />;
  }
}
