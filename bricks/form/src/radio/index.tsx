import React, { CSSProperties } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import { ReactUseBrick } from "@next-core/react-runtime";
import { FormItemElementBase } from "@next-shared/form";
import type {
  RadioType,
  GeneralOption,
  GeneralComplexOption,
  UIType,
  RadioGroupButtonStyle,
  ComponentSize,
} from "../interface.js";
import styleText from "./index.shadow.css";
import classNames from "classnames";
import "@next-core/theme";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import { UseSingleBrickConf } from "@next-core/types";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { formatOptions } from "../utils/formatOptions.js";
import { isBoolean, isEqual } from "lodash";
import "./host-context.css";

const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

interface CustomOptions {
  url: string;
  description?: string;
  title: string;
  backgroundColor?: string;
  value: string;
  [propName: string]: any;
}

export interface RadioProps {
  type?: RadioType;
  options: GeneralOption[] | CustomOptions[] | undefined;
  value?: any;
  disabled?: boolean;
  buttonStyle?: RadioGroupButtonStyle;
  size?: ComponentSize;
  ui?: UIType;
  useBrick?: UseSingleBrickConf;
  customStyle?: React.CSSProperties;
}
export interface RadioEvents {
  change: CustomEvent<GeneralComplexOption>;
  optionsChange: CustomEvent<{
    options: GeneralComplexOption[];
    name: string;
  }>;
}
export interface RadioEventsMapping {
  onValueChange: "change";
  onOptionsChange: "optionsChange";
}

const { defineElement, property, event } = createDecorators();

/**
 * 通用单选构件
 * @author sailor
 * @category form-input-basic
 */
@defineElement("eo-radio", {
  styleTexts: [styleText],
  alias: ["form.general-radio"],
})
class Radio extends FormItemElementBase {
  /**
   * 下拉框字段名
   */
  @property() accessor name: string | undefined;

  /**
   * 单选框字段说明
   */
  @property() accessor label: string | undefined;

  /**
   * 单选框选项表
   * @required
   */
  @property({ attribute: false })
  accessor options: GeneralOption[] | undefined;

  /**
   * 单选框当前选中始值
   */
  @property({
    attribute: false,
  })
  accessor value: any | undefined;

  /**
   * 是否必填
   */
  @property({ type: Boolean }) accessor required: boolean | undefined;

  /**
   * 校验文本信息
   */
  @property({ attribute: false }) accessor message:
    | Record<string, string>
    | undefined;

  /**
   * 是否禁用
   */
  @property({ type: Boolean })
  accessor disabled: boolean | undefined;

  /**
   * 单选框样式类型
   * @default "default"
   */
  @property()
  accessor type: RadioType = "default";

  /**
   * UI样式
   * @default "default"
   */
  @property()
  accessor ui: UIType | undefined;

  /**
   * 大小，只对按钮样式生效
   * @default "medium"
   */
  @property()
  accessor size: ComponentSize | undefined;

  /**
   * 自定义radio的外层样式
   */
  @property({
    attribute: false,
  })
  accessor customStyle: React.CSSProperties | undefined;

  /**
   * 自定义radio的内容
   */
  @property({
    attribute: false,
  })
  accessor useBrick: UseSingleBrickConf | undefined;

  /**
   * 值变化事件
   */
  @event({ type: "change" }) accessor #changeEvent!: EventEmitter<{
    label: string;
    value: any;
    [key: string]: any;
  }>;

  /**
   * 选项列表变化事件
   */
  @event({ type: "options.change" }) accessor #optionsChange!: EventEmitter<{
    options: {
      label: string;
      value: any;
      [key: string]: any;
    };
    name: string;
  }>;

  handleChange = (value: any): void => {
    this.value = value;
    this.#changeEvent.emit(value);
  };

  #handleOptionsChange = (
    options: {
      label: string;
      value: any;
      [key: string]: any;
    },
    name: string
  ): void => {
    this.#optionsChange.emit({ options, name });
  };

  render() {
    return (
      <RadioComponent
        curElement={this}
        formElement={this.getFormElement()}
        name={this.name}
        label={this.label}
        useBrick={this.useBrick}
        ui={this.ui}
        disabled={this.disabled}
        size={this.size}
        options={formatOptions(this.options)}
        type={this.type}
        value={this.value}
        required={this.required}
        message={this.message}
        onChange={this.handleChange}
        notRender={this.notRender}
        helpBrick={this.helpBrick}
        trigger="handleChange"
        optionsChange={this.#handleOptionsChange}
        customStyle={this.customStyle}
      />
    );
  }
}

