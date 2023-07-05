import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { ButtonProps, Button } from "../button/index.jsx";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import { ButtonType, ComponentSize, Shape } from "../interface.js";
import type { Popover, PopoverProps } from "../popover/index.jsx";
import type { Menu } from "../menu/index.js";
import type { MenuItem } from "../menu-item/index.js";
import styleText from "./dropdown-button.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");
const WrappedPopover = wrapBrick<Popover, PopoverProps>("eo-popover");
const WrappedMenu = wrapBrick<Menu, any>("eo-menu");
const WrappedMenuItem = wrapBrick<MenuItem, any>("eo-menu-item");
interface DropButtonProps {
  actions?: DropButtonItemProps[];
  btnText?: string;
  size?: ComponentSize;
  shape?: Shape;
  icon?: GeneralIconProps;
  disabled?: boolean;
  handleClick: (event: string) => void;
}

type DropButtonItemProps = {
  text: string;
  event?: string;
  icon?: GeneralIconProps;
  disabled?: boolean;
  hidden?: boolean;
};

const defaultIcon: GeneralIconProps = {
  lib: "antd",
  icon: "setting",
  theme: "filled",
};

/**
 * 下拉按钮
 * @author sailor
 */
@defineElement("eo-dropdown-button", {
  styleTexts: [styleText],
  alias: ["basic.dropdown-button"],
})
class DropdownButton extends ReactNextElement {
  /**
   * 按钮类型
   */
  @property() accessor type: ButtonType | undefined;

  /**
   * 下拉按钮菜单
   */
  @property({
    attribute: false,
  })
  accessor actions: DropButtonItemProps[] | undefined;

  /**
   * 按钮默认文字
   * @default "管理"
   */
  @property()
  accessor btnText: string | undefined;

  /**
   * 按钮默认图标
   * @default { lib: "antd", icon: "setting", theme: "filled" }
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 按钮大小
   * @default "medium"
   */
  @property()
  accessor size: ComponentSize = "medium";

  /**
   * 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 按钮形状
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
        disabled={this.disabled}
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
  disabled,
  handleClick,
}: DropButtonProps & ButtonProps) {
  return (
    <WrappedPopover placement="bottom" sync="width">
      <WrappedButton
        slot="anchor"
        size={size}
        shape={shape}
        type={type}
        disabled={disabled}
        icon={icon ?? defaultIcon}
      >
        {btnText}
      </WrappedButton>
      {actions && !disabled && (
        <WrappedMenu style={{ minWidth: "max-content" }}>
          {actions
            ?.filter((action) => !action.hidden)
            .map((action, index) => {
              return (
                <WrappedMenuItem
                  className="wrapped-menu-item"
                  key={index}
                  {...action}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    !action.disabled &&
                      action.event &&
                      handleClick(action.event);
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
