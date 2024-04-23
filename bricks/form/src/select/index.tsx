import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import { FormItemElementBase } from "@next-shared/form";
import type { GeneralComplexOption, GeneralOption } from "../interface.js";
import styleText from "./index.shadow.css";
import classNames from "classnames";
import "@next-core/theme";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import { formatOptions } from "../utils/formatOptions.js";
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
import { isEmpty, groupBy, isNil, debounce } from "lodash";
import { UseSingleBrickConf } from "@next-core/types";
import { ReactUseBrick } from "@next-core/react-runtime";
import { handleHttpError, fetchByProvider } from "@next-core/runtime";
import Empty from "./empty.svg";

interface UseBackendConf {
  provider: string;
  args: any[] | ((...args: any[]) => any[]);
  transform?: (data: any) => void;
}

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

const WrappedTag = wrapBrick<Tag, TagProps, TagEvents, TagMapEvents>("eo-tag", {
  onCheck: "check",
  onClose: "close",
});

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const isSearchable = (value: UseBackendConf): value is UseBackendConf => {
  return typeof value?.provider === "string";
};

const applyArgs = (
  args: any[] | ((query: string) => any[]),
  query: string
): any => {
  if (Array.isArray(args)) {
    return args.map((arg) => applyArgs(arg, query));
  }
  if (typeof args === "function") {
    return (args as (query: string) => any[]).call(null, query);
  }

  return args;
};

type RequestStatus = "loading" | "success" | "error";

export interface SelectProps extends FormItemProps {
  value?: any;
  options: GeneralComplexOption[];
  placeholder?: string;
  mode?: "tags" | "multiple";
  tokenSeparators?: string[];
  maxTagCount?: number;
  groupBy?: string;
  suffix?: UseSingleBrickConf;
  fields?: { label?: string; value?: string };
  useBackend?: UseBackendConf & {
    onValueChangeArgs?: any[] | ((...args: any[]) => any[]);
    // emptyConfig?: Partial<Record<RequestStatus, EasyopsEmptyProps>>;
  };
  debounceSearchDelay?: number;
  clearable?: boolean;
  disabled?: boolean;
  inputStyle?: React.CSSProperties;
  validateState?: string;
  onChange?: (value: any, options: GeneralComplexOption[]) => void;
  onValueChange?: (value: any) => void;
  optionsChange?: (options: any, name: string) => void;
  onFocus?: () => void;
  onSearch?: (value: string) => void;
}

const { defineElement, property, event } = createDecorators();

/**
 * 通用下拉选择构件
 * @author sailorshe
 * @category form-input-basic
 */
@defineElement("eo-select", {
  styleTexts: [styleText],
  alias: ["form.general-select"],
})
class Select extends FormItemElementBase {
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
  accessor options!: GeneralComplexOption[];

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
   * 类型
   */
  @property()
  accessor mode: "tags" | "multiple" | undefined;

  /**
   * 自动分词的分隔符，仅在 mode="tags" 时生效
   */
  @property({
    attribute: false,
  })
  accessor tokenSeparators: string[] | undefined;

  /**
   * 最多显示多少个 tag, 剩余的 tag 将被隐藏
   */
  @property()
  accessor maxTagCount: number | undefined;

  /**
   * 分组字段
   */
  @property()
  accessor groupBy: string | undefined;

  /**
   */
  @property({
    attribute: false,
  })
  accessor suffix: UseSingleBrickConf | undefined;

  /**
   * 是否支持清除
   * @default true
   */
  @property({ type: Boolean })
  accessor clearable: boolean | undefined;

  /**
   * 列表指定字段作为 label 和 value
   */
  @property({
    attribute: false,
  })
  accessor fields: { label?: string; value?: string } | undefined;

  /**
   * 后端搜索
   */
  @property({
    attribute: false,
  })
  accessor useBackend: UseBackendConf | undefined;

