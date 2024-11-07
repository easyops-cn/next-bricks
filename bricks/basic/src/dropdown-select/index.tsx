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
import styleText from "./styles.shadow.css";

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

export interface DropdownSelectProps {
  defaultValue?: string | number;
  options?: DropdownSelectOption[];
  size?: "medium" | "large";
}

export interface DropdownSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface DropdownSelectRef {
  setDefaultOption(option: DropdownSelectOption): void;
}

const DropdownSelectComponent = forwardRef<
  DropdownSelectRef,
  DropdownSelectComponentProps
>(LegacyDropdownSelectComponent);

/**
 * 构件 `eo-dropdown-select`
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
  accessor options: DropdownSelectOption[] = [];

  /**
   * @default "medium"
   */
  @property({ render: false })
  accessor size: "medium" | "large" | undefined;

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
        onChange={this.#handleChange}
      />
    );
  }
}

export interface DropdownSelectComponentProps extends DropdownSelectProps {
  onChange: (option: DropdownSelectOption) => void;
}

export function LegacyDropdownSelectComponent(
  { defaultValue, options, onChange }: DropdownSelectComponentProps,
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
          : prev?.concat(option);
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
        <span className="label">
          {activeOption ? activeOption?.label : "请选择"}
        </span>
        <WrappedIcon lib="antd" icon={open ? "caret-up" : "caret-down"} />
      </span>
      <div className="dropdown">
        <slot name="prefix" />
        <WrappedMenu>
          {options?.map((opt) => (
            <WrappedMenuItem
              key={opt.value!}
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
      </div>
    </WrappedPopover>
  );
}
