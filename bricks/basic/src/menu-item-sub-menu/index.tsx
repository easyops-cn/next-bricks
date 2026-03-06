import React, { useState, useRef, useEffect } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  GeneralIconProps,
  GeneralIcon,
} from "@next-bricks/icons/general-icon";

import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface EoMenuSubMenuProps {
  label?: string;
  icon?: GeneralIconProps;
  titleStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  collapsed?: boolean;
}

/**
 * 菜单子菜单构件，点击标题可折叠或展开子菜单内容
 *
 * @part sub-menu-item - 外层容器
 * @part sub-menu-item-title - 子菜单标题容器
 * @part menu-item-icon - 标题图标
 * @part sub-menu-item-arrow - 折叠箭头指示器
 * @slot title - 子菜单标题内容
 * @slot - 子菜单内容，通常为菜单项
 * @insider
 */
export
@defineElement("eo-menu-item-sub-menu", {
  styleTexts: [styleText],
})
class EoMenuItemSubMenu extends ReactNextElement {
  /**
   * 标题区域的图标
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 标题区域的自定义样式
   */
  @property({
    attribute: false,
  })
  accessor titleStyle: React.CSSProperties | undefined;

  /**
   * 内容区域的自定义样式
   */
  @property({
    attribute: false,
  })
  accessor bodyStyle: React.CSSProperties | undefined;

  /**
   * 是否为折叠状态，折叠时隐藏子菜单内容，默认为折叠状态
   */
  @property({
    type: Boolean,
  })
  accessor collapsed: boolean | undefined = true;

  render() {
    return (
      <EoMenuItemSubMenuComponent
        icon={this.icon}
        titleStyle={this.titleStyle}
        bodyStyle={this.bodyStyle}
        collapsed={this.collapsed}
      />
    );
  }
}

export function EoMenuItemSubMenuComponent(props: EoMenuSubMenuProps) {
  const { icon, titleStyle, bodyStyle } = props;
  const titleRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(props.collapsed);

  useEffect(() => {
    const titleElem = titleRef.current;
    const handleClick = () => setCollapsed((curCollapsed) => !curCollapsed);
    titleElem?.addEventListener("click", handleClick);

    return () => {
      titleElem?.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      part="sub-menu-item"
      className={classNames("sub-menu-item", {
        collapsed,
      })}
    >
      <div
        part="sub-menu-item-title"
        className="sub-menu-item-title"
        style={titleStyle}
        ref={titleRef}
      >
        <span className="sub-menu-label">
          {icon && (
            <WrappedIcon
              part="menu-item-icon"
              className="menu-item-icon"
              {...(icon as GeneralIconProps)}
            />
          )}
          <slot name="title"></slot>
        </span>
        <i className="sub-menu-item-arrow" part="sub-menu-item-arrow" />
      </div>

      <div className="content" style={bodyStyle}>
        <slot />
      </div>
    </div>
  );
}
