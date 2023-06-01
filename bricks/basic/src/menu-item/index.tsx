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

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

export interface MenuComponentProps {
  icon?: GeneralIconProps;
  active?: boolean;
  disabled?: boolean;
}

/**
 * @id basic.general-menu
 * @name basic.general-menu
 * @docKind brick
 * @description 菜单构件
 * @author sailor
 *
 */
@defineElement("basic.general-menu-item", {
  styleTexts: [styleText],
})
class MenuItem extends ReactNextElement {
  /**
   * @kind GeneralIconProps
   * @required false
   * @default -
   * @description 图标
   * @group basic
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * @kind boolean
   * @required false
   * @default false
   * @description 是否选中
   * @group basic
   */
  @property({
    type: Boolean,
  })
  accessor active: boolean | undefined;

  /**
   * @kind boolean
   * @required false
   * @default false
   * @description 是否禁用
   * @group basic
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
          className="menu-item-icon"
          {...(icon as GeneralIconProps)}
        />
      )}
      <slot />
    </div>
  );
}

export { MenuItem };
