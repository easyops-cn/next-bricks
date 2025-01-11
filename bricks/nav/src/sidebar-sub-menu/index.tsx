import React, { useState, useEffect, useCallback } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { getHistory } from "@next-core/runtime";
import { UnregisterCallback } from "history";
import "@next-core/theme";
import {
  SidebarMenuSimpleItem,
  SidebarMenuGroup,
  SidebarMenuItem,
} from "@next-shared/general/types";
import {
  initMenuItemAndMatchCurrentPathKeys,
  isGroup,
  isSubMenu,
} from "@next-shared/general/menu";
import { Menu as MenuComponent, SidebarMenu } from "@next-bricks/basic/menu";
import { Link, LinkProps, Target } from "@next-bricks/basic/link";
import {
  EoMenuItemSubMenu,
  EoMenuSubMenuProps,
} from "@next-bricks/basic/menu-item-sub-menu";
import { EoMenuGroup } from "@next-bricks/basic/menu-group";
import { MenuComponentProps, MenuItem } from "@next-bricks/basic/menu-item";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const WrappedMenu = wrapBrick<MenuComponent, any>("eo-menu");

const WrappedMenuGroup = wrapBrick<EoMenuGroup, any>("eo-menu-group");

const WrapperMenuItemSubMenu = wrapBrick<EoMenuItemSubMenu, EoMenuSubMenuProps>(
  "eo-menu-item-sub-menu"
);

const WrappedMenuItem = wrapBrick<MenuItem, MenuComponentProps>("eo-menu-item");

const WrappedLinkItem = wrapBrick<Link, LinkProps>("eo-link");

interface SidebarSubMenuProps {
  menu?: SidebarMenu;
  showTooltip?: boolean;
}

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-sidebar-sub-menu`
 * @category navigation
 */
export
@defineElement("eo-sidebar-sub-menu", {
  styleTexts: [styleText],
})
class EoSidebarSubMenu extends ReactNextElement {
  /**
   * 菜单项
   */
  @property({
    attribute: false,
  })
  accessor menu: SidebarMenu | undefined;

  render() {
    return <EoSidebarSubMenuComponent menu={this.menu} />;
  }
}

export function EoSidebarSubMenuComponent(props: SidebarSubMenuProps) {
  const { menu } = props;

  const history = getHistory();
  const [location, setLocation] = useState(history.location);
  const { pathname, search } = location;

  const [selectedKey, setSelectedKey] = useState<string[]>([]);
  const [openedKeys, setOpenedKeys] = useState<string[]>([]);

  const setSelected = useCallback((): void => {
    const { selectedKeys, openedKeys } = initMenuItemAndMatchCurrentPathKeys(
      menu?.menuItems ?? [],
      pathname,
      search,
      ""
    );
    setSelectedKey(selectedKeys);
    setOpenedKeys(openedKeys);
  }, [menu?.menuItems, pathname, search]);

  useEffect(() => {
    const unListen: UnregisterCallback = history.listen((location) => {
      setLocation(location);
    });
    setSelected();
    return unListen;
  }, [history, setSelected]);

  const getMenuItemIndent = useCallback((item: SidebarMenuItem): number => {
    return ((item.key?.split(".")?.length as number) - 1) * 16;
  }, []);

  const renderSimpleMenuItem = (
    item: SidebarMenuSimpleItem,
    options?: {
      inSubmenu?: boolean;
    }
  ) => {
    return (
      <WrappedMenuItem
        className={classNames("menu-item", {
          "in-submenu": options?.inSubmenu,
        })}
        style={{ paddingLeft: getMenuItemIndent(item) || 16 }}
        icon={item.icon}
        active={item.key ? selectedKey.includes(item.key) : false}
      >
        <WrappedLinkItem
          className="menu-item-link"
          type="plain"
          url={item.to as string}
          href={item.href}
          title={item.text}
          target={item.target as Target}
        >
          <span
            className={classNames("menu-item-text", {
              "item-has-icon": item.icon,
            })}
          >
            {item.text}
          </span>
        </WrappedLinkItem>
      </WrappedMenuItem>
    );
  };

  const renderSubMenuItem = (item: SidebarMenuGroup) => {
    // istanbul ignore else
    if (item.items?.length > 0) {
      return (
        <WrapperMenuItemSubMenu
          className="menu-sub-item"
          icon={item.icon}
          titleStyle={{ paddingLeft: getMenuItemIndent(item) }}
          bodyStyle={{ paddingLeft: getMenuItemIndent(item) / 2 }}
          collapsed={!openedKeys.includes(item.key!)}
        >
          <span slot="title">{item.title}</span>
          {item.items.map((innerItem) => (
            <React.Fragment key={innerItem.key}>
              {renderMenuItem(innerItem, {
                inSubmenu: true,
              })}
            </React.Fragment>
          ))}
        </WrapperMenuItemSubMenu>
      );
    }
  };

  const renderGroupMenuItem = (item: SidebarMenuGroup) => {
    // istanbul ignore else
    if (item.items?.length > 0) {
      return (
        <WrappedMenuGroup>
          <span slot="title">{item.title}</span>

          {item.items.map((innerItem) => {
            return (
              <React.Fragment key={innerItem.key}>
                {renderMenuItem(innerItem)}
              </React.Fragment>
            );
          })}
        </WrappedMenuGroup>
      );
    }
  };

  function renderMenuItem(
    item: SidebarMenuItem,
    options?:
      | {
          inSubmenu?: boolean;
        }
      | undefined
  ) {
    return isSubMenu(item as SidebarMenuGroup)
      ? renderSubMenuItem(item as SidebarMenuGroup)
      : isGroup(item)
        ? renderGroupMenuItem(item)
        : renderSimpleMenuItem(item, options);
  }

  return (
    <WrappedMenu className="menu-container" mode="vertical">
      {menu?.title && (
        <div className="header">
          {menu?.icon && <WrappedIcon {...(menu?.icon as GeneralIconProps)} />}
          <span className="title">{menu?.title}</span>
        </div>
      )}
      <div className="content">
        {menu?.menuItems.map((item) => {
          return (
            <React.Fragment key={item.key}>
              {renderMenuItem(item)}
            </React.Fragment>
          );
        })}
      </div>
    </WrappedMenu>
  );
}
