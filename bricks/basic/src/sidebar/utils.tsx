import React, { useCallback, useEffect, useRef } from "react";
import { getCssPropertyValue } from "@next-core/runtime";
import { wrapBrick } from "@next-core/react-element";
import type {
  SidebarMenu as SidebarMenuType,
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

function MenuSimpleItem(props: SidebarMenuSimpleItem) {
  const { to, href, target, icon, text } = props;
  return (
    <WrappedSidebarMenuItem
      url={to as any}
      href={href}
      target={target as any}
      icon={icon}
    >
      {text}
    </WrappedSidebarMenuItem>
  );
}

function MenuGroup(props: SidebarMenuGroup) {
  const { title, items } = props;

  if (items?.length > 0) {
    return (
      <WrappedSidebarMenuGroup>
        <span slot="title">{title}</span>
        {props.items.map((item) => {
          return <MenuItem key={item.key} {...item} />;
        })}
      </WrappedSidebarMenuGroup>
    );
  }
  return null;
}

function MenuSubmenu(props: SidebarMenuGroup) {
  const { title, icon, items } = props;

  if (items?.length > 0) {
    return (
      <WrappedSidebarMenuSubmenu icon={icon}>
        <span slot="title">{title}</span>
        {props.items.map((item) => {
          return <MenuItem key={item.key} {...item} />;
        })}
      </WrappedSidebarMenuSubmenu>
    );
  }
  return null;
}

function MenuItem(props: SidebarMenuItem) {
  if (props.type === "subMenu") {
    return <MenuSubmenu {...props} />;
  } else if (props.type === "group") {
    return <MenuGroup {...props} />;
  } else {
    return <MenuSimpleItem {...(props as SidebarMenuSimpleItem)} />;
  }
}

export function SidebarMenu(props: {
  menu: SidebarMenuType;
  expandedState: ExpandedState;
}) {
  const { menu, expandedState } = props;

  return (
    <WrappedSidebarMenu
      menuCollapsed={expandedState === ExpandedState.Collapsed}
    >
      {menu?.menuItems?.map((item) => {
        return <MenuItem key={item.key} {...item} />;
      })}
    </WrappedSidebarMenu>
  );
}
