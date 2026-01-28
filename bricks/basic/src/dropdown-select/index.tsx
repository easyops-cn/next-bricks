import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { initializeI18n } from "@next-core/i18n";
import "@next-core/theme";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type {
  Popover,
  PopoverEvents,
  PopoverEventsMapping,
  PopoverProps,
} from "../popover";
import type { Menu } from "../menu";
import type { MenuComponentProps, MenuItem } from "../menu-item";
import type {
  LoadingContainer,
  LoadingContainerProps,
} from "../loading-container";
import { K, NS, locales, t } from "./i18n.js";
import styleText from "./styles.shadow.css";

initializeI18n(NS, locales);

const { defineElement, property, event, method } = createDecorators();

const WrappedPopover = wrapBrick<
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping
>("eo-popover", {
  onVisibleChange: "visible.change",
  onBeforeVisibleChange: "before.visible.change",
});
const WrappedMenu = wrapBrick<Menu, unknown>("eo-menu");
const WrappedMenuItem = wrapBrick<MenuItem, MenuComponentProps>("eo-menu-item");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedLoadingContainer = wrapBrick<
  LoadingContainer,
  LoadingContainerProps
>("eo-loading-container");

export interface DropdownSelectProps {
  defaultValue?: string | number;
  labelMaxWidth?: string | number;
  dropdownMaxWidth?: string | number;
  options?: DropdownSelectOption[];
  size?: "medium" | "large";
  loading?: boolean;
}

export interface DropdownSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface DropdownSelectEvents {
  change: CustomEvent<DropdownSelectOption>;
}

export interface DropdownSelectEventsMapping {
  onChange: "change";
}

interface DropdownSelectRef {
  setDefaultOption(option: DropdownSelectOption): void;
}

const DropdownSelectComponent = forwardRef<
  DropdownSelectRef,
  DropdownSelectComponentProps
>(LegacyDropdownSelectComponent);

/**
 * 下拉式选择构件，常用于标题
 *
 * @slot prefix - 下拉列表前置内容
 */
export
@defineElement("eo-dropdown-select", {
  styleTexts: [styleText],
})
class DropdownSelect extends ReactNextElement implements DropdownSelectProps {
  /**
   * 默认值，仅初始设置有效
   */
  @property({ attribute: false })
  accessor defaultValue: string | number | undefined;

  @property({ attribute: false })
  accessor options: DropdownSelectOption[] | undefined;

  /**
   * @default "medium"
   */
  @property({ render: false })
  accessor size: "medium" | "large" | undefined;

  @property({ type: Boolean })
  accessor loading: boolean | undefined;

  /**
   * @default "650px"
   */
  @property({ attribute: false })
  accessor labelMaxWidth: string | number | undefined;

  /**
   * @default "500px"
   */
  @property({ attribute: false })
  accessor dropdownMaxWidth: string | number | undefined;

  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<DropdownSelectOption>;

  #handleChange = (option: DropdownSelectOption) => {
    this.#changeEvent.emit(option);
  };

  #ref = createRef<DropdownSelectRef>();

  @method()
  setDefaultOption(option: DropdownSelectOption) {
    this.#ref.current?.setDefaultOption(option);
  }

  render() {
    return (
      <DropdownSelectComponent
        ref={this.#ref}
        defaultValue={this.defaultValue}
        options={this.options}
        loading={this.loading}
        labelMaxWidth={this.labelMaxWidth}
        dropdownMaxWidth={this.dropdownMaxWidth}
        onChange={this.#handleChange}
      />
    );
  }
}

export interface DropdownSelectComponentProps extends DropdownSelectProps {
  onChange: (option: DropdownSelectOption) => void;
}

export function LegacyDropdownSelectComponent(
  {
    defaultValue,
    options,
    loading,
    labelMaxWidth,
    dropdownMaxWidth,
    onChange,
  }: DropdownSelectComponentProps,
  ref: React.ForwardedRef<DropdownSelectRef>
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [memoizedOptions, setMemoizedOptions] = useState<
    DropdownSelectOption[] | undefined
  >(options);

  useImperativeHandle(ref, () => ({
    setDefaultOption(option) {
      setMemoizedOptions((prev) => {
        return prev?.some((opt) => opt.value === option.value)
          ? prev
          : (prev ?? []).concat(option);
      });
    },
  }));

  useEffect(() => {
    setMemoizedOptions((prev) => {
      if (prev !== options && options?.length) {
        const newList =
          prev?.filter((opt) => !options?.some((p) => p.value === opt.value)) ??
          [];
        return newList.concat(options);
      }
      return prev;
    });
  }, [options]);

  const activeOption = useMemo(() => {
    return memoizedOptions?.find((opt) => opt.value === value);
  }, [memoizedOptions, value]);

  const handleBeforeVisibleChange = useCallback((e: CustomEvent<boolean>) => {
    setOpen(e.detail);
  }, []);

  return (
    <WrappedPopover
      placement="bottom-start"
      trigger="click"
      active={open}
      arrow={false}
      distance={5}
      onBeforeVisibleChange={handleBeforeVisibleChange}
    >
      <span slot="anchor" className="trigger">
        <span className="label" style={{ maxWidth: labelMaxWidth }}>
          {activeOption ? activeOption?.label : t(K.PLEASE_SELECT)}
        </span>
        <WrappedIcon lib="antd" icon={open ? "caret-up" : "caret-down"} />
      </span>
      <div className="dropdown" style={{ maxWidth: dropdownMaxWidth }}>
        <slot name="prefix" />
        <WrappedLoadingContainer
          loading={loading}
          delay={500}
          style={{ width: "100%" }}
        >
          <WrappedMenu>
            {options?.map((opt) => (
              <WrappedMenuItem
                key={opt.value}
                disabled={opt.disabled}
                className={value === opt.value ? "active" : undefined}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  if (value !== opt.value) {
                    setValue(opt.value);
                    onChange(opt);
                  }
                }}
              >
                {opt.label}
              </WrappedMenuItem>
            ))}
          </WrappedMenu>
        </WrappedLoadingContainer>
      </div>
    </WrappedPopover>
  );
}
