import React, { CSSProperties, useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { Cascader, ConfigProvider, theme } from "antd";
import {
  CascaderProps as AntdCascaderProps,
  DefaultOptionType,
} from "antd/lib/cascader";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import type { FormItem, FormItemProps } from "@next-bricks/form/form-item";
import { FormItemElementBase } from "@next-shared/form";
import { useCurrentTheme } from "@next-core/react-runtime";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

export interface CascaderProps
  extends Pick<
    AntdCascaderProps,
    "options" | "fieldNames" | "value" | "expandTrigger" | "size"
  > {
  shadowRoot: ShadowRoot | null;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  limit?: number;
  suffixIcon?: GeneralIconProps;
  popupPlacement?: AntdCascaderProps["placement"];
  cascaderStyle?: CSSProperties;
  maxTagCount?: number | "responsive";
  onChange?: (
    value: AntdCascaderProps["value"],
    selectedOptions: DefaultOptionType[] | DefaultOptionType[][]
  ) => void;
}

/**
 * 级联选择器
 * @author nlicroshan
 * @category form-input-basic
 */
@defineElement("eo-cascader", {
  alias: ["advanced.general-cascader"],
  styleTexts: [styleText],
})
class CascaderBrick extends FormItemElementBase implements CascaderProps {
  @property()
  accessor name: string | undefined;

  @property()
  accessor label: string | undefined;

  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  @property({
    attribute: false,
  })
  accessor options: AntdCascaderProps["options"];

  @property({
    attribute: false,
  })
  accessor fieldNames: AntdCascaderProps["fieldNames"] = {
    label: "label",
    value: "value",
    children: "children",
  };

  @property({
    attribute: false,
  })
  accessor value: AntdCascaderProps["value"];

  @property()
  accessor placeholder: string | undefined;

  @property({
    type: Boolean,
  })
  accessor multiple: boolean | undefined;

  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  @property({
    type: Boolean,
  })
  accessor allowClear: boolean | undefined = true;

  @property({
    type: Boolean,
  })
  accessor showSearch: boolean | undefined = true;

  @property({
    attribute: false,
  })
  accessor suffixIcon: GeneralIconProps | undefined;

  @property()
  accessor expandTrigger: AntdCascaderProps["expandTrigger"] = "click";

  @property()
  accessor popupPlacement: AntdCascaderProps["placement"] = "bottomLeft";

  @property()
  accessor size: AntdCascaderProps["size"];

  @property({
    type: Number,
  })
  accessor limit: number | undefined = 50;

  @property({
    attribute: false,
  })
  accessor maxTagCount: number | "responsive" | undefined;

  @property({
    attribute: false,
  })
  accessor cascaderStyle: CSSProperties | undefined;

  /**
   * @detail { value: AntdCascaderProps["value"], selectedOptions: DefaultOptionType[] | DefaultOptionType[][] }
   * @description 级联选择项输入变化时触发，value 为选择的值，selectedOptions 为选择的值所对应的 options
   */
  @event({ type: "cascader.change" })
  accessor #changeEvent!: EventEmitter<{
    value: AntdCascaderProps["value"];
    selectedOptions: DefaultOptionType[] | DefaultOptionType[][];
  }>;

  handleOnChange = (
    value: AntdCascaderProps["value"],
    selectedOptions: DefaultOptionType[] | DefaultOptionType[][]
  ): void => {
    this.value = value;
    Promise.resolve().then(() => {
      this.#changeEvent.emit({ value, selectedOptions });
    });
  };

  render() {
    return (
      <WrappedFormItem
        curElement={this as HTMLElement}
        formElement={this.getFormElement()}
        name={this.name}
        label={this.label}
        required={this.required}
        notRender={this.notRender}
        trigger="handleOnChange"
      >
        <CascaderElement
          shadowRoot={this.shadowRoot}
          options={this.options}
          fieldNames={this.fieldNames}
          value={this.value}
          multiple={this.multiple}
          placeholder={this.placeholder}
          disabled={this.disabled}
          allowClear={this.allowClear}
          showSearch={this.showSearch}
          expandTrigger={this.expandTrigger}
          suffixIcon={this.suffixIcon}
          size={this.size}
          limit={this.limit}
          popupPlacement={this.popupPlacement}
          maxTagCount={this.maxTagCount}
          cascaderStyle={this.cascaderStyle}
          onChange={this.handleOnChange}
        />
      </WrappedFormItem>
    );
  }
}

function CascaderElement(props: CascaderProps): React.ReactElement {
  const {
    shadowRoot,
    options,
    fieldNames,
    value,
    placeholder,
    disabled,
    multiple,
    allowClear,
    showSearch,
    expandTrigger,
    size,
    limit,
    popupPlacement,
    cascaderStyle,
    suffixIcon,
    maxTagCount,
    onChange,
  } = props;

  const currentTheme = useCurrentTheme();

  const cache = useMemo(() => {
    return createCache();
  }, []);

  const filter = (inputValue: string, path: DefaultOptionType[]): boolean => {
    const label = fieldNames?.label || "label";
    const filterValues = inputValue
      .split(" ")
      .filter((item) => item)
      .map((item) => item.toLocaleLowerCase());
    for (let j = 0; j < filterValues.length; j++) {
      if (
        !path.some((option) =>
          (option[label] as string).toLowerCase().includes(filterValues[j])
        )
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentTheme === "dark-v2"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <StyleProvider container={shadowRoot as ShadowRoot} cache={cache}>
        <Cascader
          getPopupContainer={(trigger) => trigger.parentElement}
          allowClear={allowClear}
          disabled={disabled}
          multiple={multiple as true | undefined}
          expandTrigger={expandTrigger}
          fieldNames={fieldNames}
          placeholder={placeholder}
          size={size}
          showSearch={showSearch && { limit, filter }}
          placement={popupPlacement}
          style={cascaderStyle}
          suffixIcon={suffixIcon && <WrappedIcon {...suffixIcon} />}
          maxTagCount={maxTagCount}
          value={value as any}
          options={options}
          onChange={
            ((
              value: AntdCascaderProps["value"],
              selectedOptions: DefaultOptionType[] | DefaultOptionType[][]
            ) => onChange?.(value, selectedOptions)) as any
          }
        />
      </StyleProvider>
    </ConfigProvider>
  );
}

export { CascaderBrick };
