import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

/**
 * 页面视图
 *
 * @author steve
 *
 * @slot - 内容区
 * @slot header - 顶栏
 * @slot sidebar - 侧边栏
 * @slot subSidebar - 子侧边栏
 *
 * @category container-layout
 */
export
@defineElement("eo-page-view", {
  styleTexts: [styleText],
})
class EoPageView extends ReactNextElement {
  render() {
    return <EoPageViewComponent />;
  }
}

export function EoPageViewComponent() {
  return (
    <>
      <div className="header">
        <slot name="header" />
      </div>
      <div className="main">
        <div className="sidebar">
          <slot name="sidebar" />
        </div>
        <div className="sub-sidebar">
          <slot name="subSidebar" />
        </div>
        <div className="content">
          <slot />
        </div>
      </div>
    </>
  );
}
