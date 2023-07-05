import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./menu.shadow.css";

const { defineElement } = createDecorators();

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
  render() {
    return <slot />;
  }
}
export { Menu };
