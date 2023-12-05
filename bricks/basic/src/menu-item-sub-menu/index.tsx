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
  collapsed?: boolean;
}

/**
 * 构件 `eo-menu-item-sub-menu`
 *
 * @insider
 */
export
@defineElement("eo-menu-item-sub-menu", {
  styleTexts: [styleText],
})
class EoMenuItemSubMenu extends ReactNextElement {
  /**
   * 图标
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * title样式
   */
  @property({
    attribute: false,
  })
  accessor titleStyle: React.CSSProperties | undefined;

  /**
   * 是否为折叠状态
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
        collapsed={this.collapsed}
      />
    );
  }
}

export function EoMenuItemSubMenuComponent(props: EoMenuSubMenuProps) {
  const { icon, titleStyle } = props;
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
              className="menu-item-icon"
              {...(icon as GeneralIconProps)}
            />
          )}
          <slot name="title"></slot>
        </span>
        <i className="sub-menu-item-arrow" part="sub-menu-item-arrow" />
      </div>

      <div className="content">
        <slot />
      </div>
    </div>
  );
}
