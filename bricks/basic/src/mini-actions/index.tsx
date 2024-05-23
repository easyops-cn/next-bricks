import React, { useMemo, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type {
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping,
} from "../popover/index.jsx";
import type {
  SimpleAction,
  Divider,
  ActionsEvents,
  ActionsEventsMapping,
  ActionsProps,
  EoActions,
} from "../actions";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";

import type { EoTooltip, ToolTipProps } from "../tooltip/index.jsx";
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedPopover = wrapBrick<
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping
>("eo-popover", {
  onVisibleChange: "visible.change",
  beforeVisibleChange: "before.visible.change",
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

export interface SimpleActionType extends Omit<SimpleAction, "text"> {
  text?: string;
  isDropdown?: boolean;
}

export type ActionType = SimpleActionType & Divider;

export interface EoMiniActionsProps {
  actions?: ActionType[];
}

export interface EoMiniActionsEvents {
  "action.click": CustomEvent<SimpleActionType>;
}

export interface EoMiniActionsEventsMapping {
  onActionClick: "action.click";
}

/**
 * 小尺寸按钮组
 * @category interact-basic
 */
export
@defineElement("eo-mini-actions", {
  styleTexts: [styleText],
})
class EoMiniActions extends ReactNextElement implements EoMiniActionsProps {
  /**
   * 操作列表配置
   */
  @property({
    attribute: false,
  })
  accessor actions: ActionType[] | undefined;

  /**
   * 点击按钮时触发
   * @detail 该按钮配置
   */
  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<SimpleActionType>;

  #handleActionClick = (action: SimpleActionType) => {
    if (!action.disabled && action.event) {
      this.dispatchEvent(new CustomEvent(action.event));
      this.#actionClickEvent.emit(action);
    }
  };

  render() {
    return (
      <EoMiniActionsComponent
        actions={this.actions}
        onActionClick={this.#handleActionClick}
      />
    );
  }
}

interface EoMiniActionsComponentProps extends EoMiniActionsProps {
  onActionClick: (action: SimpleActionType) => void;
}

export function EoMiniActionsComponent(props: EoMiniActionsComponentProps) {
  const { actions, onActionClick } = props;

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [outSideActions, dropdownActions] = useMemo(() => {
    const _outSideActions: SimpleActionType[] = [];
    const _dropdownActions: ActionType[] = [];

    actions?.forEach((action) => {
      if (action.hidden) return;
      if (action.isDropdown) {
        _dropdownActions.push(action);
      } else if (action.type !== "divider") {
        _outSideActions.push(action);
      }
    });

    return [_outSideActions, _dropdownActions];
  }, [actions]);

  const handlePopoverVisibleChange = (event: CustomEvent<boolean>) => {
    setDropdownVisible(event.detail);
  };

  const handleActionClick = (action: SimpleActionType) => {
    if (!action.disabled) {
      setDropdownVisible(false);
      onActionClick?.(action);
    }
  };

  return (
    <div className="group-wrapper">
      {outSideActions.map((action, i) => {
        return (
          <div
            key={i}
            className={classNames("button-item", {
              disabled: action.disabled,
            })}
            onClick={() => handleActionClick(action)}
          >
            {action.tooltip ? (
              <WrappedTooltip
                className="button-item-tooltip"
                key={i}
                content={action.tooltip}
              >
                <WrappedIcon className="button-item-icon" {...action.icon!} />
              </WrappedTooltip>
            ) : (
              <WrappedIcon className="button-item-icon" {...action.icon!} />
            )}
          </div>
        );
      })}
      {!!dropdownActions.length && (
        <WrappedPopover
          placement="bottom-start"
          strategy="fixed"
          arrow={false}
          active={dropdownVisible}
          beforeVisibleChange={handlePopoverVisibleChange}
        >
          <div
            slot="anchor"
            className={classNames("button-item", "button-dropdown-item", {
              "button-dropdown-item-active": dropdownVisible,
            })}
          >
            <WrappedIcon
              className="button-item-icon"
              lib="easyops"
              category="default"
              icon="more"
            />
          </div>
          <WrappedActions
            style={{ minWidth: "max-content" }}
            actions={dropdownActions}
            onActionClick={(e) => {
              handleActionClick(e.detail);
            }}
          />
        </WrappedPopover>
      )}
    </div>
  );
}
