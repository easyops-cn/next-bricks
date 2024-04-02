import React, { useEffect, useState, useMemo } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import classNames from "classnames";
import "@next-core/theme";
import styleText from "./checkbox.shadow.css";
import type { FormItem, FormItemProps } from "../form-item/index.js";
import { formatOptions } from "../utils/formatOptions.js";
import { intersection, isEqual, uniq } from "lodash";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { FormItemElementBase } from "@next-shared/form";
import { CaretRightOutlined } from "@ant-design/icons";

const { defineElement, property, event } = createDecorators();

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export type CheckboxType = "default" | "icon";

export declare type CheckboxValueType = string | number | boolean;

export interface CheckboxOptionType {
  label: React.ReactNode;
  value: any;
  style?: React.CSSProperties;
  disabled?: boolean;
  checkboxColor?: string;
  [propName: string]: any;
}

export interface MenuIcon {
  [propName: string]: any;
}

export interface OptionGroup {
  name: string;
  key: string;
  options: CheckboxOptionType[];
}

export interface CheckboxProps extends FormItemProps {
  options?: CheckboxOptionType[];
  label?: string;
  value?: CheckboxValueType[];
  disabled?: boolean;
  type?: CheckboxType;
  isCustom?: boolean;
  isGroup?: boolean;
  optionGroups?: OptionGroup[];
  onChange?: (value: CheckboxValueType[]) => void;
  optionsChange?: (options: CheckboxOptionType[], name: string) => void;
}

/**
 * 表单复选框构件
 * @author derrickma
 * @category form-input-basic
 */
@defineElement("eo-checkbox", {
  styleTexts: [styleText],
  alias: ["form.general-checkbox"],
})
class Checkbox extends FormItemElementBase {
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
  @property({ attribute: false })
  accessor value: CheckboxValueType[] | undefined;

  /**
   * 多选框选项表
   * @required
   */
  @property({ attribute: false })
  accessor options: CheckboxOptionType[] = [];

  /**
   * 类型
   * @default "default"
   */
  @property()
  accessor type: CheckboxType = "default";

  /**
   * 是否禁用
   */
  @property({ type: Boolean })
  accessor disabled: boolean | undefined;

  /**
   * 是否为自定义
   * @default false
   */
  @property({ type: Boolean })
  accessor isCustom: boolean = false;

  /**
   * 是否必填
   */
  @property({ type: Boolean })
  accessor required: boolean | undefined;

  /**
   * 校验文本
   */
  @property({ attribute: false })
  accessor message: Record<string, string> | undefined;

  /**
   * 是否为复选框，为true时，则可设置分组数据 optionGroups
   */
  @property({
    type: Boolean,
  })
  accessor isGroup: boolean | undefined;

  /**
   * 多选框选项分组数据，需要设置 isGroup 为 true 才生效
   */
  @property({
    attribute: false,
  })
  accessor optionGroups: OptionGroup[] | undefined;

  /**
   * 复选框变化事件
   */
  @event({ type: "change" })
  accessor #checkboxChangeEvent!: EventEmitter<CheckboxOptionType[]>;

  handleCheckboxChange = (detail: CheckboxValueType[]) => {
    this.value = detail;
    const currentOptions = this.optionGroups
      ? this.optionGroups.reduce(
          (before: CheckboxOptionType[], after) => [
            ...before,
            ...after.options,
          ],
          []
        )
      : this.options;
    const currentSelectOption = formatOptions(currentOptions).filter((item) =>
      typeof item.value === "object" ? true : detail.includes(item.value)
    );
    this.#checkboxChangeEvent.emit(currentSelectOption);
  };

  /**
   * 复选框变化事件
   */
  @event({ type: "options.change" })
  accessor #optionsChangeEvent!: EventEmitter<{
    options: CheckboxOptionType[];
    name: string;
  }>;

  #handleOptionsChange = (options: CheckboxOptionType[], name: string) => {
    this.#optionsChangeEvent.emit({
      options,
      name,
    });
  };

  render() {
    return (
      <CheckboxComponent
        curElement={this}
        formElement={this.getFormElement()}
        options={formatOptions(this.options)}
        label={this.label}
        name={this.name}
        value={this.value}
        type={this.type}
        disabled={this.disabled}
        isCustom={this.isCustom}
        required={this.required}
        message={this.message}
        notRender={this.notRender}
        helpBrick={this.helpBrick}
        labelBrick={this.labelBrick}
        trigger="handleCheckboxChange"
        onChange={this.handleCheckboxChange}
        optionsChange={this.#handleOptionsChange}
        isGroup={this.isGroup}
        optionGroups={this.optionGroups}
      />
    );
  }
}

