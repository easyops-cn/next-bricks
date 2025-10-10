import React, { useCallback, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  Popover,
  PopoverEvents,
  PopoverEventsMapping,
  PopoverProps,
} from "../popover/index.js";
import type {
  Action,
  ActionsEvents,
  ActionsEventsMapping,
  ActionsProps,
  EoActions,
  SimpleAction,
} from "../actions";

const { defineElement, property, event } = createDecorators();

const WrappedPopover = wrapBrick<
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping
>("eo-popover", {
  onVisibleChange: "visible.change",
  onBeforeVisibleChange: "before.visible.change",
});

const WrappedActions = wrapBrick<
  EoActions,
  ActionsProps,
  ActionsEvents,
  ActionsEventsMapping
>("eo-actions", {
  onActionClick: "action.click",
  onItemDragEnd: "item.drag.end",
  onItemDragStart: "item.drag.start",
});

export interface DropdownActionsProps
  extends Pick<ActionsProps, "actions" | "checkedKeys" | "themeVariant"> {
  disabled?: boolean;
  strategy?: "absolute" | "fixed";
}

export interface DropdownActionsEvents {
  "action.click": CustomEvent<SimpleAction>;
  "visible.change": CustomEvent<boolean>;
}

export interface DropdownActionsEventsMapping {
  onActionClick: "action.click";
  onVisibleChange: "visible.change";
}

/**
 * 下拉菜单
 *
 * @category interact-basic
 */
export
@defineElement("eo-dropdown-actions", {
  styleTexts: [styleText],
})
class EoDropdownActions
  extends ReactNextElement
  implements DropdownActionsProps
{
  /**
   * 操作列表配置
   */
  @property({
    attribute: false,
  })
  accessor actions: Action[] | undefined;

  /**
   * actions选中项配置
   */
  @property({
    attribute: false,
  })
  accessor checkedKeys: (string | number)[] = [];

  /**
   * 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 弹出层如何定位
   * @default "absolute"
   */
  @property()
  accessor strategy: "absolute" | "fixed" | undefined;

  /** 主题变体 */
  @property()
  accessor themeVariant: "default" | "elevo" | undefined;

  /**
   * 点击按钮时触发
   * @detail 该按钮配置
   */
  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<SimpleAction>;

  /**
   * 当弹出层可见性变化之后触发
   * @detail 当前是否可见
   */
  @event({ type: "visible.change" })
  accessor #visibleChangeEvent!: EventEmitter<boolean>;

  #handleVisibleChange = (visible: boolean): void => {
    this.#visibleChangeEvent.emit(visible);
  };

  #handleClick = (action: SimpleAction): void => {
    this.#actionClickEvent.emit(action);
    if (action.event) {
      this.dispatchEvent(new CustomEvent(action.event, { detail: action }));
    }
  };

  render() {
    return (
      <EoDropdownActionsComponent
        actions={this.actions}
        disabled={this.disabled}
        strategy={this.strategy}
        themeVariant={this.themeVariant}
        onActionClick={this.#handleClick}
        onVisibleChange={this.#handleVisibleChange}
        checkedKeys={this.checkedKeys}
      />
    );
  }
}

interface DropdownActionsComponentProps extends DropdownActionsProps {
  onActionClick?: (action: SimpleAction) => void;
  onVisibleChange?: (event: boolean) => void;
}

export function EoDropdownActionsComponent({
  actions,
  checkedKeys,
  disabled,
  strategy,
  themeVariant,
  onActionClick,
  onVisibleChange,
}: DropdownActionsComponentProps) {
  const [visible, setVisible] = useState(false);

  const handleActionClick = useCallback(
    (e: CustomEvent<SimpleAction>) => {
      setVisible(false);
      onActionClick?.(e.detail);
    },
    [onActionClick]
  );

  return (
    <WrappedPopover
      placement="bottom-start"
      trigger="click"
      disabled={disabled}
      active={visible}
      arrow={false}
      distance={4}
      onBeforeVisibleChange={(e) => {
        setVisible(e.detail);
        onVisibleChange?.(e.detail);
      }}
      strategy={strategy}
    >
      <slot slot="anchor" />
      <WrappedActions
        actions={actions}
        checkedKeys={checkedKeys}
        themeVariant={themeVariant}
        onActionClick={handleActionClick}
      />
    </WrappedPopover>
  );
}
