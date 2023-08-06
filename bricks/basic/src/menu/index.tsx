import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./menu.shadow.css";

const { defineElement, property } = createDecorators();

/**
 * 菜单构件
 * @author sailor
 *
 * @slot - 菜单内容
 */
@defineElement("eo-menu", {
  styleTexts: [styleText],
  alias: ["basic.general-menu"],
})
class Menu extends ReactNextElement {
  /**
   *  菜单布局方式 支持垂直、水平两种
   */
  @property()
  accessor mode: "vertical" | "horizontal" = "vertical";

  render() {
    return <slot />;
  }
}
export { Menu };
