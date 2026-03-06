import React from "react";
import { LocationDescriptor } from "history";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import { SidebarMenuItem } from "@next-shared/general/types";
import styleText from "./menu.shadow.css";

const { defineElement, property } = createDecorators();

export interface SidebarMenu {
  title: string;
  icon?: GeneralIconProps;
  link?: LocationDescriptor;
  defaultCollapsed?: boolean;
  defaultCollapsedBreakpoint?: number;
  menuItems: SidebarMenuItem[];
}

export interface MenuProps {
  mode?: "vertical" | "horizontal";
}

/**
 * 菜单构件，支持垂直和水平两种布局方式
 * @author sailor
 *
 * @slot - 菜单内容
 * @insider
 */
export
@defineElement("eo-menu", {
  styleTexts: [styleText],
  alias: ["basic.general-menu"],
})
class Menu extends ReactNextElement implements MenuProps {
  /**
   * 菜单布局方式，支持垂直（vertical）和水平（horizontal）两种模式
   */
  @property()
  accessor mode: "vertical" | "horizontal" = "vertical";

  render() {
    return <slot />;
  }
}
