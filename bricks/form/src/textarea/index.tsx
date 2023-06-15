import React, { useCallback, useEffect, useRef, useState } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import calculateAutoSizeStyle from "./calculateAutoSizeStyle.js";
import styleText from "./textarea.shadow.css";
import { wrapBrick } from "@next-core/react-element";
import classNames from "classnames";
import { FormItemElement } from "../form-item/FormItemElement.js";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import "@next-core/theme";

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "form.general-form-item"
);

type AutoSize =
  | boolean
  | {
      minRows: number;
      maxRows: number;
    };

interface TextareaProps extends FormItemProps {
  name?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  textareaStyle?: React.CSSProperties;
  minLength?: number;
  maxLength?: number;
  autoSize?: AutoSize;
  validateState?: string;
  onInputChange: (value: string) => void;
}

const { defineElement, property, event } = createDecorators();

/**
 * 通用多行文本输入框构件
 * @author sailor
 */
@defineElement("form.general-textarea", {
  styleTexts: [styleText],
})
class Textarea extends FormItemElement {
  /**
   * 字段名称
   */
  @property() accessor name: string | undefined;

  /**
   * 标签文字
   */
  @property() accessor label: string | undefined;

  /**
   * 值
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
   * 大小自适应
   */
  @property({
    attribute: false,
  })
  accessor autoSize: AutoSize | undefined;

  /**
   * 是否必填
   */
  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

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
   * 校验信息
   */
  @property({
    attribute: false,
  })
  accessor message: Record<string, string> | undefined;

  /**
   * 自定义样式
   */
  @property({ attribute: false }) accessor textareaStyle:
    | React.CSSProperties
    | undefined;

  /**
   * @detail
   * @description 值改变事件
   */
  @event({ type: "change" })
  accessor #InputChangeEvent!: EventEmitter<string>;

  handleInputChange = (value: string) => {
    this.value = value;
    this.#InputChangeEvent.emit(value);
  };

  render() {
    return (
      <TextareaComponent
        curElement={this}
        formElement={this.getFormElement()}
        name={this.name}
        label={this.label}
        value={this.value}
        required={this.required}
        placeholder={this.placeholder}
        disabled={this.disabled}
        minLength={this.minLength}
        maxLength={this.maxLength}
        autoSize={this.autoSize}
        textareaStyle={this.textareaStyle}
        validateState={this.validateState}
        max={this.max}
        min={this.min}
        message={this.message}
        trigger="handleInputChange"
        onInputChange={this.handleInputChange}
      />
    );
  }
}

export function TextareaComponent(props: TextareaProps) {
  const {
    name,
    placeholder,
    disabled,
    textareaStyle,
    minLength,
    maxLength,
    autoSize,
    validateState,
    onInputChange,
  } = props;
  const [value, setValue] = useState(props.value);
  const [autoSizeStyle, setAutoSizeStyle] = useState<React.CSSProperties>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [minRows, maxRows] = React.useMemo(() => {
    if (autoSize && typeof autoSize === "object") {
      return [autoSize.minRows, autoSize.maxRows];
    }

    return [];
  }, [autoSize]);

  const setAutoSize = useCallback(() => {
    const textareaElement = textareaRef.current as HTMLTextAreaElement;
    if (textareaElement && autoSize) {
      const textareaStyles = calculateAutoSizeStyle(
        textareaElement,
        minRows,
        maxRows
      );

      setAutoSizeStyle(textareaStyles);
    }
  }, [autoSize, maxRows, minRows]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setValue(e.target.value);
    onInputChange(e.target.value);
    setAutoSize();
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setAutoSize();
  }, [maxRows, minRows, setAutoSize]);

  return (
    <WrappedFormItem {...props}>
      <textarea
        ref={textareaRef}
        className={classNames({
          error: validateState === "error",
        })}
        name={name}
        value={value}
        disabled={disabled}
        style={{
          height: 94,
          ...textareaStyle,
          ...autoSizeStyle,
        }}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        onChange={handleInputChange}
      />
    </WrappedFormItem>
  );
}

export { Textarea };
