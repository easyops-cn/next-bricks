import React from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";
import type { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";

const { defineElement, property, event } = createDecorators();
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

/**
 * 目录
 */
export
@defineElement("eo-directory", {
  styleTexts: [styleText],
})
class EoDirectory extends ReactNextElement implements EoDirectoryProps {
  /**
   * 目录标题
   */
  @property()
  accessor directoryTitle: string | undefined;

  /**
   * 菜单数据
   * @default []
   * @required
   */
  @property({ attribute: false })
  accessor menuItems: MenuItem[] = [];

  /**
   * 默认选中高亮的菜单项
   */
  @property({ attribute: false })
  accessor defaultSelectedKeys: string[] | undefined;
  /**
   * 菜单点击，groupKey 表示对应分组的key，data 表示对应菜单项
   * @detail { groupKey: string, data: MenuChildrenItem   }
   */
  @event({ type: "menu.item.click" })
  accessor #menuItemClickEvent!: EventEmitter<MenuItemClickEventDetail>;
  /**
   * 点击icon，detail为 对应菜单项或者是分组的key
   * @detail { key: string  }
   */
  @event({ type: "suffix.icon.click" })
  accessor #suffixIconClickEvent!: EventEmitter<{ key: string }>;

  #menuItemClick = (data: MenuItemClickEventDetail) => {
    this.#menuItemClickEvent.emit(data);
  };
  #suffixIconClick = (key: string) => {
    this.#suffixIconClickEvent.emit({ key });
  };

  render() {
    return (
      <EoDirectoryComponent
        menuItems={this.menuItems}
        directoryTitle={this.directoryTitle}
        suffixIconClick={this.#suffixIconClick}
        menuItemClick={this.#menuItemClick}
        defaultSelectedKeys={this.defaultSelectedKeys}
      />
    );
  }
}
export interface EoDirectoryProps {
  directoryTitle: string | undefined;
  menuItems: MenuItem[];
  menuItemClick?: (data: MenuItemClickEventDetail) => void;
  suffixIconClick?: (key: string) => void;
  defaultSelectedKeys?: string[] | undefined;
}
interface MenuChildrenItem {
  title: string;
  key: string;
  [key: string]: any;
}
interface MenuItem {
  title: string;
  key: string;
  type: "group" | "item";
  children?: MenuChildrenItem[];
  suffixIcon?: GeneralIconProps;
  suffixIconTooltip?: string;
  suffixIconDisabled?: boolean;
}
interface MenuItemClickEventDetail {
  data: MenuChildrenItem;
  groupKey?: string;
}

export function EoDirectoryComponent(props: EoDirectoryProps) {
  const {
    menuItems,
    directoryTitle,
    menuItemClick,
    suffixIconClick,
    defaultSelectedKeys,
  } = props;

  return (
    <div className="directory-container">
      <div className="directory-title" title={directoryTitle}>
        {directoryTitle}
      </div>
      <div className="directory-menu-list">
        {menuItems.map((item, index) => {
          return (
            <div
              className={classNames("menu-item", `menu-item-${item.type}`)}
              key={`${item.key}-${index}`}
            >
              <div
                className={classNames(`menu-item-title-${item.type}`)}
                onClick={() =>
                  item.type === "item" && menuItemClick?.({ data: item })
                }
              >
                <span
                  className={classNames("menu-title-text", {
                    "menu-title-text-active": defaultSelectedKeys?.includes(
                      item.key
                    ),
                  })}
                >
                  {item.title}
                </span>
                {item.suffixIcon && (
                  <WrappedTooltip
                    content={item.suffixIconTooltip}
                    placement="top"
                  >
                    <WrappedIcon
                      {...(item.suffixIcon as GeneralIconProps)}
                      className={classNames("menu-item-title-suffix-icon", {
                        "menu-item-title-suffix-icon-disabled":
                          item.suffixIconDisabled,
                      })}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.suffixIconDisabled) {
                          e.preventDefault();
                        } else {
                          suffixIconClick?.(item.key);
                        }
                      }}
                    />
                  </WrappedTooltip>
                )}
              </div>
              {item.type === "group" &&
                !!item.children?.length &&
                item.children.map((child, i) => {
                  return (
                    <div
                      className="menu-item-title-item"
                      onClick={() =>
                        menuItemClick?.({ data: child, groupKey: item.key })
                      }
                      key={`${child.key}-${i}`}
                    >
                      <span
                        className={classNames("menu-title-text", {
                          "menu-title-text-active":
                            defaultSelectedKeys?.includes(child.key),
                        })}
                      >
                        {child.title}
                      </span>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
