import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { getCssPropertyValue } from "@next-core/runtime";
import { wrapBrick } from "@next-core/react-element";
import type {
  SidebarMenu,
  SidebarMenuGroup,
  SidebarMenuItem,
  SidebarMenuSimpleItem,
} from "@next-shared/general/types";
import type {
  EoSidebarMenu,
  EoSidebarMenuProps,
} from "./sidebar-menu/index.js";
import type {
  EoSidebarMenuItem,
  EoSidebarMenuItemProps,
} from "./sidebar-menu-item/index.js";
import type {
  EoSidebarMenuGroup,
  EoSidebarMenuGroupProps,
} from "./sidebar-menu-group/index.js";
import type {
  EoSidebarMenuSubmenu,
  EoSidebarMenuSubmenuProps,
} from "./sidebar-menu-submenu/index.js";
import { isSubMenu, isGroup } from "@next-shared/general/menu";

const sidebarMenuItemTagNameSet = new Set([
  "EO-SIDEBAR-MENU-ITEM",
  "EO-SIDEBAR-MENU-GROUP",
  "EO-SIDEBAR-MENU-SUBMENU",
]);

const isSidebarMenuItem = (element: Element) =>
  sidebarMenuItemTagNameSet.has(element.tagName);

export function useUpdateMenuCollapsedState(menuCollapsed?: boolean) {
  const slotRef = useRef<HTMLSlotElement>(null);

  const updateChildrenMenuCollapsedState = useCallback(() => {
    slotRef.current?.assignedElements().forEach((ele) => {
      if (isSidebarMenuItem(ele)) {
        (ele as any).menuCollapsed = menuCollapsed;
      }
    });
  }, [menuCollapsed]);

  useEffect(() => {
    updateChildrenMenuCollapsedState();
  }, [menuCollapsed, updateChildrenMenuCollapsedState]);

  useEffect(() => {
    const slotElem = slotRef.current;
    const handleSlotchange = () => {
      updateChildrenMenuCollapsedState();
    };
    slotElem?.addEventListener("slotchange", handleSlotchange);

    return () => {
      slotElem?.removeEventListener("slotchange", handleSlotchange);
    };
  }, [updateChildrenMenuCollapsedState]);

  return [slotRef];
}

export const SIDE_BAR_HAS_BEEN_USED = "side-bar-has-been-used";
export const SIDE_BAR_EXPAND_STATE = "side-bar-expand-state";
export const SIDE_BAR_RESIZE_WIDTH = "side-bar-resize-width";

export enum ExpandedState {
  Collapsed = "collapsed",
  Hovered = "hovered",
  Expanded = "expanded",
}

export const sideBarWidth =
  parseInt(getCssPropertyValue("--side-bar-width"), 10) || 208;
export const sideBarCollapsedWidth =
  parseInt(getCssPropertyValue("--side-bar-collapsed-width"), 10) || 60;

const WrappedSidebarMenu = wrapBrick<EoSidebarMenu, EoSidebarMenuProps>(
  "eo-sidebar-menu"
);
const WrappedSidebarMenuItem = wrapBrick<
  EoSidebarMenuItem,
  EoSidebarMenuItemProps
>("eo-sidebar-menu-item");
const WrappedSidebarMenuGroup = wrapBrick<
  EoSidebarMenuGroup,
  EoSidebarMenuGroupProps
>("eo-sidebar-menu-group");
const WrappedSidebarMenuSubmenu = wrapBrick<
  EoSidebarMenuSubmenu,
  EoSidebarMenuSubmenuProps
>("eo-sidebar-menu-submenu");

function renderItem(item: SidebarMenuSimpleItem): ReactNode {
  return (
    <WrappedSidebarMenuItem
      key={item.key}
      url={item.to as any}
      href={item.href}
      target={item.target as any}
      icon={item.icon}
    >
      {item.text}
    </WrappedSidebarMenuItem>
  );
}

function renderGroup(item: SidebarMenuGroup): ReactNode {
  if (item.items?.length > 0) {
    return (
      <WrappedSidebarMenuGroup key={item.key}>
        <span slot="title">{item.title}</span>
        {item.items.map((innerItem) => renderMenuItem(innerItem))}
      </WrappedSidebarMenuGroup>
    );
  }
}

function renderSubmenu(item: SidebarMenuGroup): ReactNode {
  if (item.items?.length > 0) {
    return (
      <WrappedSidebarMenuSubmenu key={item.key} icon={item.icon}>
        <span slot="title">{item.title}</span>
        {item.items.map((innerItem) => renderMenuItem(innerItem))}
      </WrappedSidebarMenuSubmenu>
    );
  }
}

function renderMenuItem(item: SidebarMenuItem): ReactNode {
  return isSubMenu(item)
    ? renderSubmenu(item)
    : isGroup(item)
    ? renderGroup(item)
    : renderItem(item);
}

export function renderMenu(menu: SidebarMenu, expandedState: ExpandedState) {
  return (
    <WrappedSidebarMenu
      menuCollapsed={expandedState === ExpandedState.Collapsed}
    >
      {menu?.menuItems?.map((item) => renderMenuItem(item))}
    </WrappedSidebarMenu>
  );
}
