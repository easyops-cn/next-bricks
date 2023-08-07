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
import { initMenuItemAndMatchCurrentPathKeys } from "@next-shared/general/menu";
import { isGroup, isSubMenu } from "../nav-menu/utils.js";
import { Menu as MenuComponent, SidebarMenu } from "../menu/index.jsx";
import {
  EoMenuItemSubMenu,
  EoMenuSubMenuProps,
} from "../menu-item-sub-menu/index.jsx";
import { EoMenuGroup } from "../menu-group/index.jsx";
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

interface SidebarSubMenuProps {
  menu?: SidebarMenu;
  showTooltip?: boolean;
}

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-sidebar-sub-menu`
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

  const setSelected = useCallback((): void => {
    const { selectedKeys } = initMenuItemAndMatchCurrentPathKeys(
      menu?.menuItems ?? [],
      pathname,
      search,
      ""
    );
    setSelectedKey(selectedKeys);
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
        url={item.to as string}
        href={item.href}
        target={item.target as Target}
        title={item.text}
        icon={item.icon}
        active={item.key ? selectedKey.includes(item.key) : false}
        linkStyle={{ color: "var(--color-secondary-text)" }}
      >
        <span
          className={classNames("menu-item-text", {
            "item-has-icon": item.icon,
          })}
        >
          {item.text}
        </span>
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
          <WrappedIcon {...(menu?.icon as GeneralIconProps)} />
          <span>{menu?.title}</span>
        </div>
      )}

      {menu?.menuItems.map((item) => {
        return (
          <React.Fragment key={item.key}>{renderMenuItem(item)}</React.Fragment>
        );
      })}
    </WrappedMenu>
  );
}
