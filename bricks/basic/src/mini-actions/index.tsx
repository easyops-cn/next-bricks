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
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";

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

export interface ActionType {
  icon?: GeneralIconProps;
  text?: string;
  isDropdown?: boolean;
  event?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export interface EoMiniActionsProps {
  actions?: ActionType[];
}

export interface EoMiniActionsEvents {
  "action.click": CustomEvent<ActionType>;
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
  accessor #actionClickEvent!: EventEmitter<ActionType>;

  #handleActionClick = (action: ActionType) => {
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
  onActionClick: (action: ActionType) => void;
}

export function EoMiniActionsComponent(props: EoMiniActionsComponentProps) {
  const { actions, onActionClick } = props;

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [outSideActions, dropdownActions] = useMemo(() => {
    const _outSideActions: ActionType[] = [];
    const _dropdownActions: ActionType[] = [];

    actions?.forEach((action) => {
      if (action.hidden) return;
      if (action.isDropdown) {
        _dropdownActions.push(action);
      } else {
        _outSideActions.push(action);
      }
    });

    return [_outSideActions, _dropdownActions];
  }, [actions]);

  const handlePopoverVisibleChange = (event: CustomEvent<boolean>) => {
    setDropdownVisible(event.detail);
  };

  const handleActionClick = (action: ActionType) => {
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
            <WrappedIcon className="button-item-icon" {...action.icon!} />
          </div>
        );
      })}
      {!!dropdownActions.length && (
        <WrappedPopover
          placement="bottom-start"
          strategy="fixed"
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
          <div
            className="dropdown-container"
            style={{ minWidth: "max-content" }}
          >
            {dropdownActions.map((action, i) => {
              return (
                <div
                  className={classNames("dropdown-item", {
                    disabled: action.disabled,
                  })}
                  key={i}
                  onClick={() => handleActionClick(action)}
                >
                  <WrappedIcon
                    className="dropdown-item-icon"
                    {...action.icon!}
                  />
                  <div className="dropdown-item-text">{action.text}</div>
                </div>
              );
            })}
          </div>
        </WrappedPopover>
      )}
    </div>
  );
}
