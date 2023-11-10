import React, { useCallback, useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { useUpdateMenuCollapsedState } from "../utils.js";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

export interface EoSidebarMenuGroupProps {
  collapsed?: boolean;
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
   * 是否折叠
   */
  @property({ type: Boolean })
  accessor collapsed: boolean | undefined;

  /**
   * 菜单整体是否收起状态
   */
  @property({ type: Boolean })
  accessor menuCollapsed: boolean | undefined;

  #handleCollapseChang = (collapsed: boolean) => {
    this.collapsed = collapsed;
  };

  render() {
    return (
      <EoSidebarMenuGroupComponent
        collapsed={this.collapsed}
        menuCollapsed={this.menuCollapsed}
        onCollapseChange={this.#handleCollapseChang}
      />
    );
  }
}

interface EoSidebarMenuGroupComponentProps extends EoSidebarMenuGroupProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export function EoSidebarMenuGroupComponent(
  props: EoSidebarMenuGroupComponentProps
) {
  const { collapsed, menuCollapsed, onCollapseChange } = props;

  const [slotRef] = useUpdateMenuCollapsedState(menuCollapsed);

  const titleRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    !menuCollapsed && onCollapseChange?.(!collapsed);
  }, [menuCollapsed, onCollapseChange, collapsed]);

  useEffect(() => {
    const titleElem = titleRef.current;
    titleElem?.addEventListener("click", handleClick);

    return () => {
      titleElem?.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return (
    <div
      className={classNames("menu-group", {
        "menu-group-collapsed": menuCollapsed ? true : collapsed,
      })}
    >
      <div className="menu-group-title" ref={titleRef}>
        <span className="menu-group-title-icon-container">
          <span className="menu-group-title-icon"></span>
        </span>
        <div className="menu-group-title-text">
          <slot name="title" />
        </div>
        <span className="menu-group-arrow" />
      </div>
      <div className="menu-group-list">
        <div className="menu-group-list-inner">
          <slot ref={slotRef} />
        </div>
      </div>
    </div>
  );
}
