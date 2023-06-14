import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import type { GeneralComplexOption } from "../interface.js";
import styleText from "./index.shadow.css";
import classNames from "classnames";
import "@next-core/theme";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import { formatOptions } from "../utils/formatOptions.js";
import { FormItemElement } from "../form-item/FormItemElement.js";
import type {
  Tag,
  TagProps,
  TagMapEvents,
  TagEvents,
} from "@next-bricks/basic/tag";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { isEmpty, isEqual } from "lodash";

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "form.general-form-item"
);

const WrappedTag = wrapBrick<Tag, TagProps, TagEvents, TagMapEvents>(
  "basic.general-tag",
  {
    onCheck: "check",
    onClose: "close",
  }
);

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

export interface SelectProps extends FormItemProps {
  value?: any;
  options: GeneralComplexOption[];
  placeholder?: string;
  multiple?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  inputStyle?: React.CSSProperties;
  validateState?: string;
  onChange?: (value: any) => void;
  optionsChange?: (options: any, name: string) => void;
}

const { defineElement, property, event } = createDecorators();

/**
 * 通用下拉选择构件
 * @author julielai
 */
@defineElement("form.general-select", {
  styleTexts: [styleText],
})
class Select extends FormItemElement {
  /**
   * 字段名称
   */
  @property() accessor name: string | undefined;

  /**
   * 占位说明
   */
  @property() accessor placeholder: string | undefined;

  /**
   * 字段文本
   */
  @property() accessor label: string | undefined;

  /**
   * 选项列表
   * @required
   */
  @property({ attribute: false })
  accessor options: GeneralComplexOption[] | undefined;

  /**
   * 值
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
   * 是否支持多选
   */
  @property({ type: Boolean })
  accessor multiple: boolean | undefined;

  /**
   * 是否支持清除
   * @default true
   */
  @property({ type: Boolean })
  accessor clearable: boolean | undefined;

  /**
   * 输入框样式
   */
  @property({
    attribute: false,
  })
  accessor inputStyle: React.CSSProperties | undefined;

  /**
   * 下拉选择事件
   */
  @event({ type: "change" }) accessor #changeEvent!: EventEmitter<{
    value: string | string[];
    options: GeneralComplexOption[];
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

  handleChange = (value: string | string[]): void => {
    this.value = value;
    const findOption = (value: any) =>
      (formatOptions(this.options) ?? []).find(
        (option) => option.value === value
      ) as GeneralComplexOption;
    const selectedOptions = Array.isArray(value)
      ? value.map((item) => findOption(item))
      : [findOption(value)];

    this.#changeEvent.emit({
      value,
      options: selectedOptions,
    });
  };

  private _handleOptionsChange = (
    options: {
      label: string;
      value: any;
      [key: string]: any;
    },
    name: string
  ): void => {
    Promise.resolve().then(() => {
      this.#optionsChange.emit({ options, name });
    });
  };

  render() {
    return (
      <SelectComponent
        curElement={this}
        formElement={this.getFormElement()}
        name={this.name}
        label={this.label}
        value={this.value}
        disabled={this.disabled}
        placeholder={this.placeholder}
        required={this.required}
        multiple={this.multiple}
        clearable={this.clearable}
        trigger="handleChange"
        inputStyle={this.inputStyle}
        validateState={this.validateState}
        options={formatOptions(this.options)}
        onChange={this.handleChange}
        optionsChange={this._handleOptionsChange}
      />
    );
  }
}

