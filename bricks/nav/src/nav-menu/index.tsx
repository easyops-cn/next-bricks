import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators } from "@next-core/element";
import { getHistory } from "@next-core/runtime";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import styleText from "./nav-menu.shadow.css";
import { UnregisterCallback } from "history";
import type { SidebarMenu } from "@next-bricks/basic/menu";
import type {
  MenuItem as MenuItemComponent,
  MenuComponentProps,
} from "@next-bricks/basic/menu-item";
import { isSubMenu, isGroup, renderLinkCom, renderSpanCom } from "./utils.js";
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
  Placement,
} from "@next-bricks/basic/popover";
import "@next-core/theme";
import classnames from "classnames";
import { ThreeLevelMenuPopoverContent } from "./ThreeLevelMenuPopoverContent.js";
import { SiteMapItem } from "./site-map/SiteMapItem.js";
import SiteMapStyleText from "../nav-menu/site-map/SiteMapItem.shadow.css";
import ItemTagStyleText from "../nav-menu/site-map/ItemTag.shadow.css";
import GroupItemStyleText from "../nav-menu/site-map/GroupItem.shadow.css";
import "./host-context.css";

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
  onBeforeVisibleChange: "before.visible.change",
});

const GAP_WIDTH = 8;

interface NavMenuProps {
  menu?: SidebarMenu;
  showTooltip?: boolean;
  mainMenuTitleStyle: CSSProperties | undefined;
}

interface MenuItemComProps {
  index?: number;
  hidden?: boolean;
  item: SidebarMenuItem;
  topData?: boolean;
  selectedKey?: string[];
  showTooltip?: boolean;
  overflow?: boolean;
  mainMenuTitleStyle?: CSSProperties;
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
  const { item, index, hidden, showTooltip, selectedKey = [] } = props;
  return (
    <WrappedMenuItem
      data-index={index}
      className={hidden ? "overflow-menu-item" : ""}
      key={item.key}
      title={showTooltip ? item.text : ""}
      active={item.key ? selectedKey.includes(item.key) : false}
    >
      {renderLinkCom(item, { width: "100%" }, props.mainMenuTitleStyle)}
    </WrappedMenuItem>
  );
}

let scrollWidth: number;
// istanbul ignore next;
const handlePopupVisibleChange = (event: CustomEvent<boolean>) => {
  // 当用户设置滚动条一直显示时，来回切换 overflow: hidden 会导致滚动条显示或隐藏
  // 造成页面宽度变化而导致的抖动的问题
  const paddingRight =
    scrollWidth ??
    (scrollWidth = window.innerWidth - document.body.clientWidth);

  document.body.style.paddingRight = event.detail ? paddingRight + "px" : "";
  document.body.style.overflow = event.detail ? "hidden" : "";
  document.body.style.touchAction = event.detail ? "none" : "";
};

function SubMenuItemCom({
  index,
  hidden,
  item,
  topData,
  showTooltip,
  selectedKey = [],
  overflow,
  mainMenuTitleStyle,
}: MenuGroupComProps) {
  return item.items?.length > 0 ? (
    <WrappedPopover
      data-index={index}
      className={classnames("popover", {
        subprime: !topData,
        "overflow-menu-item": hidden,
      })}
      arrow={false}
      trigger="hover"
      placement={topData ? "bottom-start" : "right-start"}
      distance={0}
      anchorDisplay="block"
      strategy="fixed"
    >
      <WrappedMenuItem
        className="sub-menu-item-label 22"
        key={item.key}
        slot="anchor"
        title={showTooltip ? item.title : ""}
      >
        {renderSpanCom(item, !topData, { ...mainMenuTitleStyle })}
      </WrappedMenuItem>
      <div
        className={classnames("sub-menu-wrapper", {
          "overflow-menu-wrapper": overflow,
        })}
      >
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
    item.childLayout === "category" ? (
      <ThreeLevelMenuCom
        item={item}
        selectedKey={selectedKey}
        showTooltip={showTooltip}
        placement="right-start"
        anchorDisplay="block"
      />
    ) : (item as SidebarMenuGroup).childLayout === "siteMap" ? (
      <SitMapMenCom
        item={item}
        selectedKey={selectedKey}
        showTooltip={showTooltip}
        placement="right-start"
        anchorDisplay="block"
        topData={false}
      />
    ) : (
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
    )
  ) : null;
}

