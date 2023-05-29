import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { ButtonProps, Button } from "../button/index.jsx";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import { ButtonType, ComponentSize, Shape } from "../interface.js";
import type { Popover, PopoverProps } from "../popover/index.jsx";
import type { Menu } from "../menu/index.js";
import type { MenuItem } from "../menu-item/index.js";

const { defineElement, property } = createDecorators();

const WrappedButton = wrapBrick<Button, ButtonProps>("basic.general-button");
const WrappedPopover = wrapBrick<Popover, PopoverProps>(
  "basic.general-popover"
);
const WrappedMenu = wrapBrick<Menu, any>("basic.general-menu");
const WrappedMenuItem = wrapBrick<MenuItem, any>("basic.general-menu-item");
interface DropButtonProps {
  actions?: DropButtonItemProps[];
  btnText?: string;
  size?: ComponentSize;
  shape?: Shape;
  icon?: GeneralIconProps;
  handleClick: (event: string) => void;
}

type DropButtonItemProps = {
  text: string;
  event?: string;
  icon?: GeneralIconProps;
  disabled?: boolean;
};

const defaultIcon: GeneralIconProps = {
  lib: "antd",
  icon: "setting",
  theme: "filled",
};

/**
 * @id basic.dropdown-button
 * @name basic.dropdown-button
 * @docKind brick
 * @description 下拉按钮
 * @author sailor
 *
 */
@defineElement("basic.dropdown-button", {
  styleTexts: [],
})
class DropdownButton extends ReactNextElement {
  /**
   * @kind ButtonType
   * @required false
   * @default default
   * @description 按钮类型
   * @enums
   * @group basic
   */
  @property() accessor type: ButtonType | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property({
    attribute: false,
  })
  accessor actions: DropButtonItemProps[] | undefined;

  /**
   * @default 管理
   * @required false
   * @description 按钮默认文字
   */
  @property()
  accessor btnText: string | undefined;

  /**
   * @default { lib: "antd", icon: "setting", theme: "filled" }
   * @required false
   * @description 按钮默认图标
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property()
  accessor size: ComponentSize = "medium";

  /**
   * @kind "circle" | "round"
   * @required false
   * @default -
   * @description 按钮形状，支持圆形、椭圆形，不设置为默认方形
   * @enums "circle"|"round"
   * @group ui
   */
  @property()
  accessor shape: Shape | undefined;

  #handleClick = (eventName: string): void => {
    this.dispatchEvent(new CustomEvent(eventName));
  };

  render() {
    return (
      <DropdownButtonComponent
        actions={this.actions}
        btnText={this.btnText}
        size={this.size}
        icon={this.icon}
        shape={this.shape}
        type={this.type}
        handleClick={this.#handleClick}
      />
    );
  }
}

function DropdownButtonComponent({
  actions,
  btnText = "管理",
  size,
  icon,
  shape,
  type,
  handleClick,
}: DropButtonProps & ButtonProps) {
  return (
    <WrappedPopover placement="bottom">
      <WrappedButton
        slot="anchor"
        size={size}
        shape={shape}
        type={type}
        icon={icon ?? defaultIcon}
      >
        {btnText}
      </WrappedButton>
      {actions && (
        <WrappedMenu>
          {actions?.map((action, index) => {
            return (
              <WrappedMenuItem
                key={index}
                {...action}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  !action.disabled && action.event && handleClick(action.event);
                }}
              >
                {action.text}
              </WrappedMenuItem>
            );
          })}
        </WrappedMenu>
      )}
    </WrappedPopover>
  );
}

export { DropdownButton };
