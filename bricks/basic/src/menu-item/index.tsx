import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import styleText from "./menuItem.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "../link/index.jsx";
import classNames from "classnames";
import { Target } from "../interface.js";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedLinkItem = wrapBrick<Link, LinkProps>("eo-link");

export interface MenuComponentProps {
  icon?: GeneralIconProps;
  active?: boolean;
  disabled?: boolean;
  target?: Target;
  href?: string;
  url?: string;
  key?: string;
  linkStyle?: React.CSSProperties;
}

/**
 * 菜单构件
 * @author sailor
 *
 * @part menu-item - 外层容器
 */
@defineElement("eo-menu-item", {
  styleTexts: [styleText],
  alias: ["basic.general-menu-item"],
})
class MenuItem extends ReactNextElement {
  /**
   * 图标
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 是否选中
   */
  @property({
    type: Boolean,
  })
  accessor active: boolean | undefined;

  /**
   * 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 链接跳转目标
   */
  @property() accessor target: Target | undefined;

  /**
   * 设置 `href` 时将使用原生 `<a>` 标签，通常用于外链的跳转
   */
  @property() accessor href: string | undefined;

  /**
   * 链接地址
   */
  @property() accessor url: string | undefined;

  /**
   * 链接样式
   * @group other
   */
  @property({ attribute: false }) accessor linkStyle:
    | React.CSSProperties
    | undefined;

  render() {
    return (
      <MenuItemComponent
        icon={this.icon}
        active={this.active}
        disabled={this.disabled}
        target={this.target}
        href={this.href}
        url={this.url}
        linkStyle={this.linkStyle}
      />
    );
  }
}

function MenuItemComponent({
  icon,
  disabled,
  active,
  url,
  href,
  target,
  linkStyle,
}: MenuComponentProps) {
  return (
    <div
      part="menu-item"
      className={classNames("menu-item", {
        disabled: disabled,
        active: active,
      })}
      onClick={(e) => {
        if (disabled) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      <WrappedLinkItem
        className="menu-item-link"
        url={url as string}
        href={href}
        target={target as Target}
        icon={icon}
        linkStyle={linkStyle}
      >
        <slot />
      </WrappedLinkItem>
    </div>
  );
}

export { MenuItem };
