import React from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  SidebarMenuGroup,
  SidebarMenuItem,
  SidebarMenuSimpleItem,
} from "@next-shared/general/types";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const WrappedLinkItem = wrapBrick<Link, LinkProps>("eo-link");

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
  return item.type === "default" || !item.type;
}

export const renderLinkCom = (
  item: SidebarMenuSimpleItem,
  linkStyle?: React.CSSProperties
): React.ReactElement => {
  return (
    <WrappedLinkItem
      type="plain"
      key={item.key}
      url={item.to as string}
      href={item.href}
      target={item.target as LinkProps["target"]}
      style={linkStyle}
    >
      <span className="menu-item-label">{item.text}</span>
    </WrappedLinkItem>
  );
};

export const renderSpanCom = (
  item: SidebarMenuGroup,
  subMenu?: boolean
): React.ReactElement => {
  return (
    <span key={item.key} className="menu-item-label">
      {item.title}
      {subMenu && <WrappedIcon lib="fa" icon="angle-right" />}
    </span>
  );
};