  @property({
    type: Number,
  })
  accessor debounceSearchDelay: number | undefined;

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
   * 下拉框search事件
   */
  @event({ type: "search" }) accessor #searchEvent!: EventEmitter<{
    value: string;
  }>;

  /**
   * 下拉框focus事件
   */
  @event({ type: "focus" }) accessor #focusEvent!: EventEmitter<void>;

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

  handleChange = (
    value: string | string[],
    options: GeneralComplexOption[]
  ): void => {
    this.value = value;

    this.#changeEvent.emit({
      value,
      options,
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

  handleSearch = (value: string) => {
    this.#searchEvent.emit({
      value,
    });
  };

  handleFocus = () => {
    this.#focusEvent.emit();
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
        mode={this.mode}
        tokenSeparators={this.tokenSeparators}
        maxTagCount={this.maxTagCount}
        groupBy={this.groupBy}
        suffix={this.suffix}
        fields={this.fields}
        useBackend={this.useBackend}
        debounceSearchDelay={this.debounceSearchDelay}
        clearable={this.clearable}
        trigger="handleChange"
        inputStyle={this.inputStyle}
        validateState={this.validateState}
        notRender={this.notRender}
        helpBrick={this.helpBrick}
        labelBrick={this.labelBrick}
        options={this.options}
        onChange={this.handleChange}
        optionsChange={this._handleOptionsChange}
        onSearch={this.handleSearch}
        onFocus={this.handleFocus}
      />
    );
  }
}

