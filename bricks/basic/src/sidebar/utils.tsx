import React, { useCallback, useEffect, useRef } from "react";

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
