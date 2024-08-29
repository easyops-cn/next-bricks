import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  createRef,
  useImperativeHandle,
  type ChangeEvent,
  type MouseEvent,
  type CSSProperties,
} from "react";
import { wrapBrick } from "@next-core/react-element";
import { EventEmitter, createDecorators } from "@next-core/element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import "@next-core/theme";
import classNames from "classnames";
import { isNil } from "lodash";
import styleText from "./input.shadow.css";
import { FormItemElementBase, MessageBody } from "@next-shared/form";
import { FormItem, FormItemProps } from "../form-item/index.jsx";
import { ComponentSize, InputType } from "../interface.js";
import { useMergeRefs } from "@next-shared/hooks";

const { defineElement, property, event, method } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

export interface InputProps extends FormItemProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  autoFocus?: boolean;
  type?: InputType;
  size?: ComponentSize;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  validateState?: string;
  inputStyle?: CSSProperties;
}

export interface InputEvents {
  change: CustomEvent<string>;
}

export interface InputEventsMap {
  onChange: "change";
}

/**
 * 通用输入框构件
 * @author sailor
 *
 * @part addon-wrapper - 包裹输入组件、前缀、后缀、前置和后置的容器
 * @part affix-wrapper - 包裹输入组件、前缀和后缀的容器
 * @part input - 输入组件
 * @part clear-icon - 清除按钮
 * @part prefix - 输入框前缀容器
 * @part suffix - 输入框后缀容器
 * @part before-addon - 输入框前置容器
 * @part after-addon - 输入框后置容器
 *
 * @slot addonBefore - 输入框前置标签
 * @slot addonAfter - 输入框后置标签
 * @slot prefix - 输入框前缀图标
 * @slot suffix - 输入框后缀图标
 * @category form-input-basic
 */
export
@defineElement("eo-input", {
  styleTexts: [styleText],
  alias: ["form.general-input"],
})
class Input extends FormItemElementBase {
  #RCInputRef = createRef<RCInputRef>();

  /**
   * 字段名称
   */
  @property() accessor name: string | undefined;

  /**
   * 标签文字
   */
  @property() accessor label: string | undefined;

  /**
   * 是否必填
   */
  @property({ type: Boolean })
  accessor required: boolean | undefined;

  /**
   * 正则校验规则
   */
  @property() accessor pattern: string | undefined;

  /**
   * 表单校验最大长度（当 type 为 number 时，表示最大值）
   */
  @property({
    type: Number,
  })
  accessor max: number | undefined;

  /**
   * 表单校验最小长度（当 type 为 number 时，表示最小值）
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
  @property({ type: Boolean })
  accessor disabled: boolean | undefined;

  /**
   * 是否只读
   */
  @property({ type: Boolean })
  accessor readonly: boolean | undefined;

  /**
   * 是否显示清除按钮
   */
  @property({ type: Boolean })
  accessor clearable: boolean | undefined;

  /**
   * 是否自动聚焦
   */
  @property({
    type: Boolean,
  })
  accessor autoFocus: boolean | undefined;

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
  @property({ type: Number })
  accessor minLength: number | undefined;

  /**
   * 最大长度（用户无法输入超过此最大长度的字符串）
   */
  @property({ type: Number })
  accessor maxLength: number | undefined;

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
  accessor #changeEvent!: EventEmitter<string>;
  handleInputChange = (value: string) => {
    this.value = value;
    this.#changeEvent.emit(value);
  };

  /**
   * focus
   */
  @method({ bound: true })
  focusInput() {
    return this.#RCInputRef.current?.focus();
  }

  /**
   * blur
   */
  @method()
  blurInput() {
    return this.#RCInputRef.current?.blur();
  }

  /**
   * 是否有 addonBefore 插槽
   * @internal
   */
  @property({ type: Boolean })
  accessor hasAddonBefore: boolean | undefined;

  /**
   * 是否有 addonAfter 插槽
   * @internal
   */
  @property({ type: Boolean })
  accessor hasAddonAfter: boolean | undefined;

  /**
   * 是否有 prefix 插槽
   * @internal
   */
  @property({ type: Boolean })
  accessor hasPrefix: boolean | undefined;

  /**
   * 是否有 suffix 插槽
   * @internal
   */
  @property({ type: Boolean })
  accessor hasSuffix: boolean | undefined;

  /**
   * 表单项校验方法
   */
  @property({
    attribute: false,
  })
  accessor validator: ((value: any) => MessageBody) | undefined;

  renderCallback = (ref: RCInputRef) => {
    (this.#RCInputRef as any).current = ref;
    const addonBefore = this.#getSlotByName("addonBefore");
    const addonAfter = this.#getSlotByName("addonAfter");
    const prefix = this.#getSlotByName("prefix");
    const suffix = this.#getSlotByName("suffix");

    addonBefore?.addEventListener("slotchange", () => {
      this.hasAddonBefore = addonBefore.assignedElements().length > 0;
    });
    addonAfter?.addEventListener("slotchange", () => {
      this.hasAddonAfter = addonAfter.assignedElements().length > 0;
    });
    suffix?.addEventListener("slotchange", () => {
      this.hasSuffix = suffix.assignedElements().length > 0;
    });
    prefix?.addEventListener("slotchange", () => {
      this.hasPrefix = prefix.assignedElements().length > 0;
    });
  };

  #getSlotByName(name: string): HTMLSlotElement {
    return this.shadowRoot?.querySelector(
      `slot[name='${name}']`
    ) as HTMLSlotElement;
  }

