import React from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { ButtonProps, Button } from "../button/index.jsx";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import type {
  DropdownActionsProps,
  EoDropdownActions,
  DropdownActionsEvents,
  DropdownActionsEventsMapping,
} from "../dropdown-actions/index.js";
import type { Action, SimpleAction } from "../actions";
import type { ButtonType, ComponentSize, Shape } from "../interface.js";
import styleText from "./dropdown-button.shadow.css";

const { defineElement, property, event } = createDecorators();

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");
const WrappedDropdownActions = wrapBrick<
  EoDropdownActions,
  DropdownActionsProps,
  DropdownActionsEvents,
  DropdownActionsEventsMapping
>("eo-dropdown-actions", {
  onActionClick: "action.click",
  onVisibleChange: "visible.change",
});

export interface DropdownButtonEvents
  extends Pick<DropdownActionsEvents, "action.click"> {}

export interface DropdownButtonEventsMap
  extends Pick<DropdownActionsEventsMapping, "onActionClick"> {}

export interface DropdownButtonProps
  extends Pick<DropdownActionsProps, "actions" | "disabled">,
    Pick<ButtonProps, "size" | "shape" | "type" | "icon"> {
  btnText?: string;
}

interface DropdownButtonComponentProps extends DropdownButtonProps {
  onActionClick?: (action: SimpleAction) => void;
}

const defaultIcon: GeneralIconProps = {
  lib: "antd",
  icon: "setting",
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

  /**
   * 操作点击事件
   * @detail SimpleAction
   */
  @event({
    type: "action.click",
  })
  accessor #actionClickEvent!: EventEmitter<SimpleAction>;

  #handleActionClick = (action: SimpleAction): void => {
    this.#actionClickEvent.emit(action);
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
        onActionClick={this.#handleActionClick}
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
  onActionClick,
}: DropdownButtonComponentProps) {
  return (
    <WrappedDropdownActions
      actions={actions}
      disabled={disabled}
      onActionClick={(e) => onActionClick?.(e.detail)}
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
