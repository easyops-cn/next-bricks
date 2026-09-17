import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import styleText from "./menuItem.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface MenuComponentProps {
  icon?: GeneralIconProps;
  active?: boolean;
  disabled?: boolean;
}

/**
 * 菜单项构件，支持图标、选中和禁用状态
 * @en A menu item brick that supports icon, active and disabled states
 * @author sailor
 *
 * @part menu-item - 外层容器
 * @partEn menu-item - The outer container
 * @part menu-item-icon - 菜单项图标
 * @partEn menu-item-icon - The menu item icon
 * @slot - 菜单项内容
 * @slotEn - The menu item content
 *
 * @insider
 */
@defineElement("eo-menu-item", {
  styleTexts: [styleText],
  alias: ["basic.general-menu-item"],
})
class MenuItem extends ReactNextElement {
  /**
   * 图标
   * @en Icon
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 是否选中
   * @en Whether it is selected
   */
  @property({
    type: Boolean,
  })
  accessor active: boolean | undefined;

  /**
   * 是否禁用
   * @en Whether it is disabled
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  render() {
    return (
      <MenuItemComponent
        icon={this.icon}
        active={this.active}
        disabled={this.disabled}
      />
    );
  }
}

function MenuItemComponent({ icon, disabled, active }: MenuComponentProps) {
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
      {icon && (
        <WrappedIcon
          part="menu-item-icon"
          className="menu-item-icon"
          {...(icon as GeneralIconProps)}
        />
      )}
      <slot />
    </div>
  );
}

export { MenuItem };
