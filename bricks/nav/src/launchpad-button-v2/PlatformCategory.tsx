import React from "react";
import { WrappedLink, WrappedIcon } from "./wrapped-bricks";
import { MenuItemDataNormal, PlatformCategoryItem } from "./interfaces";
import { pick } from "lodash";
import classNames from "classnames";

export interface PlatformCategorySidebarMenuItemProps {
  item: PlatformCategoryItem;
  active?: boolean;
  onClick?: (item: PlatformCategoryItem) => void;
}

export function PlatformCategorySidebarMenuItem({
  item,
  active,
  onClick,
}: PlatformCategorySidebarMenuItemProps) {
  return (
    <li className="platform-category-sidebar-menu-item">
      <WrappedLink
        type="plain"
        className={classNames({ active })}
        onClick={() => onClick?.(item)}
      >
        <WrappedIcon
          className={"platform-category-sidebar-menu-icon"}
          lib="easyops"
          category="second-menu"
          icon="serve-second-menu"
          {...(item.icon?.lib && item.icon.icon
            ? (pick(item.icon, [
                "lib",
                "icon",
                "theme",
                "category",
                "prefix",
              ]) as any)
            : null)}
        />
        <span className="platform-category-sidebar-menu-item-label">
          {item.name}
        </span>
      </WrappedLink>
    </li>
  );
}

export interface PlatformItemProps {
  item: MenuItemDataNormal;
}

export function PlatformItem({ item }: PlatformItemProps) {
  return (
    <li>
      <WrappedLink
        type="plain"
        {...(item.type === "app"
          ? {
              url: item.url,
            }
          : {
              href: item.url,
              target: "_blank",
            })}
      >
        <div className="platform-item">
          <div className="platform-item-title">
            <WrappedIcon
              className="platform-item-icon"
              lib="easyops"
              category="third-menu"
              icon="deploy-orchestration-tasks-third-menu"
              {...(item.menuIcon?.lib && item.menuIcon.icon
                ? (pick(item.menuIcon, [
                    "lib",
                    "icon",
                    "theme",
                    "category",
                    "prefix",
                  ]) as any)
                : null)}
            />
            <div className="platform-item-name">{item.name}</div>
          </div>
          <div className="platform-item-description">{item.description}</div>
        </div>
      </WrappedLink>
    </li>
  );
}
