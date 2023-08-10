import React, { useCallback, useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { isSidebarMenuItem } from "../utils.js";

const { defineElement, property } = createDecorators();

export interface EoSidebarMenuProps {
  menuCollapsed?: boolean;
}

/**
 * 侧栏菜单
 */
export
@defineElement("eo-sidebar-menu", {
  styleTexts: [styleText],
})
class EoSidebarMenu extends ReactNextElement implements EoSidebarMenuProps {
  /**
   * 菜单整体是否收起状态
   */
  @property({ type: Boolean })
  accessor menuCollapsed: boolean | undefined;

  render() {
    return <EoSidebarMenuComponent menuCollapsed={this.menuCollapsed} />;
  }
}

export function EoSidebarMenuComponent(props: EoSidebarMenuProps) {
  const { menuCollapsed } = props;

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

  return (
    <div className="sidebar-menu">
      <div className="sidebar-menu-item-list">
        <slot ref={slotRef} />
      </div>
    </div>
  );
}