function ThreeLevelMenuCom({
  index,
  hidden,
  item,
  selectedKey = [],
  showTooltip,
  placement = "bottom-start",
  anchorDisplay,
  mainMenuTitleStyle,
}: {
  index?: number;
  hidden?: boolean;
  item: SidebarMenuGroup;
  selectedKey?: string[];
  showTooltip?: boolean;
  placement?: Placement;
  anchorDisplay?: CSSProperties["display"];
  mainMenuTitleStyle?: CSSProperties;
}) {
  return item.items?.length > 0 ? (
    <WrappedPopover
      data-index={index}
      className={classnames("three-level-menu-popover", "popover", {
        "overflow-menu-item": hidden,
      })}
      arrow={false}
      trigger={"hover"}
      placement={placement}
      distance={0}
      key={item.key}
      strategy="fixed"
      anchorDisplay={anchorDisplay}
      onBeforeVisibleChange={handlePopupVisibleChange}
    >
      <WrappedMenuItem
        className="sub-menu-item-label"
        key={item.key}
        slot="anchor"
        title={showTooltip ? item.title : ""}
      >
        {renderSpanCom(item, false, mainMenuTitleStyle)}
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
  index,
  hidden,
  item,
  selectedKey = [],
  showTooltip,
  placement = "bottom-start",
  anchorDisplay,
  topData,
  mainMenuTitleStyle,
}: {
  index?: number;
  hidden?: boolean;
  item: SidebarMenuGroup;
  selectedKey?: string[];
  showTooltip?: boolean;
  placement?: Placement;
  anchorDisplay?: CSSProperties["display"];
  topData?: boolean;
  mainMenuTitleStyle?: CSSProperties;
}) {
  const [visible, setVisible] = useState<boolean>();

  const handleVisibleChange = (event: CustomEvent<boolean>): void => {
    setVisible(event.detail);
    handlePopupVisibleChange(event);
  };

  return item.items?.length > 0 ? (
    <WrappedPopover
      data-index={index}
      className={classnames("popover", {
        "overflow-menu-item": hidden,
      })}
      trigger={"hover"}
      placement={placement}
      distance={0}
      key={item.key}
      strategy="fixed"
      arrow={false}
      anchorDisplay={anchorDisplay}
      onBeforeVisibleChange={handleVisibleChange}
    >
      <WrappedMenuItem
        className="sub-menu-item-label"
        key={item.key}
        slot="anchor"
        title={showTooltip ? item.title : ""}
      >
        {renderSpanCom(item, false, mainMenuTitleStyle)}
      </WrappedMenuItem>
      <div
        className={classnames("sub-menu-sit-map-wrapper", {
          "in-group-site-map": !topData,
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <SiteMapItem
          menuGroup={item}
          selectedKey={selectedKey}
          visible={visible}
        />
      </div>
    </WrappedPopover>
  ) : null;
}

/**
 * 菜单构件
 * @author sailor
 * @category navigation
 */
@defineElement("eo-nav-menu", {
  styleTexts: [
    SiteMapStyleText,
    ItemTagStyleText,
    GroupItemStyleText,
    styleText,
  ],
})
class NavMenu extends ReactNextElement {
  /**
   * 菜单项
   */
  @property({
    attribute: false,
  })
  accessor menu: SidebarMenu | undefined;

  @property({
    attribute: false,
  })
  accessor mainMenuTitleStyle: CSSProperties | undefined;

  /**
   * 是否显示 tooltip
   */
  @property({
    type: Boolean,
  })
  accessor showTooltip: boolean | undefined;

  render() {
    return (
      <NavMenuComponent
        menu={this.menu}
        showTooltip={this.showTooltip}
        mainMenuTitleStyle={this.mainMenuTitleStyle}
      />
    );
  }
}

function NavMenuComponent(props: NavMenuProps) {
  const { menu, showTooltip } = props;

  const history = getHistory();
  const navMenuWrapperRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState(history.location);
  const [overflowIndex, setOverflowIndex] = useState<number>(
    Number.MAX_SAFE_INTEGER
  );
  const { pathname, search } = location;

  const menuItems = useMemo(() => {
    return (menu?.menuItems ?? []).filter(
      (item) =>
        // 默认
        item.type === "default" ||
        // 没有类型
        !item.type ||
        // 分组类型并且没有子项，过滤
        (["group", "subMenu"].includes(item.type) &&
          (item as SidebarMenuGroup).items?.length)
    );
  }, [menu?.menuItems]);

  const selectedKey = useMemo(() => {
    const { selectedKeys } = initMenuItemAndMatchCurrentPathKeys(
      menuItems ?? [],
      pathname,
      search,
      ""
    );
    return selectedKeys;
  }, [menuItems, pathname, search]);

  useEffect(() => {
    const unListen: UnregisterCallback = history.listen((location) => {
      setLocation(location);
    });
    return unListen;
  }, []);

  useEffect(() => {
    if (navMenuWrapperRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (navMenuWrapperRef.current) {
          const { width } = navMenuWrapperRef.current.getClientRects()[0] ?? {};
          const childNodes = navMenuWrapperRef.current.childNodes;

          if (childNodes.length && width) {
            let wrapperWidth = width;
            let overflowIndex = childNodes.length;

            for (let i = 0; i < childNodes.length; i++) {
              const { width: childWidth, height: childHeight } = (
                childNodes[i] as HTMLElement
              ).getClientRects()[0];

              if (!childHeight && wrapperWidth - 40 < 0) {
                overflowIndex = i - 1;
                break;
              }

              wrapperWidth =
                wrapperWidth - childWidth - (i > 0 ? GAP_WIDTH : 0);
              if (wrapperWidth < 0) {
                overflowIndex = i;
                break;
              }
            }

            setOverflowIndex(overflowIndex < 0 ? 0 : overflowIndex);
          }
        }
      });
      resizeObserver.observe(navMenuWrapperRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  const overflowMenu = useMemo(
    (): SidebarMenuItem => ({
      type: "subMenu",
      title: "···",
      items: menuItems.slice(
        overflowIndex,
        menuItems.length
      ) as SidebarMenuItem[],
    }),
    [menuItems, overflowIndex]
  );

  return (
    <div ref={navMenuWrapperRef} className="nav-menu-wrapper">
      {menuItems.map((item, index) => {
        const isHidden = overflowIndex <= index;
        return (
          <React.Fragment key={item.key}>
            {isSubMenu(item as SidebarMenuGroup, true) &&
            (item as SidebarMenuGroup).childLayout === "category" &&
            (item as SidebarMenuGroup).items?.length ? (
              <ThreeLevelMenuCom
                index={index}
                hidden={isHidden}
                item={item as SidebarMenuGroup}
                showTooltip={showTooltip}
                selectedKey={selectedKey}
                mainMenuTitleStyle={props.mainMenuTitleStyle}
              />
            ) : (item as SidebarMenuGroup).type === "group" &&
              (item as SidebarMenuGroup).childLayout === "siteMap" ? (
              <SitMapMenCom
                index={index}
                hidden={isHidden}
                item={item as SidebarMenuGroup}
                showTooltip={showTooltip}
                selectedKey={selectedKey}
                topData={true}
                mainMenuTitleStyle={props.mainMenuTitleStyle}
              />
            ) : (
              <RenderMenuItemCom
                index={index}
                hidden={isHidden}
                item={item}
                showTooltip={showTooltip}
                selectedKey={selectedKey}
                topData={true}
                mainMenuTitleStyle={props.mainMenuTitleStyle}
              />
            )}
          </React.Fragment>
        );
      })}
      <RenderMenuItemCom
        hidden={overflowIndex > menuItems.length}
        item={overflowMenu}
        showTooltip={showTooltip}
        selectedKey={selectedKey}
        overflow={true}
        topData={true}
        mainMenuTitleStyle={props.mainMenuTitleStyle}
      />
    </div>
  );
}

export { NavMenu };