export function SelectComponent(props: SelectProps) {
  const {
    curElement,
    name,
    disabled,
    mode,
    tokenSeparators,
    maxTagCount,
    suffix,
    fields,
    useBackend,
    debounceSearchDelay,
    clearable = true,
    inputStyle,
    placeholder,
    validateState,
    optionsChange,
    onChange,
    onFocus,
    onValueChange,
    onSearch,
  } = props;

  const multiple = useMemo(
    () => mode && ["multiple", "tags"].includes(mode),
    [mode]
  );
  const selectRef = useRef<HTMLDivElement>(null);
  const inputSpanRef = useRef<HTMLSpanElement>(null);
  const shouldTriggerOnValueChangeArgs = useRef(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputWidth, setInputWidth] = useState<number>();
  const [value, setValue] = useState<any>(mode ? [] : undefined);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>();
  const [options, setOptions] = useState<any[]>(
    formatOptions(props.options, fields) ?? []
  );
  const [isDropHidden, setIsDropHidden] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<
    GeneralComplexOption[]
  >([]);
  const [renderOptions, setRenderOptions] = useState<any[]>([]);
  const [focusOptionItem, setFocusOptionItem] = useState<GeneralComplexOption>(
    {} as GeneralComplexOption
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOptions(
      formatOptions(
        (props.options ?? []).concat(
          mode === "tags" && props.value ? props.value : []
        ),
        fields
      )
    );
  }, [props.options, fields, props.value, mode]);

  const handleSelectorClick = useCallback(() => {
    if (!value) {
      setIsDropHidden(false);
      setIsFocused(true);
      onFocus?.();
      inputRef.current && inputRef.current.focus();
    } else if (!disabled) {
      setIsDropHidden(!isDropHidden);
      setIsFocused(true);
      inputRef.current && inputRef.current.focus();
    }
  }, [disabled, isDropHidden, value, onFocus]);

  const handleChange = useCallback(
    (option: GeneralComplexOption<any>): void => {
      shouldTriggerOnValueChangeArgs.current = false;
      let newValue;
      if (multiple) {
        newValue = (value ?? []).includes(option.value)
          ? (value as string[]).filter((item) => item !== option.value)
          : (((value as any[]) ?? []).concat(option.value) as string[]);
      } else {
        newValue = option.value;
      }
      const getSelectOptions = () => {
        const hadSelected = selectedOptions.find(
          (item) => item.value === option.value
        );
        return hadSelected
          ? selectedOptions.filter((item) => item.value !== option.value)
          : selectedOptions.concat(option);
      };
      const newOptions = multiple ? getSelectOptions() : [option];
      setSelectedOptions(newOptions);
      setValue(newValue);
      onChange?.(newValue, newOptions);
      onValueChange?.(newValue);
      setIsDropHidden(!multiple);
      setFocusOptionItem(option);
      !multiple && setIsFocused(false);
      multiple && inputRef.current && inputRef.current.focus();
      setInputValue("");
    },
    [multiple, onChange, onValueChange, selectedOptions, value]
  );

  const handleMultipleItemClose = useCallback(
    (closeValue: string | number | boolean) => {
      const newOptions = selectedOptions.filter(
        (item) => item.value !== closeValue
      );
      setSelectedOptions(newOptions);
      onChange?.(
        newOptions.map((item) => item.value),
        newOptions
      );
    },
    [onChange, selectedOptions]
  );

  const handleClear = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedOptions([]);
    onChange?.(undefined, []);
  };

  const handleSearchQuery = useCallback(
    async (value = "", type: "valueChange" | "search") => {
      if (useBackend && isSearchable(useBackend)) {
        const {
          provider,
          args,
          onValueChangeArgs,
          transform = (data) => data,
        } = useBackend;
        try {
          setRequestStatus("loading");
          const actualArgs = applyArgs(
            type === "search" ? args : onValueChangeArgs!,
            value
          );
          const result = await fetchByProvider(provider, actualArgs);
          if (isNil(result)) return;
          const transformedData = transform(result);
          const actualData = formatOptions(
            transformedData as unknown as GeneralOption[],
            fields as any
          );
          setRequestStatus("success");
          setOptions(actualData);
          // 值设置后，需要回填
          if (type === "valueChange") {
            setSelectedOptions(
              actualData.filter((item) =>
                Array.isArray(props.value)
                  ? props.value.includes(item.value)
                  : item.value === props.value
              )
            );
          }
        } catch (e) {
          setRequestStatus("error");
          handleHttpError(e);
        }
      }
    },
    [useBackend, fields, props.value]
  );

  const handleDebounceBackendSearch = useMemo(() => {
    return debounce(handleSearchQuery, debounceSearchDelay || 300);
  }, [debounceSearchDelay, handleSearchQuery]);

  const computedOptions = React.useMemo((): GeneralComplexOption[] => {
    return (mode === "tags" && inputValue ? [inputValue] : [])
      .map((item) => ({
        key: item,
        label: item,
        value: item,
      }))
      .concat(
        selectedOptions.filter(
          (selected) =>
            !options.find((option) => option.value === selected.value)
        ) as any
      )
      .concat(options);
  }, [inputValue, mode, options, selectedOptions]);

  useEffect(() => {
    const computedValue =
      multiple && props.value && !Array.isArray(props.value)
        ? [props.value]
        : props.value;
    setValue(computedValue);
    // 设置回填option
    if (computedValue) {
      setSelectedOptions(
        computedOptions.filter((item) =>
          multiple
            ? computedValue.includes(item.value)
            : item.value === props.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, options]);

  useEffect(() => {
    optionsChange?.(computedOptions, name as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedOptions]);

  useEffect(() => {
    props?.useBackend?.onValueChangeArgs &&
      shouldTriggerOnValueChangeArgs.current &&
      !(Array.isArray(props.value)
        ? props.value.length === 0
        : isNil(props.value)) &&
      handleSearchQuery(props.value, "valueChange");
    shouldTriggerOnValueChangeArgs.current = true;
  }, [handleSearchQuery, props?.useBackend?.onValueChangeArgs, props.value]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const value = e.target.value;
      if (mode === "tags" && value) {
        const matchToken = tokenSeparators?.includes(value[value.length - 1]);
        const customValue =
          value && matchToken ? value.substring(0, value.length - 1) : value;
        if (matchToken) {
          handleChange({
            key: customValue,
            label: customValue,
            value: customValue,
          });
        } else {
          setInputValue(value);
        }
      } else {
        setInputValue(value);
        setIsDropHidden(false);
        onSearch?.(value);
      }
      handleDebounceBackendSearch(value, "search");
    },
    [handleChange, handleDebounceBackendSearch, mode, onSearch, tokenSeparators]
  );

  const handleKeydown = useCallback(
    (e: KeyboardEvent): void => {
      if (isFocused) {
        if (e.code === "Enter") {
          focusOptionItem && handleChange(focusOptionItem);
        }
        if (
          e.code === "Backspace" &&
          multiple &&
          inputValue === "" &&
          selectedOptions?.length
        ) {
          selectedOptions.pop();
          setSelectedOptions([...selectedOptions]);
          value.pop();
          setValue([...value]);
        }
      }
      if (!isDropHidden && focusOptionItem) {
        if (e.code === "ArrowDown") {
          const index = renderOptions.findIndex(
            (item) => item.value === focusOptionItem.value
          );
          setFocusOptionItem(
            renderOptions[
              index + 1 > renderOptions.length - 1
                ? renderOptions.length - 1
                : index + 1
            ]
          );
        }
        if (e.code === "ArrowUp") {
          const index = renderOptions.findIndex(
            (item) => item.value === focusOptionItem.value
          );
          setFocusOptionItem(renderOptions[index - 1 < 0 ? 0 : index - 1]);
        }
      }
    },
    [
      isFocused,
      multiple,
      inputValue,
      selectedOptions,
      isDropHidden,
      focusOptionItem,
      handleChange,
      value,
      renderOptions,
    ]
  );

  const isEmptyValue = useMemo(() => {
    return typeof selectedOptions === "object"
      ? isEmpty(selectedOptions)
      : selectedOptions === undefined;
  }, [selectedOptions]);

  useLayoutEffect(() => {
    const renderOptions = computedOptions.filter((item) =>
      inputValue
        ? (item.label as string)
            .toLocaleUpperCase()
            .includes(inputValue.toLocaleUpperCase())
        : true
    );
    setRenderOptions(renderOptions);
    setFocusOptionItem(renderOptions?.[0]);

    if (inputSpanRef.current) {
      setInputWidth(
        inputSpanRef.current?.offsetWidth === 0
          ? 4
          : inputSpanRef.current?.offsetWidth
      );
    }
  }, [computedOptions, handleChange, inputValue, mode, tokenSeparators]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      e.stopPropagation();
      const path = e.composedPath();
      if (curElement && path.includes(curElement)) return;
      setIsFocused(false);
      setIsDropHidden(true);
      setInputValue("");
    };
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [curElement, handleKeydown]);

  const renderSelector = useMemo(() => {
    let tagList: GeneralComplexOption[] = selectedOptions;
    if (maxTagCount) {
      const ellipsisInfo =
        selectedOptions.length - maxTagCount > 0
          ? {
              label: `+${selectedOptions.length - maxTagCount}`,
              key: "$$key",
              value: "",
              closable: false,
            }
          : null;
      tagList = selectedOptions.slice(0, maxTagCount);
      ellipsisInfo && tagList.push(ellipsisInfo);
    }
    const allOptions = computedOptions.reduce(
      (pre: any, cur: any) =>
        cur.options ? [...pre, ...cur.options] : [...pre, cur],
      []
    );

    const renderLabel = (option: GeneralComplexOption): React.ReactNode => {
      return (
        <div className="label">
          <span className="text">
            {multiple ? (
              <WrappedTag
                key={option.value as number}
                color={disabled ? "#ddd" : undefined}
                closable={option.closable ?? true}
                checkable={false}
                onClose={() => handleMultipleItemClose(option.value)}
              >
                {option.label}
                {multiple && suffix && (
                  <ReactUseBrick useBrick={suffix} data={option} />
                )}
              </WrappedTag>
            ) : (
              option.label
            )}
          </span>
          {!multiple && suffix && (
            <ReactUseBrick useBrick={suffix} data={option} />
          )}
        </div>
      );
    };

    const renderMultipleLabel = (
      list: Array<GeneralComplexOption>
    ): React.ReactNode => {
      return list.map((item) => {
        let option: GeneralComplexOption;
        if (typeof item === "object") {
          option = item;
        } else {
          option =
            allOptions.find((option: any) => option.value === item) ??
            ({} as GeneralComplexOption);
          option.closeable = !disabled && option.closeable;
        }
        return renderLabel(option);
      });
    };

    return (
      <div
        className={classNames({
          "selected-item": multiple,
          "select-single-item": !multiple,
        })}
        style={
          isEmptyValue ? { color: "var(--antd-input-placeholder-color)" } : {}
        }
      >
        {selectedOptions?.length
          ? multiple
            ? renderMultipleLabel(tagList)
            : renderLabel(selectedOptions[0])
          : isFocused || inputValue
            ? ""
            : placeholder}
      </div>
    );
  }, [
    computedOptions,
    disabled,
    handleMultipleItemClose,
    inputValue,
    isEmptyValue,
    isFocused,
    maxTagCount,
    multiple,
    placeholder,
    selectedOptions,
    suffix,
  ]);

  const Options = useMemo(() => {
    const getSelectOption = (item: any): React.ReactNode => (
      <div
        key={item.value?.toString()}
        className={classNames("select-item", "select-item-option", {
          disabled: item.disabled,
          "select-option-hover": item.value === focusOptionItem.value,
          "select-option-selected":
            typeof value !== "object"
              ? value === item?.value
              : (value as any[])?.includes(item.value),
        })}
        onClick={() => !item.disabled && handleChange(item)}
        onMouseOver={() => setFocusOptionItem(item)}
        onMouseLeave={() => setFocusOptionItem({} as any)}
      >
        <div className="select-item-option-content">
          <div className="option">
            <span className="label">{item.label}</span>
            {suffix && <ReactUseBrick useBrick={suffix} data={item} />}
          </div>
          {multiple && (
            <div className="is-checked">
              <WrappedIcon
                {...{
                  lib: "antd",
                  icon: "check",
                  theme: "outlined",
                }}
              />
            </div>
          )}
        </div>
      </div>
    );

    const renderGroupOption = (): React.ReactNode => {
      const optsGroup = Object.entries(groupBy(renderOptions, props.groupBy));

      return optsGroup.map(([group, options], index) =>
        group !== "undefined" ? (
          <div key={index} className="select-group-wrapper">
            <div className="select-group-label">{group}</div>
            {options.map((item) => getSelectOption(item))}
          </div>
        ) : (
          options.map((item) => getSelectOption(item))
        )
      );
    };

    const renderOption = () =>
      renderOptions.map((item: any) => {
        return getSelectOption(item);
      });

    return renderOptions.length > 0 ? (
      props.groupBy ? (
        renderGroupOption()
      ) : (
        renderOption()
      )
    ) : (
      <div className="empty-tips">
        <Empty />
        <span>暂无数据</span>
      </div>
    );
  }, [
    renderOptions,
    props.groupBy,
    focusOptionItem,
    value,
    suffix,
    multiple,
    handleChange,
  ]);

  return (
    <WrappedFormItem {...(props as FormItemProps)}>
      <div
        className={classNames("select", {
          "select-disabled": disabled,
          "select-allow-clear": clearable,
          "select-single": !multiple,
          "select-multiple": multiple,
        })}
        style={inputStyle}
        ref={selectRef}
      >
        <div
          className={classNames("select-selector", {
            "selector-focused": isFocused,
            "is-error": validateState === "error",
          })}
          onClick={handleSelectorClick}
        >
          <div className="select-selection-overflow">
            {multiple && renderSelector}
            <div className="input-item">
              <div className="select-selection-search">
                <span
                  style={{ position: "absolute", opacity: "0" }}
                  ref={inputSpanRef}
                >
                  {inputValue}
                </span>
                <input
                  style={{ width: inputWidth }}
                  type="text"
                  value={inputValue}
                  ref={inputRef}
                  className="select-selection-search-input"
                  onChange={handleInputChange}
                />
              </div>
              {!multiple ? !inputValue && renderSelector : null}
            </div>
          </div>
          <span className="select-arrow">
            {!isEmptyValue && clearable ? (
              <WrappedIcon
                className="close-btn"
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
            {requestStatus === "loading" ? (
              <div className="dropdown-list-loading-container">
                <WrappedIcon
                  {...{
                    icon: "loading",
                    lib: "antd",
                    theme: "outlined",
                    spinning: true,
                  }}
                />
              </div>
            ) : (
              <div className="dropdown-inner">{Options}</div>
            )}
          </div>
        </div>
      </div>
    </WrappedFormItem>
  );
}

export { Select };
