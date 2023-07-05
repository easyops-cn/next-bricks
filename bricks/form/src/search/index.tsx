import React, {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";
import { debounce } from "lodash";

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface SearchProps {
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  clearable?: boolean;
  trim?: boolean;
  debounceTime?: number;
}

export interface SearchEvents {
  blur: CustomEvent<string>;
  change: CustomEvent<string>;
  search: CustomEvent<string>;
}

export interface SearchEventsMap {
  onBlur: "blur";
  onChange: "change";
  onSearch: "search";
}

/**
 * 搜索框
 */
export
@defineElement("eo-search", {
  styleTexts: [styleText],
  alias: ["form.general-search"],
})
class GeneralSearch extends ReactNextElement implements SearchProps {
  /**
   * 搜索框的值
   */
  @property()
  accessor value: string = "";

  /**
   * 提示语
   */
  @property()
  accessor placeholder: string | undefined;

  /**
   * 是否自动聚焦
   */
  @property({
    type: Boolean,
  })
  accessor autoFocus: boolean | undefined;

  /**
   * 可以点击清除图标删除内容
   */
  @property({
    type: Boolean,
  })
  accessor clearable: boolean | undefined;

  /**
   * 是否剔除前后空格
   */
  @property({
    type: Boolean,
  })
  accessor trim: boolean | undefined;

  /**
   * 默认延迟时间
   */
  @property({
    type: Number,
  })
  accessor debounceTime: number = 0;

  /**
   * 失焦时触发, 而且会传出当前输入框当前值
   */
  @event({ type: "blur" })
  accessor #blur!: EventEmitter<string>;
  #handleBlur = (value: string) => {
    this.#blur.emit(this.trim ? value.trim() : value);
  };

  /**
   * 输入的搜索字符，输入变化时触发
   */
  @event({ type: "change" })
  accessor #change!: EventEmitter<string>;
  #handleChange = (value: string) => {
    this.value = value;
  };
  #handleDebouncedChange = (value: string) => {
    this.#change.emit(this.trim ? value.trim() : value);
  };

  /**
   * 搜索时触发
   */
  @event({ type: "search" })
  accessor #search!: EventEmitter<string>;
  #handleSearch = (value: string) => {
    this.#search.emit(this.trim ? value.trim() : value);
  };

  render() {
    return (
      <GeneralSearchComponent
        value={this.value}
        placeholder={this.placeholder}
        autoFocus={this.autoFocus}
        clearable={this.clearable}
        debounceTime={this.debounceTime}
        onBlur={this.#handleBlur}
        onChange={this.#handleChange}
        onSearch={this.#handleSearch}
        onDebouncedChange={this.#handleDebouncedChange}
      />
    );
  }
}

interface SearchComponentProps extends SearchProps {
  onBlur?: (value: string) => void;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
}

export function GeneralSearchComponent(props: SearchComponentProps) {
  const {
    placeholder,
    autoFocus,
    clearable,
    debounceTime,
    onDebouncedChange,
    onChange,
    onSearch,
    onBlur,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState<string>();
  const [inputFocused, setInputFocused] = useState<boolean>();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    autoFocus && inputRef.current?.focus();
  }, [autoFocus]);

  const _onDebouncedChange = useMemo(() => {
    return debounceTime
      ? debounce(onDebouncedChange!, debounceTime)
      : onDebouncedChange;
  }, [debounceTime]);

  const handleSearch = () => {
    onSearch?.(value!);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
    _onDebouncedChange?.(e.target.value);
  };

  const handleClear = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("");
    onChange?.("");
    _onDebouncedChange?.("");
  };

  const handleSearchBtnClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleSearch();
  };

  return (
    <>
      <div
        className={classNames("search-input-wrapper", {
          "allow-clear": clearable,
          "search-input-wrapper-focused": inputFocused,
        })}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder={placeholder}
          value={value || ""}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onFocus={() => setInputFocused(true)}
          onBlur={() => {
            setInputFocused(false);
            onBlur?.(value!);
          }}
        />
        {clearable && value && (
          <WrappedIcon
            className="clear-button"
            lib="antd"
            icon="close-circle"
            theme="filled"
            onMouseDown={handleClear}
          />
        )}
        <WrappedIcon
          className="search-button"
          lib="antd"
          icon="search"
          theme="outlined"
          onClick={handleSearchBtnClick}
        />
      </div>
    </>
  );
}
