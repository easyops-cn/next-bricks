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
 * @id form.general-textarea
 * @name form.general-textarea
 * @docKind brick
 * @description 通用多行文本输入框构件
 * @author sailor
 * @noInheritDoc
 */
@defineElement("form.general-textarea", {
  styleTexts: [styleText],
})
class Textarea extends FormItemElement {
  /**
   * @kind string
   * @required false
   * @default default
   * @description 字段名称
   * @enums
   * @group basic
   */
  @property() accessor name: string | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property() accessor label: string | undefined;

  /**
   * @kind string
   * @required false
   * @default default
   * @description 初始值
   * @enums
   * @group basic
   */
  @property() accessor value: string | undefined;

  /**
   * @kind string
   * @required false
   * @default middle
   * @description 占位说明
   * @enums
   * @group basic
   */
  @property() accessor placeholder: string | undefined;

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

  /**
   * @kind number
   * @required false
   * @default -
   * @description 最小长度
   * @group basicFormItem
   */
  @property({
    type: Number,
  })
  accessor minLength: number | undefined;

  /**
   * @kind number
   * @required false
   * @default -
   * @description 最大长度
   * @group basicFormItem
   */
  @property({
    type: Number,
  })
  accessor maxLength: number | undefined;

  /**
   * @kind boolean
   * @required false
   * @default -
   * @description 大小子摄影
   * @group basicFormItem
   */
  @property({
    attribute: false,
  })
  accessor autoSize: AutoSize | undefined;

  /**
   * @kind boolean
   * @required false
   * @default -
   * @description 表单项是否必填
   * @group basicFormItem
   */
  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  /**
   * @kind React.CSSProperties
   * @required false
   * @default -
   * @description 样式
   * @group other
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
        trigger="handleInputChange"
        onInputChange={this.handleInputChange}
      />
    );
  }
}

export function TextareaComponent(props: TextareaProps) {
  const {
    name,
    value,
    placeholder,
    disabled,
    textareaStyle,
    minLength,
    maxLength,
    autoSize,
    validateState,
    onInputChange,
  } = props;
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
    onInputChange(e.target.value);
    setAutoSize();
  };

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
        value={value ?? ""}
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
