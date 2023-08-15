import React, { useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import type { MenuComponentProps, MenuItem } from "../menu-item/index.jsx";
import type { Menu } from "../menu/index.jsx";
import type { Popover, PopoverProps } from "../popover/index.jsx";
import type { EoTooltip, ToolTipProps } from "../tooltip/index.jsx";
import type { Link, LinkProps } from "../link/index.jsx";
import type { Target } from "../interface.js";
import classNames from "classnames";

const { defineElement, property, event } = createDecorators();

const WrappedPopover = wrapBrick<Popover, PopoverProps>("eo-popover");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedMenu = wrapBrick<Menu, unknown>("eo-menu");
const WrappedMenuItem = wrapBrick<MenuItem, MenuComponentProps>("eo-menu-item");

export interface SimpleAction {
  text: string;
  event?: string;
  icon?: GeneralIconProps;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: string;
  url?: string;
  href?: string;
  target?: Target;
  danger?: boolean;
}

export interface Divider {
  type: "divider";
  hidden?: boolean;
}

export type Action = SimpleAction | Divider;

export interface DropdownActionsProps {
  actions?: Action[];
  disabled?: boolean;
}

export interface DropdownActionsEvents {
  "action.click": CustomEvent<SimpleAction>;
}

export interface DropdownActionsEventsMapping {
  onActionClick: "action.click";
}

/**
 * 下拉菜单
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
   * 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 点击按钮时触发
   * @detail 该按钮配置
   */
  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<SimpleAction>;

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
        handleActionClick={this.#handleClick}
      />
    );
  }
}

const isDivider = (action: Action): action is Divider => {
  return "type" in action && action.type === "divider";
};

interface DropdownActionsComponentProps extends DropdownActionsProps {
  handleActionClick?: (action: SimpleAction) => void;
}

export function EoDropdownActionsComponent(
  props: DropdownActionsComponentProps
) {
  const { actions, disabled, handleActionClick } = props;

  const filteredActions = useMemo(() => {
    return actions?.filter((action) => !action.hidden);
  }, [actions]);

  return (
    <WrappedPopover placement="bottom" trigger="click" disabled={disabled}>
      <slot slot="anchor" />
      {filteredActions?.length && (
        <WrappedMenu style={{ minWidth: "max-content" }}>
          {filteredActions.map((action, index) => {
            if (isDivider(action)) {
              if (index === 0 || index === filteredActions.length - 1) {
                return null;
              }
              return <div key={index} className="menu-item-divider" />;
            } else {
              const menuItem = (
                <WrappedMenuItem
                  className={classNames({
                    "menu-item-danger": action.danger,
                  })}
                  icon={action.icon}
                  disabled={action.disabled}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleActionClick?.(action);
                  }}
                >
                  {action.text}
                </WrappedMenuItem>
              );

              return (
                <WrappedTooltip
                  key={index}
                  content={action.tooltip}
                  hoist
                  placement="left"
                >
                  {action.url || action.href ? (
                    <WrappedLink
                      type="plain"
                      href={action.href}
                      target={action.target}
                      url={action.url}
                      disabled={action.disabled}
                    >
                      {menuItem}
                    </WrappedLink>
                  ) : (
                    menuItem
                  )}
                </WrappedTooltip>
              );
            }
          })}
        </WrappedMenu>
      )}
    </WrappedPopover>
  );
}
