import React, { useCallback, useMemo, useState } from "react";
import { pick } from "lodash";
import classNames from "classnames";
import { checkIfByTransform } from "@next-core/runtime";
import type { SimpleAction } from "@next-bricks/basic/dropdown-actions";
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
  onActionClick?: (detail: MenuActionEventDetail) => void;
}

export function MenuGroup({ data, actions, onActionClick }: MenuGroupProps) {
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
      </div>
      <ul className="menu">
        {items.map((item) =>
          item.type === "dir" ? (
            <MenuItemFolder
              key={item.instanceId}
              data={item}
              actions={actions}
              onActionClick={onActionClick}
            />
          ) : (
            <MenuItem
              key={`${item.type}-${item.id}`}
              data={item}
              actions={actions}
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
  onActionClick?: (detail: MenuActionEventDetail) => void;
}

export function MenuItem({ data, actions, onActionClick }: MenuItemProps) {
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

  return (
    <li className="menu-item">
      <WrappedLink>
        <WrappedIcon
          className={`menu-icon`}
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
    </li>
  );
}

export interface MenuItemFolderProps {
  data: ConfigMenuItemDir;
  actions?: MenuAction[];
  onActionClick?: (detail: MenuActionEventDetail) => void;
}

function MenuItemFolder({ data, actions, onActionClick }: MenuItemFolderProps) {
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
      </div>
      <ul className={classNames("sub-menu", { expanded })}>
        {items.map((item) => (
          <MenuItem
            key={item.instanceId}
            data={item}
            actions={actions}
            onActionClick={onActionClick}
          />
        ))}
      </ul>
    </li>
  );
}
