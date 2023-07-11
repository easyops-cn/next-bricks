import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement } = createDecorators();

/**
 * 大屏框架构件-网格纹
 * @author jiezhou
 * @slot - 页面内容
 */
export
@defineElement("data-view.tech-mesh-base-view", {
  styleTexts: [styleText],
})
class TechMeshBaseView extends ReactNextElement {
  render() {
    return <TechMeshBaseViewComponent />;
  }
}

export function TechMeshBaseViewComponent() {
  return (
    <div className="layout-wrapper">
      <div>
        <slot name="titleBar" />
      </div>
      <div className="contentWrapper">
        <slot name="content" />
      </div>
    </div>
  );
}
