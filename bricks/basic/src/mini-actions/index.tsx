import React, { useMemo, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "../link";
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
const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
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

export interface SimpleActionType extends Omit<SimpleAction, "text"> {
  text?: string;
  isDropdown?: boolean;
}

export type ActionType = SimpleActionType & Divider;

export interface EoMiniActionsProps {
  actions?: ActionType[];
  themeVariant?: "default" | "elevo";
}

export interface EoMiniActionsEvents {
  "action.click": CustomEvent<SimpleActionType>;
  "visible.change": CustomEvent<boolean>;
}

export interface EoMiniActionsEventsMapping {
  onActionClick: "action.click";
  onVisibleChange: "visible.change";
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

  /** 主题变体 */
  @property()
  accessor themeVariant: "default" | "elevo" | undefined;

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

  /**
   * 当下拉菜单可见性变化之后触发
   * @detail 当前是否可见
   */
  @event({ type: "visible.change" })
  accessor #visibleChangeEvent!: EventEmitter<boolean>;

  #handleVisibleChange = (visible: boolean): void => {
    this.#visibleChangeEvent.emit(visible);
  };

  render() {
    return (
      <EoMiniActionsComponent
        actions={this.actions}
        themeVariant={this.themeVariant}
        onActionClick={this.#handleActionClick}
        onVisibleChange={this.#handleVisibleChange}
      />
    );
  }
}

interface EoMiniActionsComponentProps extends EoMiniActionsProps {
  onActionClick: (action: SimpleActionType) => void;
  onVisibleChange: (visible: boolean) => void;
}

const stopPropagationListener = (e: Event) => {
  e.stopPropagation();
};

const preventDefaultAndStopPropagationListener = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

export function EoMiniActionsComponent(props: EoMiniActionsComponentProps) {
  const { actions, themeVariant, onActionClick, onVisibleChange } = props;

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
    onVisibleChange(event.detail);
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
        let contentNode = (
          <WrappedIcon className="button-item-icon" {...action.icon!} />
        );

        if (action.url || action.href) {
          contentNode = (
            <WrappedLink
              type="plain"
              className="button-item-link"
              href={action.href}
              target={action.target}
              url={action.url}
              disabled={action.disabled}
              ref={(el) => {
                el?.addEventListener("click", stopPropagationListener);

                return () => {
                  el?.removeEventListener("click", stopPropagationListener);
                };
              }}
            >
              {contentNode}
            </WrappedLink>
          );
        }

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
                {contentNode}
              </WrappedTooltip>
            ) : (
              contentNode
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
          onBeforeVisibleChange={handlePopoverVisibleChange}
          ref={(el) => {
            el?.addEventListener(
              "click",
              preventDefaultAndStopPropagationListener
            );

            return () => {
              el?.removeEventListener(
                "click",
                preventDefaultAndStopPropagationListener
              );
            };
          }}
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
            themeVariant={themeVariant}
            onActionClick={(e) => {
              handleActionClick(e.detail);
            }}
          />
        </WrappedPopover>
      )}
    </div>
  );
}
