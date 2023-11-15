import React, { useCallback, useEffect, useMemo, useState } from "react";
import { pick } from "lodash";
import classNames from "classnames";
import { WrappedIcon, WrappedLink } from "./wrapped-bricks";
import type {
  DesktopItem,
  DesktopItemApp,
  DesktopItemCustom,
} from "../launchpad/interfaces";
import { useLaunchpadContext } from "./LaunchpadContext";

export interface MenuGroupProps {
  name: string;
  items: DesktopItem[];
}

export function MenuGroup({ name, items }: MenuGroupProps) {
  return (
    <li className="menu-group">
      <div className="menu-group-label">{name}</div>
      <ul className="menu">
        {items.map((item) =>
          item.type === "dir" ? (
            <MenuItemFolder key={item.id} name={item.name} items={item.items} />
          ) : (
            <MenuItem key={item.id} item={item} />
          )
        )}
      </ul>
    </li>
  );
}

export interface MenuItemProps {
  item: DesktopItemApp | DesktopItemCustom;
  isSidebar?: boolean;
}

export function MenuItem({ item, isSidebar }: MenuItemProps) {
  const { pushRecentVisit, toggleStar, isStarred } = useLaunchpadContext();
  const starred = useMemo(
    () => !isSidebar && isStarred(item),
    [isSidebar, isStarred, item]
  );

  const handleStarClick = useCallback(() => {
    toggleStar(item);
  }, [item, toggleStar]);

  const handleClick = useCallback(() => {
    pushRecentVisit(item);
  }, [item, pushRecentVisit]);

  const classPrefix = isSidebar ? "sidebar-" : "";

  return (
    <li className={classNames(`${classPrefix}menu-item`, { starred })}>
      {item.type === "app" ? (
        <WrappedLink url={item.app.homepage} onClick={handleClick}>
          <WrappedIcon
            className={`${classPrefix}menu-icon`}
            {...pick(item.app.menuIcon, [
              "lib",
              "icon",
              "theme",
              "category",
              "prefix",
            ])}
          />
          <span className="menu-item-label">{item.app.localeName}</span>
        </WrappedLink>
      ) : (
        <WrappedLink href={item.url} target="_blank" onClick={handleClick}>
          <WrappedIcon
            className={`${classPrefix}menu-icon`}
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
      )}
      {!isSidebar && (
        <WrappedIcon
          lib="fa"
          prefix={starred ? "fas" : "far"}
          icon="star"
          className={classNames("menu-item-star", { starred })}
          onClick={handleStarClick}
        />
      )}
    </li>
  );
}

export interface MenuItemFolderProps {
  name: string;
  items: (DesktopItemApp | DesktopItemCustom)[];
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
          <MenuItem key={item.id} item={item} />
        ))}
      </ul>
    </li>
  );
}
