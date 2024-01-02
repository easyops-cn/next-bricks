import React, { useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import classNames from "classnames";
import { GeneralIconProps } from "@next-bricks/icons/general-icon";
import { Target } from "../interface";
import type { EoTooltip, ToolTipProps } from "../tooltip";
import type { Link, LinkProps } from "../link";
import type { Menu } from "../menu";
import type { MenuComponentProps, MenuItem } from "../menu-item";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

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

export interface ActionsProps {
  actions?: Action[];
}

export interface ActionsEvents {
  "action.click": CustomEvent<SimpleAction>;
}

export interface ActionsEventsMapping {
  onActionClick: "action.click";
}

/**
 * 构件 `eo-actions`
 *
 * @category interact-basic
 */
export
@defineElement("eo-actions", {
  styleTexts: [styleText],
})
class EoActions extends ReactNextElement implements ActionsProps {
  /**
   * 操作列表配置
   */
  @property({
    attribute: false,
  })
  accessor actions: Action[] | undefined;

  /**
   * 点击按钮时触发
   * @detail 该按钮配置
   */
  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<SimpleAction>;

  #handleActionClick = (action: SimpleAction): void => {
    this.#actionClickEvent.emit(action);
    if (action.event) {
      this.dispatchEvent(new CustomEvent(action.event, { detail: action }));
    }
  };

  render() {
    return (
      <EoActionsComponent
        actions={this.actions}
        onActionClick={this.#handleActionClick}
      />
    );
  }
}

export interface ActionsComponentProps extends ActionsProps {
  onActionClick?: (action: SimpleAction) => void;
}

export function EoActionsComponent({
  actions,
  onActionClick,
}: ActionsComponentProps) {
  const filteredActions = useMemo(() => {
    return actions?.filter((action) => !action.hidden);
  }, [actions]);

  return (
    <>
      {filteredActions?.length ? (
        <WrappedMenu>
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
                    onActionClick?.(action);
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
      ) : null}
    </>
  );
}

function isDivider(action: Action): action is Divider {
  return "type" in action && action.type === "divider";
}
