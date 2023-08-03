import React from "react";
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

const { defineElement, property, event } = createDecorators();

const WrappedPopover = wrapBrick<Popover, PopoverProps>("eo-popover");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedMenu = wrapBrick<Menu, unknown>("eo-menu");
const WrappedMenuItem = wrapBrick<MenuItem, MenuComponentProps>("eo-menu-item");

export interface Action {
  text: string;
  event?: string;
  icon?: GeneralIconProps;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: string;
  url?: string;
  href?: string;
  target?: Target;
}

export interface DropdownActionsProps {
  actions?: Action[];
  disabled?: boolean;
}

export interface DropdownActionsEvents {
  "action.click": CustomEvent<Action>;
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
  accessor #actionClickEvent!: EventEmitter<Action>;

  #handleClick = (action: Action): void => {
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

interface DropdownActionsComponentProps extends DropdownActionsProps {
  handleActionClick?: (action: Action) => void;
}

export function EoDropdownActionsComponent(
  props: DropdownActionsComponentProps
) {
  const { actions, disabled, handleActionClick } = props;

  return (
    <WrappedPopover
      placement="bottom"
      sync="width"
      trigger="click"
      disabled={disabled}
    >
      <slot slot="anchor" />
      {actions && (
        <WrappedMenu style={{ minWidth: "max-content" }}>
          {actions
            ?.filter((action) => !action.hidden)
            .map((action, index) => {
              const menuItem = (
                <WrappedMenuItem
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
            })}
        </WrappedMenu>
      )}
    </WrappedPopover>
  );
}
