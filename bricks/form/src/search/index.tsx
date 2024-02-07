import React, { useEffect, useState, useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { debounce } from "lodash";
import {
  Input,
  InputEvents,
  InputEventsMap,
  InputProps,
} from "../input/index.jsx";

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedInput = wrapBrick<Input, InputProps, InputEvents, InputEventsMap>(
  "eo-input",
  {
    onChange: "change",
  }
);

export interface SearchProps {
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  clearable?: boolean;
  trim?: boolean;
  debounceTime?: number;
}

export interface SearchEvents {
  change: CustomEvent<string>;
  search: CustomEvent<string>;
}

export interface SearchEventsMap {
  onChange: "change";
  onSearch: "search";
}

/**
 * 搜索框
 * @author nlicro
 * @category form-input-basic
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
   * 输入的搜索字符，输入变化时触发
   */
  @event({ type: "change" })
  accessor #change!: EventEmitter<string>;
  #handleChange = (value: string) => {
    this.value = value;
  };
  #handleDebouncedChange = (value: string) => {
    this.#change.emit(this.trim ? value?.trim() : value);
  };

  /**
   * 搜索时触发
   */
  @event({ type: "search" })
  accessor #search!: EventEmitter<string>;
  #handleSearch = (value: string) => {
    this.#search.emit(this.trim ? value?.trim() : value);
  };

  render() {
    return (
      <GeneralSearchComponent
        value={this.value}
        placeholder={this.placeholder}
        autoFocus={this.autoFocus}
        clearable={this.clearable}
        debounceTime={this.debounceTime}
        onChange={this.#handleChange}
        onSearch={this.#handleSearch}
        onDebouncedChange={this.#handleDebouncedChange}
      />
    );
  }
}

interface SearchComponentProps extends SearchProps {
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
  } = props;

  const [value, setValue] = useState<string>();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const _onDebouncedChange = useMemo(() => {
    return debounceTime
      ? debounce(onDebouncedChange!, debounceTime)
      : onDebouncedChange;
  }, [debounceTime]);

  const handleSearch = () => {
    onSearch?.(value!);
  };

  const handleChange = (e: CustomEvent<string>) => {
    setValue(e.detail);
    onChange?.(e.detail);
    _onDebouncedChange?.(e.detail);
  };

  return (
    <WrappedInput
      type="text"
      // React has special treatment for autoFocus. So we set the autofocus attribute to eo-input.
      auto-focus={autoFocus}
      clearable={clearable}
      placeholder={placeholder}
      value={value}
      onChange={handleChange as any}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
    >
      <WrappedIcon
        slot="suffix"
        className="search-button"
        lib="antd"
        icon="search"
        theme="outlined"
        onClick={() => handleSearch()}
        onMouseDown={(e) => e.preventDefault()}
      />
    </WrappedInput>
  );
}
