import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement } = createDecorators();

/**
 * 菜单分组构件，用于对菜单项进行分组展示，提供标题插槽和内容插槽
 *
 * @part menu-group - 外层容器
 * @part menu-group-title - 分组标题容器
 * @slot title - 分组标题内容
 * @slot - 分组内容，通常为菜单项
 * @insider
 */
export
@defineElement("eo-menu-group", {
  styleTexts: [styleText],
})
class EoMenuGroup extends ReactNextElement {
  render() {
    return <EoMenuGroupComponent />;
  }
}

export function EoMenuGroupComponent() {
  return (
    <div part="menu-group">
      <div part="menu-group-title" className="menu-group-title">
        <slot name="title" />
      </div>

      <slot />
    </div>
  );
}
