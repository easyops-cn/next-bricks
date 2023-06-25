import React from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  SidebarMenuGroup,
  SidebarMenuItem,
  SidebarMenuSimpleItem,
} from "@next-shared/general/types";
import type { Link, LinkProps } from "../link/index.js";
import { Target } from "../interface.js";

const WrappedLinkItem = wrapBrick<Link, LinkProps>("basic.general-link");

export function isGroup(item: SidebarMenuItem): item is SidebarMenuGroup {
  return item.type === "group";
}

export function isSubMenu(
  item: SidebarMenuGroup,
  groupAsSubMenu?: boolean
): item is SidebarMenuGroup {
  return Boolean(
    item.type === "subMenu" || (groupAsSubMenu && item.type === "group")
  );
}

export function isSimple(item: SidebarMenuItem): item is SidebarMenuSimpleItem {
  return item.type === "default";
}

export const renderLinkCom = (
  item: SidebarMenuSimpleItem,
  linkStyle?: React.CSSProperties
): React.ReactElement => {
  return (
    <WrappedLinkItem
      key={item.key}
      url={item.to as string}
      href={item.href}
      target={item.target as Target}
      style={linkStyle}
    >
      <span className="menu-item-label">{item.text}</span>
    </WrappedLinkItem>
  );
};

export const renderSpanCom = (item: SidebarMenuGroup): React.ReactElement => {
  return (
    <span key={item.key} className="menu-item-label">
      {item.title}
    </span>
  );
};
