import type { LegacyAntdIcon, MenuIcon } from "@next-shared/general/types";

export interface ConfigMenuGroup extends ConfigMenuBase {
  order?: number;
  items: ConfigMenuItem[];
}

export type ConfigMenuItem = ConfigMenuItemNormal | ConfigMenuItemDir;
export type ConfigMenuItemNormal = ConfigMenuItemApp | ConfigMenuItemCustom;

export interface ConfigMenuItemApp extends ConfigMenuItemBase {
  type: "app";
  url: string;
}

export interface ConfigMenuItemCustom extends ConfigMenuItemBase {
  type: "custom";
  url: string;
}

export interface ConfigMenuItemDir extends ConfigMenuItemBase {
  type: "dir";
  items: ConfigMenuItemNormal[];
}

interface ConfigMenuItemBase extends ConfigMenuBase {
  type: "app" | "custom" | "dir";
  menuIcon?: Exclude<MenuIcon, LegacyAntdIcon>;
  position?: number;
}

interface ConfigMenuBase {
  id: string;
  name: string;
  instanceId: string;
}

export type MenuAction = MenuSimpleAction | MenuActionDivider;

export interface MenuSimpleAction {
  text: string;
  event?: string;
  if?: unknown;
  danger?: boolean;
}

export interface MenuActionDivider {
  if?: unknown;
  type: "divider";
}

export interface MenuActionEventDetail {
  data: ConfigMenuGroup | ConfigMenuItemDir;
  action: MenuSimpleAction;
}
