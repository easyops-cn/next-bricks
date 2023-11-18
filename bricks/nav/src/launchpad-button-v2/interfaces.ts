import type { MicroApp } from "@next-core/types";
import type { MenuIcon } from "@next-shared/general/types";

export interface MenuGroupData {
  name: string;
  instanceId: string;
  items: MenuItemData[];
}

export type MenuItemData = MenuItemDataNormal | MenuItemDataDir;

export type MenuItemDataNormal = MenuItemDataApp | MenuItemDataCustom;

export type SidebarMenuItemData = MenuItemDataNormal | MenuItemDataLink;

export interface MicroAppWithInstanceId extends MicroApp {
  instanceId: string;
}

export interface MenuItemDataApp {
  type: "app";
  name: string;
  id: string;
  instanceId: string;
  url: string;
  menuIcon?: MenuIcon;
}

export interface MenuItemDataCustom {
  type: "custom";
  name: string;
  id: string;
  instanceId: string;
  url: string;
  menuIcon?: MenuIcon;
}

export interface MenuItemDataDir {
  type: "dir";
  name: string;
  id: string;
  items: MenuItemDataNormal[];
}

export interface MenuItemDataLink {
  type: "link";
  favoriteId: string;
  name: string;
  url: string;
  menuIcon?: MenuIcon;
}

export interface StoredMenuItem {
  type: "app" | "custom";
  id: string;
}

export interface FavMenuItem {
  favoriteId?: string;
  type: "app" | "custom" | "link";
  name: string;
  id: string;
  instanceId: string;
  url: string;
  menuIcon?: MenuIcon;
}
