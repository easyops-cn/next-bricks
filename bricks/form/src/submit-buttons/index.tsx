import React from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import { FormItemElementBase } from "@next-shared/form";
import styleText from "./index.shadow.css";
import type { FormItem, FormItemProps } from "../form-item/index.js";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import type { ButtonType } from "../interface.js";

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");
const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");

interface SubmitButtonsProps extends FormItemProps {
  curElement: HTMLElement;
  submitText?: string;
  submitType?: ButtonType;
  submitDisabled?: boolean;
  cancelText?: string;
  cancelType?: ButtonType;
  onSubmitClick?: (event: React.MouseEvent) => void;
  onCancelClick?: (event: React.MouseEvent) => void;
}

const { defineElement, property, event } = createDecorators();

/**
 * 表单提交按钮
 * @author zhendonghuang
 * @category form-input-basic
 */
@defineElement("eo-submit-buttons", {
  styleTexts: [styleText],
  alias: ["form.submit-buttons"],
})
class SubmitButtons extends FormItemElementBase {
  /**
   * 提交按钮的文字
   * @default "提交"
   */
  @property() accessor submitText: string = "提交";

  /**
   * 取消按钮的文字，不设置则不显示取消按钮
   */
  @property()
  accessor cancelText: string | undefined;

  /**
   * 点击确定按钮后自动禁用
   */
  @property({ type: Boolean })
  accessor disableAfterClick: boolean | undefined;

  /**
   * 禁用提交按钮
   */
  @property({ type: Boolean }) accessor submitDisabled: boolean | undefined;

  /**
   * 提交按钮类型
   */
  @property() accessor submitType: ButtonType | undefined;

  /**
   * 取消按钮类型
   */
  @property() accessor cancelType: ButtonType | undefined;

  /**
   * 点击提交按钮触发的事件
   */
  @event({ type: "submit" }) accessor #submitEvent!: EventEmitter<void>;

  /**
   * 点击取消按钮触发的事件
   */
  @event({ type: "cancel" }) accessor #cancelEvent!: EventEmitter<void>;

  private _handleSubmitClick = (): void => {
    Promise.resolve().then(() => {
      this.#submitEvent.emit();
      if (this.getFormElement()) {
        (this.getFormElement() as any).validate();
      }
      if (this.disableAfterClick) {
        this.submitDisabled = true;
      }
    });
  };

  private _handleCancelClick = (): void => {
    Promise.resolve().then(() => {
      this.#cancelEvent.emit();
    });
  };

  render() {
    return (
      <ButtonsComponent
        formElement={this.getFormElement()}
        curElement={this}
        submitDisabled={this.submitDisabled}
        submitText={this.submitText}
        submitType={this.submitType}
        cancelText={this.cancelText}
        cancelType={this.cancelType}
        onCancelClick={this._handleCancelClick}
        onSubmitClick={this._handleSubmitClick}
      />
    );
  }
}

export function ButtonsComponent(props: SubmitButtonsProps) {
  return (
    <WrappedFormItem {...props}>
      {props.submitText && (
        <WrappedButton
          className={"submitBtn"}
          type={props.submitType || "primary"}
          onClick={props.onSubmitClick}
          disabled={props.submitDisabled}
        >
          {props.submitText}
        </WrappedButton>
      )}
      {props.cancelText && (
        <WrappedButton
          data-test-id="cancelBtn"
          type={props.cancelType || "text"}
          onClick={props.onCancelClick}
        >
          {props.cancelText}
        </WrappedButton>
      )}
    </WrappedFormItem>
  );
}
export { SubmitButtons };
