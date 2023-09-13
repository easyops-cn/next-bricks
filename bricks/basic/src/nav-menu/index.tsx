import React, { useEffect, useState } from "react";
import { createDecorators } from "@next-core/element";
import { getHistory } from "@next-core/runtime";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import styleText from "./nav-menu.shadow.css";
import { LocationDescriptor, UnregisterCallback } from "history";
import type { SidebarMenu } from "../menu/index.jsx";
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
import type {
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping,
} from "../popover/index.js";
import "@next-core/theme";
import classnames from "classnames";
import { ThreeLevelMenuPopoverContent } from "./ThreeLevelMenuPopoverContent.js";
import { SiteMapItem } from "./site-map/SiteMapItem.js";
import SiteMapStyleText from "../nav-menu/site-map/SiteMapItem.shadow.css";
import ItemTagStyleText from "../nav-menu/site-map/ItemTag.shadow.css";
import GroupItemStyleText from "../nav-menu/site-map/GroupItem.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedMenuItem = wrapBrick<MenuItemComponent, MenuComponentProps>(
  "eo-menu-item"
);
const WrappedPopover = wrapBrick<
  Popover,
  PopoverProps,
  PopoverEvents,
  PopoverEventsMapping
>("eo-popover", {
  onVisibleChange: "visible.change",
  beforeVisibleChange: "before.visible.change",
});

interface NavMenuProps {
  menu?: SidebarMenu;
  showTooltip?: boolean;
}

interface MenuItemComProps {
  item: SidebarMenuItem;
  topData?: boolean;
  selectedKey?: string[];
  showTooltip?: boolean;
}
interface SimpleMenuItemComProps extends MenuItemComProps {
  item: SidebarMenuSimpleItem;
}
interface MenuGroupComProps extends MenuItemComProps {
  item: SidebarMenuGroup;
}
function RenderMenuItemCom(props: MenuItemComProps) {
  const { item } = props;
  return isSubMenu(item as SidebarMenuGroup, props.topData) ? (
    <SubMenuItemCom {...props} item={item as SidebarMenuGroup}></SubMenuItemCom>
  ) : isGroup(item) ? (
    <GroupMenuItemCom {...props} item={item as SidebarMenuGroup} />
  ) : (
    <SimpleMenuItemCom
      {...props}
      item={item as SidebarMenuSimpleItem}
    ></SimpleMenuItemCom>
  );
}
function SimpleMenuItemCom(props: SimpleMenuItemComProps) {
  const { item, showTooltip, selectedKey = [] } = props;
  return (
    <WrappedMenuItem
      key={item.key}
      title={showTooltip ? item.text : ""}
      active={item.key ? selectedKey.includes(item.key) : false}
    >
      {renderLinkCom(item, { width: "100%" })}
    </WrappedMenuItem>
  );
}

// istanbul ignore next
function handlePopupVisibleChange(event: CustomEvent<boolean>) {
  document.body.style.overflow = event.detail ? "hidden" : "";
  document.body.style.touchAction = event.detail ? "none" : "";
}

function SubMenuItemCom({
  item,
  topData,
  showTooltip,
  selectedKey = [],
}: MenuGroupComProps) {
  return item.items?.length > 0 ? (
    <WrappedPopover
      className={classnames("popover", { subprime: !topData })}
      trigger={"hover"}
      placement={topData ? "bottom-start" : "right-start"}
      distance={0}
      anchorDisplay="block"
      onVisibleChange={handlePopupVisibleChange}
    >
      <WrappedMenuItem
        className="sub-menu-item-label"
        key={item.key}
        slot="anchor"
        title={showTooltip ? item.title : ""}
      >
        {renderSpanCom(item, !topData)}
      </WrappedMenuItem>
      <div className="sub-menu-wrapper">
        {item.items.map((innerItem) => (
          <React.Fragment key={innerItem.key}>
            <RenderMenuItemCom
              item={innerItem}
              selectedKey={selectedKey}
              showTooltip={showTooltip}
            />
          </React.Fragment>
        ))}
      </div>
    </WrappedPopover>
  ) : null;
}

function GroupMenuItemCom({
  item,
  showTooltip,
  selectedKey = [],
}: MenuGroupComProps) {
  return item.items?.length > 0 ? (
    <>
      <div className="group-label">{item.title}</div>
      <div className="group-wrapper">
        {item.items.map((innerItem) => {
          return (
            <React.Fragment key={innerItem.key}>
              <RenderMenuItemCom
                item={innerItem}
                showTooltip={showTooltip}
                selectedKey={selectedKey}
              />
            </React.Fragment>
          );
        })}
      </div>
    </>
  ) : null;
}

function ThreeLevelMenuCom({
  item,
  selectedKey = [],
  showTooltip,
}: {
  item: SidebarMenuGroup;
  selectedKey?: string[];
  showTooltip?: boolean;
}) {
  return item.items?.length > 0 ? (
    <WrappedPopover
      className={classnames("three-level-menu-popover", "popover")}
      trigger={"hover"}
      placement={"bottom-start"}
      distance={0}
      key={item.key}
      onVisibleChange={handlePopupVisibleChange}
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
        <ThreeLevelMenuPopoverContent
          menuItem={item}
          selectedKey={selectedKey}
        ></ThreeLevelMenuPopoverContent>
      </div>
    </WrappedPopover>
  ) : null;
}

function SitMapMenCom({
  item,
  selectedKey = [],
  showTooltip,
}: {
  item: SidebarMenuGroup;
  selectedKey?: string[];
  showTooltip?: boolean;
}) {
  return item.items?.length > 0 ? (
    <WrappedPopover
      className={classnames("popover")}
      trigger={"hover"}
      placement={"bottom-start"}
      distance={0}
      key={item.key}
      onVisibleChange={handlePopupVisibleChange}
    >
      <WrappedMenuItem
        className="sub-menu-item-label"
        key={item.key}
        slot="anchor"
        title={showTooltip ? item.title : ""}
      >
        {renderSpanCom(item)}
      </WrappedMenuItem>
      <div
        className="sub-menu-sit-map-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <SiteMapItem menuGroup={item} selectedKey={selectedKey} />
      </div>
    </WrappedPopover>
  ) : null;
}

/**
 * 菜单构件
 * @author sailor
 *
 */
@defineElement("eo-nav-menu", {
  styleTexts: [
    SiteMapStyleText,
    ItemTagStyleText,
    GroupItemStyleText,
    styleText,
  ],
  alias: ["basic.nav-menu"],
})
class NavMenu extends ReactNextElement {
  /**
   * 菜单项
   */
  @property({
    attribute: false,
  })
  accessor menu: SidebarMenu | undefined;

  /**
   * 是否显示 tooltip
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

  return (
    <div className="nav-menu-wrapper">
      {menu?.menuItems.map((item) => {
        return (
          <React.Fragment key={item.key}>
            {isSubMenu(item as SidebarMenuGroup, true) &&
            (item as SidebarMenuGroup).childLayout === "category" &&
            (item as SidebarMenuGroup).items?.length ? (
              <ThreeLevelMenuCom
                item={item as SidebarMenuGroup}
                showTooltip={showTooltip}
                selectedKey={selectedKey}
              />
            ) : (item as SidebarMenuGroup).type === "group" &&
              (item as SidebarMenuGroup).childLayout === "siteMap" ? (
              <SitMapMenCom
                item={item as SidebarMenuGroup}
                showTooltip={showTooltip}
                selectedKey={selectedKey}
              />
            ) : (
              <RenderMenuItemCom
                item={item}
                showTooltip={showTooltip}
                selectedKey={selectedKey}
                topData={true}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export { NavMenu };
