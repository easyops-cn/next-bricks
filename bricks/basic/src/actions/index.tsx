import React, { useEffect, useMemo, useRef } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import classnames from "classnames";
import { GeneralIconProps } from "@next-bricks/icons/general-icon";
import { isNil } from "lodash";
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
import type { Menu, MenuProps } from "../menu";
import type { MenuComponentProps, MenuItem } from "../menu-item";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedMenu = wrapBrick<Menu, MenuProps>("eo-menu");
const WrappedMenuItem = wrapBrick<MenuItem, MenuComponentProps>("eo-menu-item");
const WrappedPopover = wrapBrick<
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping
>("eo-popover", {
  onVisibleChange: "visible.change",
  onBeforeVisibleChange: "before.visible.change",
});

interface SubMenuItemComProps {
  index: number;
  action: SubMenuAction;
  checkedKeys: (string | number)[] | undefined;
  activeKeys: (string | number)[] | undefined;
  onSubMenuClick: (action: SimpleAction) => void;
}

function SubMenuItemCom({
  index,
  action,
  checkedKeys,
  activeKeys,
  onSubMenuClick,
}: SubMenuItemComProps) {
  const popoverRef = useRef<Popover>(null);
  const [checked, opened] = useMemo(() => {
    let keyIndex = -1;
    if (activeKeys && action.key != null) {
      for (let i = 0; i < activeKeys.length; i++) {
        if (activeKeys[i] === action.key) {
          keyIndex = i;
          break;
        }
      }
    }
    if (keyIndex === -1) {
      return [false, false];
    }
    if (keyIndex === activeKeys!.length - 1) {
      return [true, false];
    }
    return [true, true];
  }, [action.key, activeKeys]);

  useEffect(() => {
    if (popoverRef.current) {
      popoverRef.current.active = opened;
    }
  }, [opened]);

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
      ref={popoverRef}
    >
      <WrappedMenuItem
        slot="anchor"
        className={classnames("sub-menu-item-label", {
          "menu-item-danger": action.danger,
          "menu-item-active": checked,
        })}
        icon={action.icon}
        disabled={action.disabled}
      >
        {action.text}
      </WrappedMenuItem>
      <div className="sub-menu-wrapper">
        {action?.items.map((innerItem, innerIndex: number, list) => {
          if (isDivider(innerItem)) {
            if (innerIndex === 0 || innerIndex === list.length - 1) {
              return null;
            }
            return <div key={innerIndex} className="menu-item-divider" />;
          }
          const menuItem = (innerItem as SubMenuAction)?.items?.length ? (
            <SubMenuItemCom
              index={innerIndex}
              action={innerItem as SubMenuAction}
              checkedKeys={checkedKeys}
              activeKeys={activeKeys}
              onSubMenuClick={onSubMenuClick}
            />
          ) : (
            <React.Fragment>
              <WrappedMenuItem
                className={classnames({
                  "menu-item-danger": innerItem.danger,
                  "menu-item-selected":
                    !isNil(innerItem.key) &&
                    checkedKeys?.includes(innerItem.key),
                  "menu-item-active":
                    !isNil(innerItem.key) &&
                    activeKeys?.includes(innerItem.key),
                })}
                icon={innerItem.icon}
                disabled={innerItem.disabled}
                onClick={(e: React.MouseEvent) => {
                  if (!innerItem.url && !innerItem.href) {
                    e.preventDefault();
                  }
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
        })}
      </div>
    </WrappedPopover>
  );
}

export interface SimpleAction {
  key?: string | number;
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
  dragConf?: {
    format: string;
    data: unknown;
  };
}

export interface SubMenuAction extends SimpleAction {
  items: Action[];
  placement?: Placement;
}

export interface Divider {
  type: "divider";
  hidden?: boolean;
}
export type Action = SimpleAction | Divider | SubMenuAction;

export interface ActionsProps {
  actions?: Action[];
  itemDraggable?: boolean;
  checkedKeys?: (string | number)[];
  activeKeys?: (string | number)[];
  themeVariant?: "default" | "elevo";
}

export interface ActionsEvents {
  "action.click": CustomEvent<SimpleAction>;
  "item.drag.start": CustomEvent<SimpleAction>;
  "item.drag.end": CustomEvent<SimpleAction>;
}

export interface ActionsEventsMapping {
  onActionClick: "action.click";
  onItemDragEnd: "item.drag.end";
  onItemDragStart: "item.drag.start";
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
   * actions 选中项配置
   */
  @property({
    attribute: false,
  })
  accessor checkedKeys: (string | number)[] = [];

  /**
   * actions 激活项配置，用于菜单项的选择和展开，需按菜单层级顺序依次列出当前激活的菜单项
   */
  @property({
    attribute: false,
  })
  accessor activeKeys: (string | number)[] = [];

  /**
   * action中的菜单项是否可拖拽
   */
  @property({ type: Boolean })
  accessor itemDraggable: boolean | undefined;

  /** 主题变体 */
  @property({ render: false })
  accessor themeVariant: "default" | "elevo" | undefined;

  /**
   * 点击按钮时触发
   * @detail 该按钮配置
   */
  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<SimpleAction>;

  /**
   * 开始拖拽菜单项时触发
   *
   * @detail 该菜单项动作配置
   */
  @event({ type: "item.drag.start" })
  accessor #itemDragStartEvent!: EventEmitter<SimpleAction>;

  /**
   * 完成拖拽菜单项时触发
   *
   * @detail 该菜单项动作配置
   */
  @event({ type: "item.drag.end" })
  accessor #itemDragEndEvent!: EventEmitter<SimpleAction>;

  #handleActionClick = (action: SimpleAction): void => {
    this.#actionClickEvent.emit(action);
    if (action.event) {
      this.dispatchEvent(new CustomEvent(action.event, { detail: action }));
    }
  };

  #handleItemDragEnd = (action: SimpleAction): void => {
    this.#itemDragEndEvent.emit(action);
  };

  #handleItemDragStart = (action: SimpleAction): void => {
    this.#itemDragStartEvent.emit(action);
  };

  render() {
    return (
      <EoActionsComponent
        actions={this.actions}
        itemDraggable={this.itemDraggable}
        onActionClick={this.#handleActionClick}
        onItemDragStart={this.#handleItemDragStart}
        onItemDragEnd={this.#handleItemDragEnd}
        checkedKeys={this.checkedKeys}
        activeKeys={this.activeKeys}
      />
    );
  }
}

export interface ActionsComponentProps extends ActionsProps {
  itemDraggable?: boolean;
  onActionClick?: (action: SimpleAction) => void;
  onItemDragEnd?: (action: SimpleAction) => void;
  onItemDragStart?: (action: SimpleAction) => void;
}

export function EoActionsComponent({
  actions,
  checkedKeys,
  activeKeys,
  onActionClick,
  itemDraggable,
  onItemDragStart,
  onItemDragEnd,
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
              const menuItem = (action as SubMenuAction)?.items?.length ? (
                <SubMenuItemCom
                  index={index}
                  action={action as SubMenuAction}
                  checkedKeys={checkedKeys}
                  activeKeys={activeKeys}
                  onSubMenuClick={(action: SimpleAction) => {
                    onActionClick?.(action);
                  }}
                />
              ) : (
                <WrappedMenuItem
                  className={classnames({
                    "menu-item-danger": action.danger,
                    "menu-item-selected":
                      !isNil(action.key) && checkedKeys?.includes(action.key),
                    "menu-item-active":
                      !isNil(action.key) && activeKeys?.includes(action.key),
                  })}
                  draggable={itemDraggable}
                  icon={action.icon}
                  disabled={action.disabled}
                  onClick={(e: React.MouseEvent) => {
                    if (!action.url && !action.href) {
                      e.preventDefault();
                    }
                    e.stopPropagation();
                    onActionClick?.(action);
                  }}
                  onDragStart={(e: React.DragEvent) => {
                    if (action.dragConf) {
                      e.dataTransfer?.setData(
                        action.dragConf.format,
                        JSON.stringify(action.dragConf.data)
                      );
                      (e.target as HTMLElement).classList.add("dragging");
                    }
                    onItemDragStart?.(action);
                  }}
                  onDragEnd={(e: React.DragEvent) => {
                    (e.target as HTMLElement).classList.remove("dragging");
                    onItemDragEnd?.(action);
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
