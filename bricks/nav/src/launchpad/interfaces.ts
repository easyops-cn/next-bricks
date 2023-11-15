import { MicroApp } from "@next-core/types";
import { MenuIcon } from "@next-shared/general/types";

export type NormalizedDesktopDir = Pick<DesktopItemDir, "name" | "items"> & {
  size?: string;
};

export interface DesktopData {
  items: DesktopItem[];
  name?: string;
}

/** @internal */
export interface SiteMapItem {
  id: string;
  name: string;
  order: string;
  apps: {
    id?: string;
    sort?: string;
  }[];
}

/** @internal */
export type DesktopItem = DesktopItemApp | DesktopItemDir | DesktopItemCustom;

/** @internal */
export interface DesktopItemApp {
  type: "app";
  id: string;
  app: MicroApp;
}

/** @internal */
export interface DesktopItemDir {
  type: "dir";
  id: string;
  name: string;
  items: (DesktopItemApp | DesktopItemCustom)[];
}

/** @internal */
export interface DesktopItemCustom {
  type: "custom";
  id: string;
  name: string;
  url: string;
  menuIcon?: MenuIcon;
}
