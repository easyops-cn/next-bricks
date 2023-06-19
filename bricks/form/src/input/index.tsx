import React, { useEffect, useState } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ComponentSize, InputType } from "../interface.js";
import classNames from "classnames";
import { wrapBrick } from "@next-core/react-element";
import { FormItemElementBase } from "@next-shared/form";
import "@next-core/theme";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import styleText from "./input.shadow.css";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "form.general-form-item"
);

const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

interface InputProps extends FormItemProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  type?: InputType;
  size?: ComponentSize;
  inputStyle?: React.CSSProperties;
  minLength?: number;
  maxLength?: number;
  validateState?: string;
  trigger?: string;
  onInputChange: (value: string) => void;
}
const { defineElement, property, event } = createDecorators();

/**
 * 通用输入框构件
 * @author sailor
 * @slot prefix - 输入框前置插槽
 * @slot suffix - 输入框后置插槽
 */
@defineElement("form.general-input", {
  styleTexts: [styleText],
})
class Input extends FormItemElementBase {
  /**
   * 字段名称
   */
  @property() accessor name: string | undefined;

  /**
   * 标签文字
   */
  @property() accessor label: string | undefined;

  /**
   * 输入框值
   */
  @property() accessor value: string | undefined;

  /**
   * 占位说明
   */
  @property() accessor placeholder: string | undefined;

  /**
   * 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 是否显示清除按钮
   */
  @property({
    type: Boolean,
  })
  accessor clearable: boolean | undefined;

  /**
   * 类型
   * @default "text"
   */
  @property() accessor type: InputType | undefined;

  /**
   * 大小
   * @default "medium"
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * 最小长度
   */
  @property({
    type: Number,
  })
  accessor minLength: number | undefined;

  /**
   * 最大长度
   */
  @property({
    type: Number,
  })
  accessor maxLength: number | undefined;

  /**
   * 是否必填
   */
  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  /**
   * 正则校验规则
   */
  @property() accessor pattern: string | undefined;

  /**
   * 表单校验最大长度
   */
  @property({
    type: Number,
  })
  accessor max: number | undefined;

  /**
   * 表单校验最小长度
   */
  @property({
    type: Number,
  })
  accessor min: number | undefined;

  /**
   * 错误时显示消息
   */
  @property({
    attribute: false,
  })
  accessor message: Record<string, string> | undefined;

  /**
   * 输入框样式
   */
  @property({ attribute: false }) accessor inputStyle:
    | React.CSSProperties
    | undefined;

  /**
   * 值改变事件
   */
  @event({ type: "change" })
  accessor #inputChangeEvent!: EventEmitter<string>;

  handleInputChange = (value: string) => {
    this.value = value;
    this.#inputChangeEvent.emit(value);
  };

  render() {
    return (
      <InputComponent
        formElement={this.getFormElement()}
        curElement={this}
        name={this.name}
        label={this.label}
        required={this.required}
        pattern={this.pattern}
        min={this.min}
        max={this.max}
        message={this.message}
        value={this.value}
        placeholder={this.placeholder}
        type={this.type}
        size={this.size}
        clearable={this.clearable}
        disabled={this.disabled}
        minLength={this.minLength}
        maxLength={this.maxLength}
        inputStyle={this.inputStyle}
        validateState={this.validateState}
        trigger="handleInputChange"
        onInputChange={this.handleInputChange}
      />
    );
  }
}

export function InputComponent(props: InputProps) {
  const {
    name,
    placeholder,
    type,
    size = "medium",
    disabled,
    clearable,
    inputStyle,
    minLength,
    maxLength,
    validateState,
    onInputChange,
  } = props;
  const [value, setValue] = useState(props.value ?? "");
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    setValue(props.value ?? "");
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onInputChange(e.target.value);
  };

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleClear = () => {
    setValue("");
    onInputChange("");
  };

  return (
    <WrappedFormItem {...props}>
      <div
        className={classNames("input-wrapper", {
          focus,
          disabled,
          error: validateState === "error",
        })}
        style={inputStyle}
      >
        <span className="prefix">
          <slot name="prefix"></slot>
        </span>
        <input
          className={size}
          value={value}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <span className="suffix">
          {value && clearable && !disabled && (
            <WrappedGeneralIcon
              className="clear-button"
              icon="close-circle"
              lib="antd"
              theme="filled"
              onClick={handleClear}
            />
          )}
          <slot name="suffix"></slot>
        </span>
      </div>
    </WrappedFormItem>
  );
}

export { Input };