interface RadioComponentProps extends RadioProps, FormItemProps {
  onChange?: (value: any) => void;
  optionsChange?: (options: any, name: string) => void;
}

export function RadioComponent(props: RadioComponentProps) {
  const { name, disabled, type, customStyle, optionsChange, size } = props;
  const [value, setValue] = React.useState(props.value);
  const [options, setOptions] = React.useState(props.options);

  React.useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  React.useEffect(() => {
    if (!isEqual(options, props.options)) {
      setOptions(props.options);
      optionsChange?.(props.options, name as string);
    }
  }, [name, options, optionsChange, props.options]);

  const handleChange = (
    e: React.ChangeEvent | React.MouseEvent,
    option: GeneralComplexOption
  ): void => {
    e.stopPropagation();
    setValue((option as GeneralComplexOption)?.value as any);
    props.onChange?.(option.value);
  };

  return (
    <WrappedFormItem {...props}>
      <div
        className={classNames("radio-group", {
          dashboard: props.ui === "dashboard",
        })}
      >
        {options?.map((item: any) => {
          const icon = item.icon;
          const iconStyle: CSSProperties = icon?.iconStyle;
          const key = isBoolean(item.value)
            ? item.value.toString()
            : item.value;
          const isDisabled = item.disabled || disabled;
          return (
            <label
              htmlFor={key}
              style={customStyle}
              className={classNames("radio-item", {
                disabled: isDisabled,
                checked: value === item.value,
                [size || "medium"]: type === "button",
              })}
              key={key}
              onClick={(e) => !isDisabled && handleChange(e, item)}
            >
              <span className="raido">
                <input
                  type="radio"
                  name={name}
                  disabled={isDisabled}
                  checked={value === item.value}
                  onChange={(e) => !isDisabled && handleChange(e, item)}
                />
                <span
                  className={classNames("radio-inner", {
                    checked: value === item.value,
                  })}
                ></span>
              </span>
              {type === "icon" ? (
                <div className="content">
                  {icon && (
                    <WrappedGeneralIcon
                      {...icon}
                      style={{
                        fontSize: "32px",
                        ...iconStyle,
                      }}
                    />
                  )}
                  <div>{item.label}</div>
                </div>
              ) : type === "custom" ? (
                <div className="custom-content">
                  {props.useBrick && (
                    <ReactUseBrick
                      useBrick={props.useBrick}
                      data={item}
                    ></ReactUseBrick>
                  )}
                </div>
              ) : type === "icon-circle" || type === "icon-square" ? (
                <div
                  className={classNames({
                    "icon-content":
                      type === "icon-circle" || type === "icon-square",
                  })}
                >
                  {item.icon && (
                    <div
                      className={classNames({
                        "circle-icon": type === "icon-circle",
                        "square-icon": type === "icon-square",
                      })}
                    >
                      <WrappedGeneralIcon
                        {...icon}
                        style={{
                          fontSize: "46px",
                          ...iconStyle,
                        }}
                      />
                    </div>
                  )}
                  <span title={item.label}>{item.label}</span>
                </div>
              ) : type === "button" ? (
                <div
                  className={classNames("button-content", {
                    disabled: isDisabled,
                  })}
                >
                  <span>
                    {icon && (
                      <WrappedGeneralIcon
                        {...icon}
                        style={{
                          fontSize: "22px",
                          marginRight: "4px",
                          verticalAlign: "-0.25em",
                          ...iconStyle,
                        }}
                      />
                    )}
                    {item.label}
                  </span>
                </div>
              ) : (
                <span className="content">
                  {icon && (
                    <WrappedGeneralIcon
                      {...icon}
                      style={{
                        fontSize: "22px",
                        marginRight: "8px",
                        verticalAlign: "-0.25em",
                        ...iconStyle,
                      }}
                    />
                  )}
                  {item.label}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </WrappedFormItem>
  );
}
export { Radio };