export function SelectComponent(props: SelectProps) {
  const {
    name,
    disabled,
    multiple,
    clearable = true,
    inputStyle,
    placeholder,
    validateState,
    optionsChange,
    onChange,
  } = props;
  const [inputValue, setInputValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<any>(
    multiple ? [] : undefined
  );
  const [options, setOptions] = useState(props.options ?? []);
  const [isDropHidden, setIsDropHidden] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [customSelectvalue, setCustomSelectValue] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      setIsFocused(false);
      setIsDropHidden(true);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  });

  useEffect(() => {
    setSelectValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (!isEqual(options, props.options)) {
      setOptions(props.options);
      optionsChange?.(props.options, name as string);
    }
  }, [name, options, optionsChange, props.options]);

  const handleChange = useCallback(
    (option: GeneralComplexOption): void => {
      let newValue;
      if (multiple) {
        newValue = (selectValue ?? []).includes(option.value)
          ? (selectValue as string[]).filter((item) => item !== option.value)
          : (((selectValue as any[]) ?? []).concat(option.value) as string[]);
      } else {
        newValue = option.value;
      }
      setSelectValue(newValue);
      onChange?.(newValue);
      !multiple && setIsDropHidden(true);
    },
    [multiple, selectValue, onChange]
  );

  const handleMultipleItemClose = useCallback(
    (closeValue: string | number | boolean) => {
      const newValue = (selectValue as string[]).filter(
        (item) => item !== closeValue
      );
      setSelectValue(newValue);
      onChange?.(newValue);
    },
    [onChange, selectValue]
  );

  const handleClear = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectValue(undefined);
    onChange?.(undefined);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = e.target.value;
    setInputValue(value);
  };

  const computedOptions = React.useMemo(() => {
    return options.concat(
      customSelectvalue.map((item, index) => ({
        key: index,
        label: item,
        value: item,
      }))
    );
  }, [options, customSelectvalue]);

  const handleKeydown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.code === "Enter" && inputValue) {
        if (!computedOptions.find((item) => item.value === inputValue)) {
          setCustomSelectValue(customSelectvalue.concat(inputValue));
        }
        handleChange({
          value: inputValue,
          label: inputValue,
        });
        setInputValue("");
      }
      if (
        e.code === "Backspace" &&
        multiple &&
        inputValue === "" &&
        selectValue?.length
      ) {
        selectValue.pop();
        setSelectValue([...selectValue]);
      }
    },
    [
      computedOptions,
      customSelectvalue,
      handleChange,
      inputValue,
      multiple,
      selectValue,
    ]
  );

  const renderTag = useCallback(
    (list: Array<number | string | boolean>) => {
      const ellipsisInfo =
        list.length - 3 > 0
          ? {
              label: `+${list.length - 3}`,
              key: "$$key",
              value: "",
              closeable: false,
            }
          : null;
      const tagList: Array<GeneralComplexOption | string | number | boolean> =
        list.slice(0, 3);
      ellipsisInfo && tagList.push(ellipsisInfo);
      return tagList.map((item) => {
        let option: GeneralComplexOption;
        if (typeof item === "object") {
          option = item;
        } else {
          option =
            computedOptions.find((option) => option.value === item) ??
            ({} as GeneralComplexOption);
          option.closeable = !disabled;
        }
        return (
          <WrappedTag
            key={option.value as number}
            ellipsisWidth="100px"
            color={disabled ? "#ddd" : undefined}
            closable={option.closeable}
            onCheck={() => {
              //
            }}
            onClose={() => handleMultipleItemClose(option.value)}
          >
            {option.label}
          </WrappedTag>
        );
      });
    },
    [handleMultipleItemClose, computedOptions, disabled]
  );

  const getLabel = useCallback(
    (value: any) => {
      if (value !== undefined) {
        return (
          (Array.isArray(value)
            ? renderTag(value)
            : computedOptions.find((item) => item.value === value)?.label) ?? ""
        );
      }
      return "";
    },
    [computedOptions, renderTag]
  );

  const renderLabel = useMemo(() => {
    return getLabel(selectValue) || (placeholder as string);
  }, [getLabel, placeholder, selectValue]);

  const isEmptyValue = useMemo(() => {
    return typeof selectValue === "object"
      ? isEmpty(selectValue)
      : selectValue === undefined;
  }, [selectValue]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <WrappedFormItem {...props}>
      <div
        className={classNames("select", {
          "select-disabled": disabled,
          "select-allow-clear": clearable,
          "select-single": !multiple,
          "select-multiple": multiple,
        })}
        style={inputStyle}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={classNames("select-selector", {
            "selector-focused": isFocused,
            "is-error": validateState === "error",
          })}
          onClick={() => {
            if (!disabled) {
              setIsDropHidden(!isDropHidden);
              setIsFocused(!isFocused);
              inputRef.current && inputRef.current.focus();
            }
          }}
        >
          <div className="select-selection-overflow">
            <div
              className="selected-item"
              style={
                isEmptyValue
                  ? { color: "var(--antd-input-placeholder-color)" }
                  : {}
              }
            >
              <span className="label">{renderLabel}</span>
            </div>
            {multiple && (
              <div className="selected-item">
                <div className="select-selection-search">
                  <input
                    type="text"
                    readOnly={!multiple}
                    value={inputValue}
                    ref={inputRef}
                    className="select-selection-search-input"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
          </div>
          <span className="select-arrow">
            {!isEmptyValue && isFocused && clearable ? (
              <WrappedIcon
                lib="antd"
                icon="close-circle"
                theme="filled"
                onClick={(e) => handleClear(e)}
              />
            ) : (
              <span
                className={classNames(
                  "anticon",
                  "anticon-down ",
                  "ant-select-suffix",
                  {
                    focus: isFocused,
                  }
                )}
              >
                <WrappedIcon icon="down" lib="antd" theme="outlined" />
              </span>
            )}
          </span>
        </div>
        <div
          style={{ ...(isDropHidden ? { display: "none" } : {}) }}
          className="select-dropdown"
        >
          <div className="dropdown-list">
            <div>
              <div className="dropdown-inner">
                {computedOptions.length > 0 ? (
                  computedOptions.map((item) => {
                    return (
                      <div
                        key={item.value.toString()}
                        className={classNames(
                          "select-item",
                          "select-item-option",
                          {
                            disabled: item.disabled,
                            "select-option-selected":
                              typeof selectValue !== "object"
                                ? selectValue === item.value
                                : (selectValue as any[]).includes(item.value),
                          }
                        )}
                        onClick={() => !item.disabled && handleChange(item)}
                      >
                        <div className="select-item-option-content">
                          <div className="option">
                            <span className="label">{item.label}</span>
                          </div>
                          <div className="is-checked">
                            <WrappedIcon
                              {...{
                                lib: "antd",
                                icon: "check",
                                theme: "outlined",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-tips">
                    <WrappedIcon
                      {...{
                        lib: "antd",
                        icon: "warning",
                        theme: "filled",
                        color: "yellow",
                      }}
                      style={{
                        fontSize: 16,
                        marginRight: 12,
                      }}
                    />
                    无数据
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WrappedFormItem>
  );
}

export { Select };
