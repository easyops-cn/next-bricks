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

export type DropdownButtonEvents = Pick<DropdownActionsEvents, "action.click">;

export type DropdownButtonEventsMapping = Pick<
  DropdownActionsEventsMapping,
  "onActionClick"
>;

export interface DropdownButtonProps
  extends Pick<DropdownActionsProps, "actions" | "disabled" | "strategy">,
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
   * 弹出层如何定位
   * @default "absolute"
   */
  @property()
  accessor strategy: "absolute" | "fixed" | undefined;

  /**
   * 操作点击事件
   * @detail { key: 操作项的 key, text: 操作项文本, event: 自定义事件名, icon: 图标配置, disabled: 是否禁用, hidden: 是否隐藏, tooltip: 提示文字, url: 链接地址, href: 外部链接, target: 链接目标, danger: 是否为危险操作, dragConf: 拖拽配置 }
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
        strategy={this.strategy}
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
  strategy,
  onActionClick,
}: DropdownButtonComponentProps) {
  return (
    <WrappedDropdownActions
      actions={actions}
      disabled={disabled}
      strategy={strategy}
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
