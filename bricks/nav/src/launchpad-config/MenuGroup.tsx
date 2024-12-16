import React, { useCallback, useMemo, useState } from "react";
import { get, pick } from "lodash";
import classNames from "classnames";
import { checkIfByTransform } from "@next-core/runtime";
import type { SimpleAction } from "@next-bricks/basic/actions";
import {
  WrappedDropdownActions,
  WrappedIcon,
  WrappedLink,
} from "./wrapped-bricks";
import type {
  ConfigMenuGroup,
  ConfigMenuItemDir,
  ConfigMenuItemNormal,
  MenuAction,
  MenuActionEventDetail,
} from "./interfaces";
import { getAppLocaleName } from "../shared/getLocaleName";

export interface MenuGroupProps {
  data: ConfigMenuGroup;
  actions?: MenuAction[];
  variant?: "launchpad-config" | "menu-config";
  urlTemplate?: string;
  onActionClick?: (detail: MenuActionEventDetail) => void;
}

export function MenuGroup({
  data,
  actions,
  variant,
  urlTemplate,
  onActionClick,
}: MenuGroupProps) {
  const { name, items } = data;
  const [dropdownActive, setDropdownActive] = useState(false);

  const filteredActions = useMemo(
    () =>
      actions?.filter((item) => checkIfByTransform(item, { type: "group" })),
    [actions]
  );

  const handleActionClick = useCallback(
    (event: CustomEvent<SimpleAction>) => {
      onActionClick?.({
        data,
        action: event.detail,
      });
    },
    [data, onActionClick]
  );

  return (
    <li className={classNames("menu-group", { empty: items.length === 0 })}>
      <div className="menu-group-label-wrapper">
        <span className="menu-group-label">{name}</span>
        {variant !== "menu-config" && (
          <WrappedDropdownActions
            actions={filteredActions}
            onVisibleChange={(event) => {
              setDropdownActive(event.detail);
            }}
            onActionClick={handleActionClick}
          >
            <WrappedIcon
              lib="fa"
              icon="gear"
              className={classNames("menu-config", { active: dropdownActive })}
            />
          </WrappedDropdownActions>
        )}
      </div>
      <ul className="menu">
        {items.map((item) =>
          item.type === "dir" ? (
            <MenuItemFolder
              key={item.instanceId}
              data={item}
              actions={actions}
              variant={variant}
              urlTemplate={urlTemplate}
              onActionClick={onActionClick}
            />
          ) : (
            <MenuItem
              key={`${item.type}-${item.id}`}
              data={item}
              actions={actions}
              variant={variant}
              urlTemplate={urlTemplate}
              onActionClick={onActionClick}
            />
          )
        )}
      </ul>
    </li>
  );
}

export interface MenuItemProps {
  data: ConfigMenuItemNormal;
  actions?: MenuAction[];
  variant?: "launchpad-config" | "menu-config";
  urlTemplate?: string;
  onActionClick?: (detail: MenuActionEventDetail) => void;
}

export function MenuItem({
  data,
  actions,
  variant,
  urlTemplate,
  onActionClick,
}: MenuItemProps) {
  const name = useMemo(
    () =>
      data.type === "app"
        ? getAppLocaleName(data.locales, data.name)
        : data.name,
    [data]
  );

  const [dropdownActive, setDropdownActive] = useState(false);

  const filteredActions = useMemo(
    () => actions?.filter((item) => checkIfByTransform(item, data)),
    [actions, data]
  );

  const handleActionClick = useCallback(
    (event: CustomEvent<SimpleAction>) => {
      onActionClick?.({
        data,
        action: event.detail,
      });
    },
    [data, onActionClick]
  );

  const disabled = variant === "menu-config" && data.type !== "app";

  return (
    <li className={classNames("menu-item", { disabled })}>
      <WrappedLink
        tooltip={disabled ? "该菜单项为链接，不支持配置" : ""}
        url={
          disabled || variant !== "menu-config"
            ? ""
            : parseUrlTemplate(urlTemplate, data, "")
        }
      >
        <WrappedIcon
          className="menu-icon"
          lib="easyops"
          icon="micro-app-center"
          {...(data.menuIcon?.lib && data.menuIcon.icon
            ? (pick(data.menuIcon, [
                "lib",
                "icon",
                "theme",
                "category",
                "prefix",
              ]) as any)
            : null)}
        />
        <span className="menu-item-label">{name}</span>
      </WrappedLink>
      {variant !== "menu-config" && (
        <WrappedDropdownActions
          actions={filteredActions}
          onVisibleChange={(event) => {
            setDropdownActive(event.detail);
          }}
          onActionClick={handleActionClick}
        >
          <WrappedIcon
            lib="fa"
            icon="gear"
            className={classNames("menu-config", { active: dropdownActive })}
          />
        </WrappedDropdownActions>
      )}
    </li>
  );
}

export interface MenuItemFolderProps {
  data: ConfigMenuItemDir;
  actions?: MenuAction[];
  variant?: "launchpad-config" | "menu-config";
  urlTemplate?: string;
  onActionClick?: (detail: MenuActionEventDetail) => void;
}

function MenuItemFolder({
  data,
  actions,
  variant,
  urlTemplate,
  onActionClick,
}: MenuItemFolderProps) {
  const { name, items } = data;
  const [dropdownActive, setDropdownActive] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const filteredActions = useMemo(
    () => actions?.filter((item) => checkIfByTransform(item, { type: "dir" })),
    [actions]
  );

  const toggle = useCallback(() => {
    setExpanded((previous) => !previous);
  }, []);

  const handleActionClick = useCallback(
    (event: CustomEvent<SimpleAction>) => {
      onActionClick?.({
        data,
        action: event.detail,
      });
    },
    [data, onActionClick]
  );

  return (
    <li
      className={classNames("menu-item folder", { empty: items.length === 0 })}
    >
      <div className="menu-folder-label-wrapper">
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
            icon={expanded ? "up" : "down"}
            className="menu-item-toggle"
          />
        </WrappedLink>
        {variant !== "menu-config" && (
          <WrappedDropdownActions
            actions={filteredActions}
            onVisibleChange={(event) => {
              setDropdownActive(event.detail);
            }}
            onActionClick={handleActionClick}
          >
            <WrappedIcon
              lib="fa"
              icon="gear"
              className={classNames("menu-config", { active: dropdownActive })}
            />
          </WrappedDropdownActions>
        )}
      </div>
      <ul className={classNames("sub-menu", { expanded })}>
        {items.map((item) => (
          <MenuItem
            key={item.instanceId}
            data={item}
            actions={actions}
            variant={variant}
            urlTemplate={urlTemplate}
            onActionClick={onActionClick}
          />
        ))}
      </ul>
    </li>
  );
}

function parseUrlTemplate(
  urlTemplate: string | undefined,
  data: unknown,
  fallback?: string
) {
  return (
    urlTemplate?.replace(/{{(.*?)}}/g, (_match, key) =>
      encodeURIComponent(String(get(data, key.trim())))
    ) ?? fallback
  );
}
