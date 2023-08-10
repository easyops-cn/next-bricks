import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { useUpdateMenuCollapsedState } from "../utils.js";

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

  const [slotRef] = useUpdateMenuCollapsedState(menuCollapsed);

  return (
    <div className="sidebar-menu">
      <div className="sidebar-menu-item-list">
        <slot ref={slotRef} />
      </div>
    </div>
  );
}
