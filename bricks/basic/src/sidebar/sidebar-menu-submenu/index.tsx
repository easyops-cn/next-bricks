import React, { useCallback, useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";
import { isSidebarMenuItem } from "../utils.js";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface EoSidebarMenuSubmenuProps {
  icon?: GeneralIconProps;
  collapsed?: boolean;
  menuCollapsed?: boolean;
}

/**
 * 侧栏菜单子菜单
 * @slot title - 子菜单标题
 */
export
@defineElement("eo-sidebar-menu-submenu", {
  styleTexts: [styleText],
})
class EoSidebarMenuSubmenu
  extends ReactNextElement
  implements EoSidebarMenuSubmenuProps
{
  /**
   * 菜单的图标
   */
  @property({ attribute: false })
  accessor icon: GeneralIconProps | undefined;

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
      <EoSidebarMenuSubmenuComponent
        icon={this.icon}
        collapsed={this.collapsed}
        menuCollapsed={this.menuCollapsed}
        onCollapseChange={this.#handleCollapseChang}
      />
    );
  }
}

interface EoSidebarMenuSubmenuComponentProps extends EoSidebarMenuSubmenuProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export function EoSidebarMenuSubmenuComponent(
  props: EoSidebarMenuSubmenuComponentProps
) {
  const { icon, collapsed, menuCollapsed, onCollapseChange } = props;

  const titleRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSlotElement>(null);

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
    <div
      className={classNames("menu-submenu", {
        "menu-submenu-collapsed": menuCollapsed ? true : collapsed,
      })}
    >
      <div className="menu-submenu-title" ref={titleRef}>
        <span className="menu-submenu-title-icon-container">
          <WrappedIcon {...icon!} className="menu-submenu-title-icon" />
        </span>
        <span className="menu-submenu-title-text">
          <slot name="title" />
        </span>
        <span className="menu-submenu-arrow" />
      </div>
      <div className="menu-sub">
        <div className="menu-sub-inner">
          <slot ref={slotRef} />
        </div>
      </div>
    </div>
  );
}
