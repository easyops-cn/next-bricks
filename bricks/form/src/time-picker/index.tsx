import React, { useEffect, useMemo, useState } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { TimePicker, ConfigProvider, theme } from "antd";
import { useCurrentTheme } from "@next-core/react-runtime";
import { FormItemElementBase } from "@next-shared/form";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import { TimePickerProps } from "antd/lib/time-picker";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { i18n } from "@next-core/i18n";
import { isNil, omit } from "lodash";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import enUS from "antd/locale/en_US.js";
import zhCN from "antd/locale/zh_CN.js";

dayjs.extend(customParseFormat);

const { defineElement, property, event } = createDecorators();
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

interface EoTimePickerProps extends FormItemProps {
  shadowRoot: ShadowRoot | null;
  configProps?: Partial<TimePickerProps>;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onOpenChange?: (flag: boolean, value: string) => void;
}

/**
 * 时间选择器
 * @author zhendonghuang
 * @category form-input-basic
 */
export
@defineElement("eo-time-picker", {
  styleTexts: [styleText],
})
class EoTimePicker extends FormItemElementBase {
  /**
   * 时间选择器字段名
   */
  @property() accessor name: string | undefined;

  /**
   * 时间选择器说明
   */
  @property() accessor label: string | undefined;

  /**
   *时间选择器的初始值
   */
  @property() accessor value: string | undefined;

  /**
   * 时间选择器占位说明
   */
  @property()
  accessor placeholder: string | undefined;

  /**
   * 校验文本信息
   */
  @property({ attribute: false })
  accessor message: Record<string, string> | undefined;

  /**
   * 是否禁用
   */
  @property({ type: Boolean }) accessor disabled: boolean | undefined;

  /**
   * 是否必填
   */
  @property({ type: Boolean }) accessor required: boolean | undefined;

  /**
   * 透传 antd timePicker 属性 [timePickerProps](https://ant.design/components/time-picker-cn)
   */
  @property({ attribute: false })
  accessor configProps: Partial<TimePickerProps> | undefined;

  /**
   *时间变化时触发
   */
  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<string>;

  /**
   *面板打开时触发， 传出当前时间值
   */
  @event({ type: "open" })
  accessor #openEvent!: EventEmitter<string>;

  /**
   *面板关闭时触发，传出当前时间值
   */
  @event({ type: "close" })
  accessor #closeEvent!: EventEmitter<string>;

  #handleChange = (value: string): void => {
    this.value = value;
    this.#changeEvent.emit(value);
  };
  #handleOpenChange = (flag: boolean, value: string): void => {
    if (flag) {
      this.#openEvent.emit(value);
    } else {
      this.#closeEvent.emit(value);
    }
  };

  render() {
    return (
      <EoTimePickerComponent
        curElement={this}
        formElement={this.getFormElement()}
        configProps={this.configProps}
        name={this.name}
        label={this.label}
        onChange={this.#handleChange}
        onOpenChange={this.#handleOpenChange}
        placeholder={this.placeholder}
        value={this.value}
        required={this.required}
        message={this.message}
        shadowRoot={this.shadowRoot}
        disabled={this.disabled}
      />
    );
  }
}

export function EoTimePickerComponent(props: EoTimePickerProps) {
  const {
    configProps = {},
    onChange,
    onOpenChange,
    disabled,
    placeholder,
  } = props;
  const currentTheme = useCurrentTheme();
  const locale =
    i18n.language && i18n.language.split("-")[0] === "en" ? enUS : zhCN;
  const [value, setValue] = useState<Dayjs | null>(null);
  const format: string = (configProps.format as string) ?? "HH:mm:ss";
  useEffect(() => {
    if (!isNil(props.value)) {
      setValue(dayjs(props.value, format) as Dayjs);
    } else {
      setValue(null);
    }
  }, [props.value, format]);

  const handleChange = (time: Dayjs | null, timeString: string): void => {
    onChange?.(timeString);
  };

  const handleOpenChange = (flag: boolean): void => {
    onOpenChange?.(
      flag,
      !isNil(value) ? (dayjs(value as Dayjs).format(format) as string) : ""
    );
  };
  const cahce = useMemo(() => {
    return createCache();
  }, []);

  return (
    <WrappedFormItem {...(omit(props, ["shadowRoot"]) as any)}>
      <ConfigProvider
        locale={locale as any}
        theme={{
          algorithm:
            currentTheme === "dark-v2"
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
        }}
      >
        <StyleProvider container={props.shadowRoot as ShadowRoot} cache={cahce}>
          <div
            onChange={(e) => {
              e.stopPropagation();
            }}
          >
            <TimePicker
              {...configProps}
              getPopupContainer={(trigger) => trigger}
              value={value}
              onChange={handleChange}
              onOpenChange={handleOpenChange}
              disabled={disabled}
              placeholder={placeholder}
              allowClear={configProps.allowClear}
            />
          </div>
        </StyleProvider>
      </ConfigProvider>
    </WrappedFormItem>
  );
}
