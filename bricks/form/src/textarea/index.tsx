import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { FormItemElementBase } from "@next-shared/form";
import calculateAutoSizeStyle from "./calculateAutoSizeStyle.js";
import styleText from "./textarea.shadow.css";
import { wrapBrick } from "@next-core/react-element";
import classNames from "classnames";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import "@next-core/theme";

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

type AutoSize =
  | boolean
  | {
      minRows?: number;
      maxRows?: number;
    };
export interface TextareaComponentRef {
  focus(): void;
}

export interface TextareaProps extends FormItemProps {
  name?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  textareaStyle?: React.CSSProperties;
  minLength?: number;
  maxLength?: number;
  autoSize?: AutoSize;
  validateState?: string;
}

export interface TextareaComponentProps extends TextareaProps {
  onInputChange: (value: string) => void;
}

const { defineElement, property, event, method } = createDecorators();

/**
 * 通用多行文本输入框构件
 * @author sailor
 * @category form-input-basic
 */
@defineElement("eo-textarea", {
  styleTexts: [styleText],
  alias: ["form.general-textarea"],
})
class Textarea extends FormItemElementBase implements TextareaProps {
  #componentRef = createRef<TextareaComponentRef>();

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

  /**
   * focus
   */
  @method({ bound: true })
  focusTextarea() {
    return this.#componentRef.current?.focus();
  }

  handleInputChange = (value: string) => {
    this.value = value;
    this.#InputChangeEvent.emit(value);
  };

  render() {
    return (
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
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
        notRender={this.notRender}
        labelBrick={this.labelBrick}
        helpBrick={this.helpBrick}
        textareaStyle={this.textareaStyle}
        validateState={this.validateState}
        max={this.max}
        min={this.min}
        message={this.message}
        trigger="handleInputChange"
        ref={this.#componentRef}
        onInputChange={this.handleInputChange}
      />
    );
  }
}

export const TextareaComponent = forwardRef<
  TextareaComponentRef,
  TextareaComponentProps
>(function TextareaComponent(props, ref) {
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
  const [value, setValue] = useState(props.value ?? "");
  const [autoSizeStyle, setAutoSizeStyle] = useState<React.CSSProperties>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [minRows, maxRows] = React.useMemo(() => {
    if (autoSize && typeof autoSize === "object") {
      return [autoSize.minRows, autoSize.maxRows];
    }

    return [];
  }, [autoSize]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        const textarea = textareaRef.current;

        if (textarea) {
          const valueLength = textarea.value?.length;

          textarea.focus();
          valueLength && textarea.setSelectionRange(valueLength, valueLength);
        }
      },
    }),
    []
  );

  const setAutoSize = useCallback(() => {
    const textareaElement = textareaRef.current;
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
    setValue(props.value ?? "");
  }, [props.value]);

  useEffect(() => {
    requestAnimationFrame(setAutoSize);
  }, [setAutoSize, value]);

  return (
    <WrappedFormItem exportparts="message" {...props}>
      <textarea
        ref={textareaRef}
        className={classNames({
          error: validateState === "error",
        })}
        name={name}
        value={value}
        disabled={disabled}
        style={{
          display: "block",
          // Use the minimal height when auto-size enabled, prevent layout shift.
          // By default, the height is 21px each row + 10px (padding & border).
          height: autoSize
            ? (typeof autoSize === "object" ? (autoSize.minRows ?? 1) : 1) *
                21 +
              10
            : 94,
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
});

export { Textarea };
