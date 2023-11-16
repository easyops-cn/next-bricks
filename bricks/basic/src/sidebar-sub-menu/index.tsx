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
import { Menu as MenuComponent, SidebarMenu } from "../menu/index.js";
import { Link, LinkProps } from "../link/index.js";
import {
  EoMenuItemSubMenu,
  EoMenuSubMenuProps,
} from "../menu-item-sub-menu/index.js";
import { EoMenuGroup } from "../menu-group/index.js";
import { MenuComponentProps, MenuItem } from "../menu-item/index.js";
import { Target } from "../interface.js";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";

// --- NOTE: uncomment these lines below to enable i18n for your brick ---
// import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
// import { K, NS, locales } from "./i18n.js";
// initializeReactI18n(NS, locales);
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
  // const { t } = useTranslation(NS);
  // const hello = t(K.HELLO);
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

  const renderSimpleMenuItem = (item: SidebarMenuSimpleItem) => {
    return (
      <WrappedMenuItem
        className="menu-item"
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
          collapsed={!openedKeys.includes(item.key!)}
        >
          <span slot="title">{item.title}</span>
          {item.items.map((innerItem) => (
            <React.Fragment key={innerItem.key}>
              {renderMenuItem(innerItem)}
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

  function renderMenuItem(item: SidebarMenuItem) {
    return isSubMenu(item as SidebarMenuGroup)
      ? renderSubMenuItem(item as SidebarMenuGroup)
      : isGroup(item)
      ? renderGroupMenuItem(item)
      : renderSimpleMenuItem(item);
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
