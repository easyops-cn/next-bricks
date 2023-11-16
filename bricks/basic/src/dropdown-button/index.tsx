import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { ButtonProps, Button } from "../button/index.jsx";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import type {
  DropdownActionsProps,
  EoDropdownActions,
  DropdownActionsEvents,
  DropdownActionsEventsMapping,
  Action,
  SimpleAction,
} from "../dropdown-actions/index.js";
import type { ButtonType, ComponentSize, Shape } from "../interface.js";
import styleText from "./dropdown-button.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");
const WrappedDropdownActions = wrapBrick<
  EoDropdownActions,
  DropdownActionsProps,
  DropdownActionsEvents,
  DropdownActionsEventsMapping
>("eo-dropdown-actions", {
  onActionClick: "action.click",
});

interface DropButtonProps {
  actions?: Action[];
  btnText?: string;
  size?: ComponentSize;
  shape?: Shape;
  icon?: GeneralIconProps;
  disabled?: boolean;
  handleClick: (action: SimpleAction) => void;
}

const defaultIcon: GeneralIconProps = {
  lib: "antd",
  icon: "setting",
  theme: "filled",
};

/**
 * 下拉按钮
 * @author sailor
 * @category interact-basic
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
  accessor actions: Action[] | undefined;

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

  #handleClick = (action: SimpleAction): void => {
    action.event && this.dispatchEvent(new CustomEvent(action.event));
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
    <WrappedDropdownActions
      actions={actions}
      disabled={disabled}
      onActionClick={(e) => handleClick?.(e.detail)}
    >
      <WrappedButton
        size={size}
        shape={shape}
        type={type}
        disabled={disabled}
        icon={icon ?? defaultIcon}
      >
        {btnText}
      </WrappedButton>
    </WrappedDropdownActions>
  );
}

export { DropdownButton };
