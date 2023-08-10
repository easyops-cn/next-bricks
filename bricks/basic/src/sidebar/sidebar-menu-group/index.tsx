import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { useUpdateMenuCollapsedState } from "../utils.js";

const { defineElement, property } = createDecorators();

export interface EoSidebarMenuGroupProps {
  menuCollapsed?: boolean;
}

/**
 * 侧栏菜单分组
 * @slot title - 分组标题
 */
export
@defineElement("eo-sidebar-menu-group", {
  styleTexts: [styleText],
})
class EoSidebarMenuGroup
  extends ReactNextElement
  implements EoSidebarMenuGroupProps
{
  /**
   * 菜单整体是否收起状态
   */
  @property({ type: Boolean })
  accessor menuCollapsed: boolean | undefined;

  render() {
    return <EoSidebarMenuGroupComponent menuCollapsed={this.menuCollapsed} />;
  }
}

export function EoSidebarMenuGroupComponent(props: EoSidebarMenuGroupProps) {
  const { menuCollapsed } = props;

  const [slotRef] = useUpdateMenuCollapsedState(menuCollapsed);

  return (
    <div className="menu-group">
      <div className="menu-group-title">
        <span className="menu-group-title-icon-container">
          <span className="menu-group-title-icon"></span>
        </span>
        <div className="menu-group-title-text">
          <slot name="title" />
        </div>
      </div>
      <div className="menu-group-list">
        <slot ref={slotRef} />
      </div>
    </div>
  );
}