function CheckboxComponent(props: CheckboxProps) {
  const { isGroup } = props;
  const [values, setValues] = useState<CheckboxValueType[]>(props?.value ?? []);
  const [options, setOptions] = useState<CheckboxOptionType[]>(
    props.options || []
  );
  const [collapseKeys, setCollapseKeys] = useState<string[]>(
    (props.optionGroups || []).map((o) => o.key)
  );
  const [optionGroups, setOptionGroups] = useState(props.optionGroups);
  useEffect(() => {
    if (!isEqual(optionGroups, props.optionGroups)) {
      setCollapseKeys((optionGroups || []).map((o) => o.key));
      setOptionGroups(props.optionGroups);
    }
  }, [props.optionGroups]);

  useEffect(() => {
    if (!isEqual(options, props.options)) {
      setOptions(props.options || []);
      props.optionsChange?.(props.options ?? [], props.name as string);
    }
  }, [options, props, props.options]);

  useEffect(() => {
    setValues(props?.value || []);
  }, [props.value]);

  const handleInputClick = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: CheckboxOptionType
  ) => {
    e.stopPropagation();
    let newValue: CheckboxValueType[] = [];
    if (e.target.checked) {
      newValue = [...values, item.value];
    }
    if (!e.target.checked && values?.includes(item.value)) {
      newValue = [...values];
      const index = newValue.findIndex((i) => i == item.value);
      newValue.splice(index, 1);
    }
    setValues(newValue);
    props.onChange?.(newValue);
  };

  const getIcon = (item: CheckboxOptionType) => {
    let iconNode = null;
    const { icon } = item;
    if (icon) {
      if ("imgSrc" in icon) {
        const mergedIcon: any = {
          ...icon,
          imgSrc: icon.imgSrc,
          imgStyle: {
            marginRight: "8px",
            verticalAlign: "-0.42em",
            ...icon.imgStyle,
          },
        };
        iconNode = icon && (
          <WrappedIcon {...(mergedIcon as GeneralIconProps)} />
        );
      } else {
        iconNode = icon && (
          <WrappedIcon
            {...(icon as GeneralIconProps)}
            style={{
              fontSize: "22px",
              marginRight: "8px",
              verticalAlign: "-0.25em",
            }}
          />
        );
      }
    }
    return iconNode;
  };

  const IconCheckbox = (props: CheckboxProps) => {
    const { name, disabled = false, isCustom = false } = props;
    return (
      <>
        {options.map((item: any) => (
          <label
            key={item.value}
            className={
              disabled || item?.disabled
                ? classNames({
                    disabledIconCheckbox: true,
                    disabledIconCustomCheckbox: isCustom,
                  })
                : classNames({
                    iconCheckbox: true,
                    iconCustomCheckbox: isCustom,
                  })
            }
          >
            <div className={classNames({ inputBox: true })}>
              <input
                type="checkbox"
                value={item.value}
                name={name}
                defaultChecked={values?.includes(item.value)}
                disabled={disabled || item?.disabled}
                onChange={(e) => handleInputClick(e, item)}
              />
            </div>
            <div className={classNames({ content: true })}>
              {item.icon && (
                <WrappedIcon
                  {...(item.icon as GeneralIconProps)}
                  style={{
                    fontSize: isCustom ? "52px" : "32px",
                  }}
                ></WrappedIcon>
              )}
              <div className={classNames({ text: true })}>
                {item.label || item.value}
              </div>
            </div>
          </label>
        ))}
      </>
    );
  };

  const CheckboxItem = (props: CheckboxProps) => {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          minHeight: "30px",
        }}
      >
        <div className="checkboxWrapper" part="checkbox-wrapper">
          {props.options?.map((item: CheckboxOptionType) => {
            const disabled = item.disabled || props.disabled;
            return (
              <label
                key={item.value}
                className={classNames({
                  checkboxLabel: true,
                  checkboxLabelDisabled: disabled,
                  checkboxLabelCheck: values.includes(item.value),
                })}
                part="checkbox-option"
              >
                <span
                  style={{ color: item.checkboxColor }}
                  className={classNames({
                    checkboxInputWrapper: true,
                    checkboxInputWrapperDisabled: disabled,
                    checkboxInputCheck: values.includes(item.value),
                  })}
                >
                  <input
                    onChange={(e) => !disabled && handleInputClick(e, item)}
                    disabled={disabled}
                    defaultChecked={values?.includes(item.value)}
                    className={classNames({
                      checkboxInput: true,
                      checkboxInputDisabled: disabled,
                    })}
                    type="checkbox"
                    id={item.value}
                  ></input>
                  <span
                    className={classNames({ checkboxInner: true })}
                    style={
                      values.includes(item.value) && item.checkboxColor
                        ? {
                            background: item.checkboxColor,
                            borderColor: item.checkboxColor,
                          }
                        : {}
                    }
                  ></span>
                </span>

                <span className={classNames({ checkboxText: true })}>
                  <slot>
                    {getIcon(item)}
                    {item.label}
                  </slot>
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };
  const CheckGroupItem = (props: CheckboxProps) => {
    const _optionGroups = useMemo(() => {
      return optionGroups?.map((option) => {
        const newOptions = formatOptions(option.options);
        const newOptionsKeys = newOptions.map((n) => n.value);
        const checkOptions = intersection(values, newOptionsKeys);
        const checkType =
          checkOptions.length === newOptionsKeys.length
            ? "all"
            : checkOptions.length > 0 &&
                checkOptions.length !== newOptionsKeys.length
              ? "part"
              : "none";
        return {
          ...option,
          options: newOptions,
          checkType,
          keys: newOptionsKeys,
        };
      });
    }, [optionGroups, props.value]);
    return (
      <div className="collapse-wrapper">
        {" "}
        {_optionGroups?.map((i) => (
          <div key={i.key}>
            <div
              onClick={() => {
                if (collapseKeys.includes(i.key)) {
                  const newKeys = collapseKeys.filter((key) => key !== i.key);
                  setCollapseKeys(newKeys);
                } else {
                  setCollapseKeys([...collapseKeys, i.key]);
                }
              }}
              className={classNames("collapse-header")}
            >
              <span className="collapse-icon">
                <CaretRightOutlined
                  rotate={collapseKeys.includes(i.key) ? 90 : 0}
                  rev=""
                />
              </span>
              <label
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={classNames({
                  checkboxLabel: true,
                  checkboxLabelCheck: i.checkType === "all",
                })}
              >
                <span
                  className={classNames({
                    checkboxInputWrapper: true,
                    checkboxInputCheck: i.checkType === "all",
                    checkboxInputPartCheck: i.checkType === "part",
                  })}
                >
                  <input
                    className={classNames({
                      checkboxInput: true,
                    })}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (i.checkType === "all") {
                        const newValue = values.filter(
                          (v) => !i.keys.includes(v)
                        );
                        props.onChange?.(newValue);
                      } else {
                        props.onChange?.(uniq([...values, ...i.keys]));
                      }
                    }}
                    type="checkbox"
                  ></input>
                  <span className={classNames({ checkboxInner: true })}></span>
                </span>

                <span className={classNames({ checkboxText: true })}>
                  {i.name}
                </span>
              </label>
            </div>
            <div
              className={classNames("collapse-content", {
                "collapse-content-visible": collapseKeys.includes(i.key),
              })}
            >
              <CheckboxItem
                {...{ ...props, options: i.options }}
              ></CheckboxItem>
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <WrappedFormItem {...(props as FormItemProps)}>
      {props.type == "icon" ? (
        <IconCheckbox {...props}></IconCheckbox>
      ) : isGroup && props.optionGroups ? (
        <CheckGroupItem {...props}></CheckGroupItem>
      ) : (
        <CheckboxItem {...{ ...props, options: options }}></CheckboxItem>
      )}
    </WrappedFormItem>
  );
}

export { Checkbox };
