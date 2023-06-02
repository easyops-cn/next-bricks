import React, { useEffect, useState } from "react";
import { createDecorators } from "@next-core/element";
import { getHistory } from "@next-core/runtime";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import styleText from "./nav-menu.shadow.css";
import { LocationDescriptor, UnregisterCallback } from "history";
import type {
  MenuItem as MenuItemComponent,
  MenuComponentProps,
} from "../menu-item/index.js";
import {
  isSimple,
  isSubMenu,
  isGroup,
  renderLinkCom,
  renderSpanCom,
} from "./utils.js";
import { initMenuItemAndMatchCurrentPathKeys } from "@next-shared/general/menu";
import type {
  SidebarMenuGroup,
  SidebarMenuItem,
  SidebarMenuSimpleItem,
} from "@next-shared/general/types";
import type { Popover, PopoverProps } from "../popover/index.js";
import "@next-core/theme";

const { defineElement, property } = createDecorators();

const WrappedMenuItem = wrapBrick<MenuItemComponent, MenuComponentProps>(
  "basic.general-menu-item"
);
const WrappedPopover = wrapBrick<Popover, PopoverProps>(
  "basic.general-popover"
);

export interface MenuConf {
  defaultCollapsed?: boolean;
  defaultCollapsedBreakpoint?: number;
  icon?: GeneralIconProps;
  link?: LocationDescriptor;
  menuItems: SidebarMenuItem[];
  title: string;
}

interface NavMenuProps {
  menu?: MenuConf;
  showTooltip?: boolean;
}

/**
 * @id basic.nav-menu
 * @name basic.nav-menu
 * @docKind brick
 * @description 菜单构件
 * @author sailor
 *
 */
@defineElement("basic.nav-menu", {
  styleTexts: [styleText],
})
class NavMenu extends ReactNextElement {
  /**
   * @default
   * @required false
   * @description 菜单项
   */
  @property({
    attribute: false,
  })
  accessor menu: MenuConf | undefined;

  /**
   * @default
   * @required false
   * @description 菜单项
   */
  @property({
    type: Boolean,
  })
  accessor showTooltip: boolean | undefined;

  render() {
    return <NavMenuComponent menu={this.menu} showTooltip={this.showTooltip} />;
  }
}

function NavMenuComponent(props: NavMenuProps) {
  const { menu, showTooltip } = props;

  const history = getHistory();
  const [location, setLocation] = useState(history.location);
  const { pathname, search } = location;

  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  const setSelected = async (): Promise<void> => {
    const { selectedKeys } = initMenuItemAndMatchCurrentPathKeys(
      menu?.menuItems ?? [],
      pathname,
      search,
      ""
    );
    setSelectedKey(selectedKeys);
  };

  useEffect(() => {
    const unListen: UnregisterCallback = history.listen((location) => {
      setLocation(location);
    });
    setSelected();
    return unListen;
  }, []);

  const renderSimpleMenuItem = (item: SidebarMenuSimpleItem) => {
    return (
      <WrappedMenuItem
        key={item.key}
        title={showTooltip ? item.text : ""}
        active={item.key ? selectedKey.includes(item.key) : false}
      >
        {renderLinkCom(item)}
      </WrappedMenuItem>
    );
  };

  const renderSubMenuItem = (item: SidebarMenuGroup) => {
    if (item.items?.length > 0) {
      return (
        <WrappedPopover
          className="popover"
          trigger="hover"
          placement="bottom-start"
        >
          <WrappedMenuItem
            className="sub-menu-item-label"
            key={item.key}
            slot="anchor"
            title={showTooltip ? item.title : ""}
          >
            {renderSpanCom(item)}
          </WrappedMenuItem>
          <div className="sub-menu-wrapper">
            {item.items.map((innerItem) => renderMenuItem(innerItem))}
          </div>
        </WrappedPopover>
      );
    }
  };

  const renderGroupMenuItem = (item: SidebarMenuGroup) => {
    if (item.items?.length > 0) {
      return (
        <>
          <div className="group-label">{item.title}</div>
          <div className="group-wrapper">
            {item.items.map((innerItem) => renderMenuItem(innerItem))}
          </div>
        </>
      );
    }
  };

  function renderMenuItem(item: SidebarMenuItem) {
    return isSimple(item)
      ? renderSimpleMenuItem(item)
      : isSubMenu(item)
      ? renderSubMenuItem(item)
      : isGroup(item) && renderGroupMenuItem(item);
  }

  return (
    <div className="nav-menu-wrapper">
      {menu?.menuItems.map((item) => {
        return renderMenuItem(item);
      })}
    </div>
  );
}

export { NavMenu };