  render() {
    return (
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      <RCInput
        formElement={this.getFormElement()}
        curElement={this}
        ref={this.renderCallback}
        name={this.name}
        label={this.label}
        required={this.required}
        pattern={this.pattern}
        min={this.min}
        max={this.max}
        message={this.message}
        notRender={this.notRender}
        helpBrick={this.helpBrick}
        labelBrick={this.labelBrick}
        validateState={this.validateState}
        value={this.value}
        placeholder={this.placeholder}
        disabled={this.disabled}
        readOnly={this.readonly}
        clearable={this.clearable}
        autoFocus={this.autoFocus}
        type={this.type}
        size={this.size}
        minLength={this.minLength}
        maxLength={this.maxLength}
        inputStyle={this.inputStyle}
        trigger="handleInputChange"
        onInputChange={this.handleInputChange}
        validator={this.validator}
      />
    );
  }
}

export interface RCInputProps extends InputProps {
  onInputChange?: (value: string) => void;
}

export interface RCInputRef {
  focus: (options?: FocusOptions) => void;
  blur: () => void;
}

// eslint-disable-next-line react/display-name
export const RCInput = forwardRef<RCInputRef, RCInputProps>((props, ref) => {
  const {
    placeholder,
    clearable,
    disabled,
    readOnly,
    autoFocus,
    size = "medium",
    type = "text",
    min,
    max,
    maxLength,
    minLength,
    validateState,
    onInputChange,
    inputStyle,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const inputAffixWrapperRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(props.value ?? "");
  const [focused, setFocused] = useState<boolean>();

  const searchInputRef = React.useCallback((element: HTMLInputElement) => {
    if (element && autoFocus) {
      Promise.resolve().then(() => {
        try {
          element.focus();
        } catch {
          // Do nothing.
        }
      });
    }
  }, []);

  const mergeInputRef = useMergeRefs([inputRef, searchInputRef]);

  useEffect(() => {
    setValue(props.value ?? "");
  }, [props.value]);

  useImperativeHandle(ref, () => ({
    focus: (options?: FocusOptions) => {
      const input = inputRef.current;

      if (input) {
        const valueLength = input.value?.length;

        input.focus(options);
        valueLength && input.setSelectionRange(valueLength, valueLength);
      }
    },
    blur: () => {
      inputRef.current?.blur();
    },
  }));

  const handleInputAffixWrapperClick = (e: MouseEvent<HTMLElement>) => {
    if (inputAffixWrapperRef.current?.contains(e.target as Element)) {
      inputRef.current?.focus();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onInputChange?.(e.target.value);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleClear = () => {
    setValue("");
    onInputChange?.("");
  };

  const getClearIcon = () => {
    if (!clearable) return null;

    const hidden = disabled || readOnly || !fixValue(value);
    return (
      <WrappedIcon
        className={classNames("input-clear-icon", {
          "input-clear-icon-hidden": hidden,
        })}
        part="clear-icon"
        lib="antd"
        icon="close-circle"
        theme="filled"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleClear}
      />
    );
  };

  return (
    <WrappedFormItem exportparts="message" {...props}>
      <div
        part="addon-wrapper"
        className={classNames(
          "input-addon-wrapper",
          size && `input-addon-wrapper-size-${size}`,
          validateState && `input-addon-wrapper-status-${validateState}`
        )}
        style={inputStyle}
      >
        <span part="before-addon" className="input-before-addon">
          <slot name="addonBefore" />
        </span>
        <span
          ref={inputAffixWrapperRef}
          part="affix-wrapper"
          className={classNames("input-affix-wrapper", {
            "input-affix-wrapper-focused": focused,
            "input-affix-wrapper-disabled": disabled,
            "input-affix-wrapper-readOnly": readOnly,
          })}
          onClick={handleInputAffixWrapperClick}
        >
          <span part="prefix" className="input-prefix">
            <slot name="prefix" />
          </span>
          <input
            part="input"
            placeholder={placeholder}
            min={min}
            max={max}
            maxLength={maxLength}
            minLength={minLength}
            ref={mergeInputRef}
            className="input"
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            value={fixValue(value)}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span part="suffix" className="input-suffix">
            {getClearIcon()}
            <slot name="suffix" />
          </span>
        </span>
        <span part="after-addon" className="input-after-addon">
          <slot name="addonAfter" />
        </span>
      </div>
    </WrappedFormItem>
  );
});

function fixValue<T>(value: T) {
  return isNil(value) ? "" : String(value);
}
