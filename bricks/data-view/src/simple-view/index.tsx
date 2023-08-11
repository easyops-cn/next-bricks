import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement } = createDecorators();

/**
 * 构件 `data-view.simple-view`
 */
export
@defineElement("data-view.simple-view", {
  styleTexts: [styleText],
})
class SimpleView extends ReactNextElement {
  render() {
    return <SimpleViewComponent />;
  }
}

export function SimpleViewComponent() {
  return (
    <div className="wrapper">
      <div className="titleBar">
        <slot name="titleBar"></slot>
      </div>
      <div className="content">
        <slot name="content"></slot>
      </div>
    </div>
  );
}
