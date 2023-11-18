import React, { useCallback, useEffect, useMemo, useState } from "react";
import { pick } from "lodash";
import classNames from "classnames";
import { WrappedIcon, WrappedLink } from "./wrapped-bricks";
import { useLaunchpadContext } from "./LaunchpadContext";
import type {
  MenuItemData,
  MenuItemDataNormal,
  SidebarMenuItemData,
} from "./interfaces";

export interface MenuGroupProps {
  name: string;
  items: MenuItemData[];
}

export function MenuGroup({ name, items }: MenuGroupProps) {
  return (
    <li className="menu-group">
      <div className="menu-group-label">{name}</div>
      <ul className="menu">
        {items.map((item) =>
          item.type === "dir" ? (
            <MenuItemFolder
              key={`${item.type}-${item.id}`}
              name={item.name}
              items={item.items}
            />
          ) : (
            <MenuItem key={`${item.type}-${item.id}`} item={item} />
          )
        )}
      </ul>
    </li>
  );
}

export interface MenuItemProps {
  item: MenuItemDataNormal;
}

function MenuItem({ item }: MenuItemProps) {
  const { loadingFavorites, pushRecentVisit, toggleStar, isStarred } =
    useLaunchpadContext();

  const starred = useMemo(() => isStarred(item), [isStarred, item]);

  const handleStarClick = useCallback(() => {
    toggleStar(item);
  }, [item, toggleStar]);

  const handleClick = useCallback(() => {
    pushRecentVisit(item);
  }, [item, pushRecentVisit]);

  return (
    <li
      className={classNames("menu-item", {
        starred,
        "can-star": !loadingFavorites,
      })}
    >
      <WrappedLink
        onClick={handleClick}
        {...(item.type === "app"
          ? {
              url: item.url,
            }
          : {
              href: item.url,
              target: "_blank",
            })}
      >
        <WrappedIcon
          className="menu-icon"
          lib="easyops"
          icon="micro-app-center"
          {...(pick(item.menuIcon, [
            "lib",
            "icon",
            "theme",
            "category",
            "prefix",
          ]) as any)}
        />
        <span className="menu-item-label">{item.name}</span>
      </WrappedLink>
      <WrappedIcon
        lib="fa"
        prefix={starred ? "fas" : "far"}
        icon="star"
        className="menu-item-star"
        title={starred ? "取消收藏" : "收藏"}
        onClick={handleStarClick}
      />
    </li>
  );
}

export interface SidebarMenuItemProps {
  item: SidebarMenuItemData;
}

export function SidebarMenuItem({ item }: SidebarMenuItemProps) {
  const { pushRecentVisit, toggleStar } = useLaunchpadContext();

  const handleClick = useCallback(() => {
    if (item.type !== "link") {
      pushRecentVisit(item);
    }
  }, [item, pushRecentVisit]);

  const handleRemoveStar = useCallback(() => {
    toggleStar(item);
  }, [item, toggleStar]);

  return (
    <li className="sidebar-menu-item">
      <WrappedLink
        onClick={handleClick}
        {...(item.type === "app"
          ? {
              url: item.url,
            }
          : {
              href: item.url,
              target: "_blank",
            })}
      >
        <WrappedIcon
          className={`sidebar-menu-icon`}
          lib="easyops"
          icon="micro-app-center"
          {...(pick(item.menuIcon, [
            "lib",
            "icon",
            "theme",
            "category",
            "prefix",
          ]) as any)}
        />
        <span className="menu-item-label">{item.name}</span>
      </WrappedLink>
      <WrappedIcon
        lib="fa"
        icon="xmark"
        className="menu-item-remove"
        onClick={handleRemoveStar}
      />
    </li>
  );
}

export interface MenuItemFolderProps {
  name: string;
  items: MenuItemDataNormal[];
}

function MenuItemFolder({ name, items }: MenuItemFolderProps) {
  const { searching } = useLaunchpadContext();
  const [expanded, setExpanded] = useState(false);
  const [searchingExpanded, setSearchingExpanded] = useState(false);

  const toggle = useCallback(() => {
    // Use separated expanded states for searching and non-searching.
    if (searching) {
      setSearchingExpanded((previous) => !previous);
    } else {
      setExpanded((previous) => !previous);
    }
  }, [searching]);

  useEffect(() => {
    // Each time when start searching, set it as expanded.
    setSearchingExpanded(true);
  }, [searching]);

  const actualExpanded = searching ? searchingExpanded : expanded;

  return (
    <li className="menu-item folder">
      <WrappedLink onClick={toggle}>
        <WrappedIcon
          lib="fa"
          prefix="far"
          icon="folder-open"
          className="menu-icon"
        />
        <span className="menu-item-label">{name}</span>
        <WrappedIcon
          lib="antd"
          icon={actualExpanded ? "up" : "down"}
          className="menu-item-toggle"
        />
      </WrappedLink>
      <ul className={classNames("sub-menu", { expanded: actualExpanded })}>
        {items.map((item) => (
          <MenuItem key={`${item.type}-${item.id}`} item={item} />
        ))}
      </ul>
    </li>
  );
}
