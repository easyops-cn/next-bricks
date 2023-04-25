import React, { useEffect, useMemo, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./dropdown-menu.shadow.css";
import emptyUrl from "../asset/images/empty.png";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";
import { keyBy } from "lodash";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

const { defineElement, property, event } = createDecorators();

interface DropdownMenuProps {
  curElement?: HTMLElement;
  options?: { label: string, value: string }[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  allowClear?: boolean;
}

/**
 * @id data-view.dropdown-menu
 * @name data-view.dropdown-menu
 * @docKind brick
 * @description 基础下拉菜单
 * @author nlicroshan
 * @noInheritDoc
 */
@defineElement("data-view.dropdown-menu", {
  styleTexts: [variablesStyleText, styleText],
})
class DropdownMenu
  extends ReactNextElement
  implements DropdownMenuProps {
  /**
   * @kind { label: string, value: string }[]
   * @required false
   * @default
   * @description 候选项
   */
  @property({
    attribute: false,
  })
  accessor options: { label: string, value: string }[];

  /**
  * @kind string
  * @required false
  * @default
  * @description 值
  */
  @property()
  accessor value: string;

  /**
  * @kind string
  * @required false
  * @default
  * @description 占位符
  */
  @property()
  accessor placeholder: string;

  /**
  * @kind boolean
  * @required false
  * @default
  * @description 是否允许清除
  */
  @property()
  accessor allowClear: boolean;

  /**
   * @detail
   * @description 值改变
   */
  @event({ type: "value.change" })
  accessor #valueChange!: EventEmitter<string>;

  #handleValueChange = (value: string) => {
    this.#valueChange.emit(value);
  };

  render() {
    return (
      <DropdownMenuElement
        curElement={this}
        options={this.options}
        value={this.value}
        placeholder={this.placeholder}
        onChange={this.#handleValueChange}
        allowClear={this.allowClear}
      />
    );
  }
}

function DropdownMenuElement(
  props: DropdownMenuProps
): React.ReactElement {
  const {
    curElement,
    options,
    placeholder,
    onChange,
    allowClear,
  } = props;

  const [isDropHidden, setIsDropHidden] = React.useState(true);

  const inputRef = useRef<HTMLInputElement>();
  const [inputValue, setInputValue] = React.useState("");
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  const [value, setValue] = useState(props.value);
  const optionsMap = useMemo(() => {
    return keyBy(options, "value");
  }, [options]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!curElement.contains(e.target as HTMLElement)) {
        setIsDropHidden(true);
        setIsInputFocused(() => {
          inputRef.current.blur();
          setInputValue("");
          return false;
        });
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  });

  const filteredOptions = useMemo(() => {
    return options.filter(v => {
      const search = inputValue?.trim().toLowerCase() || "";
      return v.label.toLowerCase().includes(search) || v.value.toLowerCase().includes(search);
    })
  }, [inputValue, options]);

  return (<div className="container">
    <div className={classNames("select", {
      "select-focused": isInputFocused,
      "select-allow-clear": !!allowClear,
    })}>
      <div className="select-selector" onClick={() => {
        setIsDropHidden(false);
        setIsInputFocused((pre) => {
          if (!pre) {
            setInputValue("");
          }
          inputRef.current.focus();
          return true;
        });
      }}>
        <div className="select-selector-search">
          <input className="select-selector-search-input"
            type="search" autoComplete="off" ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
            }}
          />
        </div>
        {value
          ? <div className="select-selector-item" style={{ visibility: inputValue ? "hidden" : "visible" }}>{optionsMap[value] ? optionsMap[value].label : value}</div>
          : <div className="select-selection-placeholder" style={{ visibility: inputValue ? "hidden" : "visible" }}>{placeholder}</div>
        }
        <div className="select-arrow" >
          {isInputFocused
            ? <WrappedIcon className="ant-select-suffix search-icon" lib="antd" theme="outlined" icon="search" />
            : <WrappedIcon className="ant-select-suffix down-icon" lib="antd" theme="outlined" icon="down" />}
        </div>
        {allowClear && <div className="select-clear" style={{ visibility: !value ? "hidden" : "visible" }}
          onMouseDown={(e) => {
            // 使用onMouseDown使输入框保持聚焦
            e.preventDefault();
            e.stopPropagation();
            setInputValue("");
            setValue(null);
            onChange?.(null);
          }}
        >
          <WrappedIcon className="ant-select-suffix clear-icon" lib="antd" theme="filled" icon="close-circle" />
        </div>}
      </div>
    </div>
    <div className="select-dropdown"
      style={{ display: isDropHidden ? "none" : "block" }}
    >
      {
        filteredOptions.length
          ? <div className="dropdown-list">
            <div className="dropdown-list-inner">
              {filteredOptions.map(v => {
                return <div className={classNames("select-item", {
                  selected: value === v.value
                })} key={v.value}
                  onClick={() => {
                    setValue(v.value);
                    setIsDropHidden(true);
                    setIsInputFocused(() => {
                      inputRef.current.blur();
                      setInputValue("");
                      return false;
                    });
                    onChange?.(v.value);
                  }}>
                  <div className="select-item-option-content">{v.label}</div>
                </div>
              })}
            </div>
          </div>
          : <div className="empty-state">
            <img src={emptyUrl} className="empty-image" />
            <div className="empty-description">暂无数据</div>
          </div>
      }
    </div>
  </div>
  );
}

export { DropdownMenu };
