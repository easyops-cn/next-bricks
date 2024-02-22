import React, { useMemo, useState } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import { ColorPicker, theme, ConfigProvider } from "antd";
import { ColorPickerProps, Color } from "antd/lib/color-picker";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { FormItemElementBase } from "@next-shared/form";
import type { FormItem, FormItemProps } from "../form-item/index.js";
import { useCurrentTheme } from "@next-core/react-runtime";
import styleText from "./styles.shadow.css";
const { defineElement, property, event } = createDecorators();
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

export interface EoColorPickerProps
  extends Pick<
    ColorPickerProps,
    "allowClear" | "disabled" | "showText" | "format" | "size" | "defaultValue"
  > {
  shadowRoot: ShadowRoot | null;
  configProps?: Partial<ColorPickerProps>;
  onChange?: (value?: string) => void;
  value?: string;
}

/**
 * 构件 `eo-color-picker`
 * @author astrid
 */
export
@defineElement("eo-color-picker", {
  styleTexts: [styleText],
})
class EoColorPicker extends FormItemElementBase implements EoColorPickerProps {
  /**
   * 字段名称
   */
  @property()
  accessor name: string | undefined;

  /**
   * 字段说明
   */
  @property()
  accessor label: string | undefined;
  /**
   * 值
   */
  @property()
  accessor value: string | undefined;

  /**
   * 颜色默认的值
   */
  @property()
  accessor defaultValue: string | Color | undefined;
  /**
   * 是否必填
   */
  @property({ type: Boolean })
  accessor required: boolean | undefined;
  /**
   * 允许清除选择的颜色
   */
  @property({ type: Boolean })
  accessor allowClear: boolean | undefined;
  /**
   * 设置触发器大小
   * @default middle
   */
  @property({ attribute: false })
  accessor size: "small" | "middle" | "large" | undefined;

  /**
   * 显示颜色文本
   */
  @property({ type: Boolean })
  accessor showText: boolean | undefined;
  /**
   * 是否禁用
   */
  @property({ type: Boolean })
  accessor disabled: boolean | undefined;

  /**
   * 颜色格式
   * @default hex
   */
  @property({ attribute: false })
  accessor format: "rgb" | "hex" | "hsb" | undefined;
  /**
   * 透传 antd ColorPicker 属性 [ColorPickerProps](https://ant.design/components/color-picker-cn#api)
   */
  @property({ attribute: false })
  accessor configProps: Partial<ColorPickerProps> | undefined;

  /**
   * 颜色变化事件, 返回值格式和`format`格式一致
   */
  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<string | undefined>;
  handleChange = (value?: string) => {
    this.value = value;
    this.#changeEvent.emit(value);
  };

  render() {
    return (
      <WrappedFormItem
        curElement={this as HTMLElement}
        formElement={this.getFormElement()}
        label={this.label}
        name={this.name}
        required={this.required}
        trigger="handleChange"
      >
        <EoColorPickerComponent
          format={this.format}
          value={this.value}
          size={this.size}
          disabled={this.disabled}
          onChange={this.handleChange}
          shadowRoot={this.shadowRoot}
          configProps={this.configProps}
          showText={this.showText}
          allowClear={this.allowClear}
          defaultValue={this.defaultValue}
        />
      </WrappedFormItem>
    );
  }
}

export function EoColorPickerComponent(
  props: EoColorPickerProps
): React.ReactElement {
  const currentTheme = useCurrentTheme();
  const [format, setFormat] = useState<ColorPickerProps["format"]>(
    props.format
  );
  const cache = useMemo(() => {
    return createCache();
  }, []);
  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentTheme === "dark-v2"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <StyleProvider container={props.shadowRoot as ShadowRoot} cache={cache}>
        <ColorPicker
          {...props.configProps}
          getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
          value={props.value}
          disabled={props.disabled}
          allowClear={props.allowClear}
          defaultValue={props.defaultValue}
          size={props.size}
          showText={props.showText}
          format={format}
          onFormatChange={setFormat}
          onChange={(value) => {
            let outputValue = value.toHexString();
            switch (props.format) {
              case "rgb":
                outputValue = value.toRgbString();
                break;
              case "hsb":
                outputValue = value.toHsbString();
                break;
              default:
                outputValue = value.toHexString();
                break;
            }
            props.onChange?.(outputValue);
          }}
          onClear={() => {
            props.onChange?.();
          }}
        />
      </StyleProvider>
    </ConfigProvider>
  );
}
