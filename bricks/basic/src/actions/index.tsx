import React, { useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import classnames from "classnames";
import { GeneralIconProps } from "@next-bricks/icons/general-icon";
import type {
  Popover,
  PopoverEvents,
  PopoverEventsMapping,
  PopoverProps,
  Placement,
} from "../popover/index.jsx";
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
const WrappedPopover = wrapBrick<
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping
>("eo-popover", {
  onVisibleChange: "visible.change",
  beforeVisibleChange: "before.visible.change",
});

interface SubMenuItemComProps {
  index: number;
  action: SubeMenuAction;
  checkedKeys: string[] | undefined;
  onSubMenuClick: (action: SimpleAction) => void;
}

function SubMenuItemCom({
  index,
  action,
  checkedKeys,
  onSubMenuClick,
}: SubMenuItemComProps) {
  return (
    <WrappedPopover
      data-index={index}
      className="popover"
      trigger="click"
      arrow={false}
      placement={action.placement || "right-start"}
      distance={4}
      anchorDisplay="block"
      strategy="fixed"
    >
      <WrappedMenuItem
        slot="anchor"
        className={classnames("sub-menu-item-label", {
          "menu-item-danger": action.danger,
        })}
        icon={action.icon}
        disabled={action.disabled}
      >
        {action.text}
      </WrappedMenuItem>
      <div className="sub-menu-wrapper">
        {action?.items.map(
          (innerItem: SubeMenuItemAction, innerIndex: number) => {
            const menuItem = (
              <React.Fragment>
                <WrappedMenuItem
                  className={classnames({
                    "menu-item-danger": innerItem.danger,
                    "menu-item-selected": checkedKeys?.includes(innerItem?.key),
                  })}
                  icon={innerItem.icon}
                  disabled={innerItem.disabled}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onSubMenuClick?.(innerItem);
                  }}
                >
                  {innerItem.text}
                </WrappedMenuItem>
              </React.Fragment>
            );
            return (
              <WrappedTooltip
                key={innerIndex}
                content={innerItem.tooltip}
                hoist
                placement="left"
              >
                {innerItem.url || innerItem.href ? (
                  <WrappedLink
                    type="plain"
                    href={innerItem.href}
                    target={innerItem.target}
                    url={innerItem.url}
                    disabled={innerItem.disabled}
                  >
                    {menuItem}
                  </WrappedLink>
                ) : (
                  menuItem
                )}
              </WrappedTooltip>
            );
          }
        )}
      </div>
    </WrappedPopover>
  );
}

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

export interface SubeMenuItemAction extends SimpleAction {
  key: string;
}

export interface SubeMenuAction extends SimpleAction {
  items: SubeMenuItemAction[];
  placement?: Placement;
}

export interface Divider {
  type: "divider";
  hidden?: boolean;
}
export type Action = SimpleAction | Divider | SubeMenuAction;

export interface ActionsProps {
  actions?: Action[];
  checkedKeys?: string[];
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
   * actions选中项配置
   */
  @property({
    attribute: false,
  })
  accessor checkedKeys: string[] = [];

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
        checkedKeys={this.checkedKeys}
      />
    );
  }
}

export interface ActionsComponentProps extends ActionsProps {
  onActionClick?: (action: SimpleAction) => void;
}

export function EoActionsComponent({
  actions,
  checkedKeys,
  onActionClick,
}: ActionsComponentProps) {
  const filteredActions = useMemo(() => {
    return actions?.filter((action) => !action.hidden);
  }, [actions]);

  return (
    <>
      {filteredActions?.length ? (
        <WrappedMenu>
          {filteredActions.map((action: Action, index) => {
            if (isDivider(action)) {
              if (index === 0 || index === filteredActions.length - 1) {
                return null;
              }
              return <div key={index} className="menu-item-divider" />;
            } else {
              const menuItem = (action as SubeMenuAction)?.items?.length ? (
                <SubMenuItemCom
                  index={index}
                  action={action as SubeMenuAction}
                  checkedKeys={checkedKeys}
                  onSubMenuClick={(action: SimpleAction) => {
                    onActionClick?.(action);
                  }}
                ></SubMenuItemCom>
              ) : (
                <WrappedMenuItem
                  className={classnames({
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
