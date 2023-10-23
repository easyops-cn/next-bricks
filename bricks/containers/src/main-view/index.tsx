import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-main-view`
 * @author steve
 * @slot - 内容区
 * @slot breadcrumb - 面包屑
 * @slot pageTitle - 页面标题
 * @slot toolbar - 工具栏
 */
export
@defineElement("eo-main-view", {
  styleTexts: [styleText],
})
class EoMainView extends ReactNextElement {
  render() {
    return <EoMainViewComponent />;
  }
}

export function EoMainViewComponent() {
  return (
    <>
      <div className="banner">
        <div className="breadcrumb">
          <slot name="breadcrumb" />
        </div>
        <div className="titlebar">
          <div className="page-title">
            <slot name="pageTitle" />
          </div>
          <div className="toolbar">
            <slot name="toolbar" />
          </div>
        </div>
      </div>
      <div className="content">
        <slot />
      </div>
    </>
  );
}
