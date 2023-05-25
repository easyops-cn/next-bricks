import React, { useEffect, useMemo, useRef, useState } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./complex-search.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import {
  ReactUseMultipleBricks,
  ReactUseMultipleBricksProps,
} from "@next-core/react-runtime";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import empty from "../asset/images/empty.png";
const { defineElement, property, event } = createDecorators();
initializeReactI18n(NS, locales);
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

export interface OptionItem {
  icon: GeneralIconProps;
  name: string;
  [propName: string]: unknown;
}

interface ComplexSearchProps {
  options?: OptionItem[];
  value?: string;
  placeholder?: string;
  onInputChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  tooltipUseBrick?: ReactUseMultipleBricksProps;
  onSelect?: (data: OptionItem) => void;
}

/**
 * @id data-view.complex-search
 * @name data-view.complex-search
 * @docKind brick
 * @description 大屏搜索构件
 * @author astrid
 * @noInheritDoc
 */
@defineElement("data-view.complex-search", {
  styleTexts: [variablesStyleText, styleText],
})
class ComplexSearch extends ReactNextElement implements ComplexSearchProps {
  /**
   * @kind string
   * @required false
   * @default default
   * @description 初始值
   * @enums
   * @group basic
   */
  @property()
  accessor value: string | undefined;
  /**
   * @kind string
   * @required false
   * @default default
   * @description 占位符
   * @enums
   * @group basic
   */
  @property()
  accessor placeholder: string | undefined;

  /**
   * @kind OptionItem[]
   * @required false
   * @default default
   * @description 下拉选项
   * @enums
   * @group basic
   */
  @property({ attribute: false })
  accessor options: OptionItem[];

  /**
   * @kind ReactUseMultipleBricksProps
   * @required false
   * @default -
   * @description tooltip useBrick
   */
  @property({
    attribute: false,
  })
  accessor tooltipUseBrick: ReactUseMultipleBricksProps;

  /**
   * @detail
   * @description input值改变事件
   */
  @event({ type: "change" })
  accessor #inputChangeEvent!: EventEmitter<string>;

  /**
   * @detail
   * @description input值搜索事件
   */
  @event({ type: "search" })
  accessor #onSearchEvent!: EventEmitter<string>;

  /**
   * @detail
   * @description 下拉选择事件
   */
  @event({ type: "select" })
  accessor #onSelectEvent!: EventEmitter<OptionItem>;

  /**
   * @detail
   * @description 聚焦事件
   */
  @event({ type: "focus" })
  accessor #onFocusEvent!: EventEmitter<void>;

  /**
   * @detail
   * @description 失焦事件
   */
  @event({ type: "blur" })
  accessor #onBlurEvent!: EventEmitter<void>;

  handleInputChange = (value: string) => {
    this.#inputChangeEvent.emit(value);
  };
  handleSearch = (value: string) => {
    this.#onSearchEvent.emit(value);
  };
  handleFocus = () => {
    this.#onFocusEvent.emit();
  };
  handleBlur = () => {
    this.#onBlurEvent.emit();
  };
  handleSelect = (data: OptionItem) => {
    this.#onSelectEvent.emit(data);
  };

  render(): React.ReactNode {
    return (
      <ComplexSearchComponent
        value={this.value}
        onInputChange={this.handleInputChange}
        onSearch={this.handleSearch}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        tooltipUseBrick={this.tooltipUseBrick}
        placeholder={this.placeholder}
        onSelect={this.handleSelect}
        options={this.options}
      />
    );
  }
}

export function ComplexSearchComponent(
  props: ComplexSearchProps
): React.ReactElement {
  const {
    onInputChange,
    onSearch,
    onBlur,
    onFocus,
    tooltipUseBrick,
    placeholder,
    onSelect,
    options = [],
  } = props;
  const { t } = useTranslation(NS);
  const [allowClear, setAllowClear] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [currentData, setCurrentData] = useState<OptionItem>();
  const [positionTop, setPositionTop] = useState<number>(0);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [value, setValue] = useState(props.value);
  const handleFocus = () => {
    //聚焦， 下拉框出现
    setVisible(true);
    onFocus();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setVisible(false);
      setValue((e.target as HTMLInputElement).value);
      onSearch((e.target as HTMLInputElement).value);
    }
  };
  const handleSelect = (data: OptionItem) => {
    setValue(data.name);
    onSelect(data);
    setVisible(false);
  };
  useEffect(() => {
    setValue(props.value);
    setAllowClear(!!props.value);
  }, [props.value]);

  const handleClick = (event: MouseEvent) => {
    const targetElement = event
      .composedPath()
      .some((ele) => ele === contentRef.current);
    if (!targetElement) {
      setVisible(false);
    }
  };
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    data: OptionItem
  ) => {
    setCurrentData(data);
    setTooltipVisible(true);
    const top =
      (e.target as HTMLDivElement).getBoundingClientRect().top -
      contentRef.current.getBoundingClientRect().top;
    setPositionTop(top);
  };
  const handleValueChange = (val: string) => {
    setValue(val);
    onInputChange(val);
    setVisible(true);
  };
  const onClearValue = () => {
    onInputChange("");
    setVisible(false);
  };
  const TooltipBrick = useMemo(() => {
    if (!tooltipUseBrick?.useBrick) {
      return;
    } else {
      return (
        <div
          className="dropdownMenuItemTooltip"
          style={{
            top: positionTop,
            visibility: tooltipVisible ? "visible" : "hidden",
            opacity: tooltipVisible ? 1 : 0,
          }}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <div className="useBrickWrapper">
            <ReactUseMultipleBricks
              useBrick={tooltipUseBrick.useBrick}
              data={currentData || {}}
            />
          </div>
        </div>
      );
    }
  }, [currentData, tooltipUseBrick, positionTop, tooltipVisible]);
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="wrapper" ref={contentRef}>
      <div className="inputWrapper">
        <input
          placeholder={placeholder}
          value={value ?? ""}
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleValueChange(e.target.value)
          }
          onFocus={handleFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
        />
        <WrappedIcon
          className="searchIcon icon"
          lib="antd"
          icon="search"
          theme="outlined"
        />
        {allowClear && (
          <WrappedIcon
            className="clearIcon icon"
            onClick={onClearValue}
            lib="antd"
            icon="close-circle"
            theme="filled"
          />
        )}
      </div>
      <div
        className="dropdownWrapper"
        style={{
          visibility: visible ? "visible" : "hidden",
        }}
      >
        {options.length ? (
          <div className="dropdownMenu">
            {options.map((option, index) => (
              <div
                className="dropdownMenuItem"
                key={index}
                onMouseEnter={(e) => handleMouseEnter(e, option)}
                onMouseLeave={() => setTooltipVisible(false)}
                onClick={() => handleSelect(option)}
              >
                <WrappedIcon {...option.icon} className="menuIcon" />
                <span className="menuTitle">{option.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="emptyData">
            <img src={empty} alt={t(K.EMPTY_DATA)} />
            <span>{t(K.EMPTY_DATA)}</span>
          </div>
        )}
      </div>
      {TooltipBrick}
    </div>
  );
}

export { ComplexSearch };
