import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement } = createDecorators();

/**
 * 构件 `data-view.dot-view`
 */
export
@defineElement("data-view.dot-view", {
  styleTexts: [styleText],
})
class DotView extends ReactNextElement {
  render() {
    return (
      <div className="wrapper">
        <div className="bgDotWrapper">
          <div className="borderWrapper">
            <div className="titleBar">
              <slot name="titleBar"></slot>
            </div>
            <div className="content">
              <slot name="content"></slot>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function DotViewComponent() {
  // const { t } = useTranslation(NS);
  // const hello = t(K.HELLO);
  return <div>It works!</div>;
}
