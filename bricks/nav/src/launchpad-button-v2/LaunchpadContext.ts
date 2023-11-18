import React from "react";
import type { MenuItemDataLink, MenuItemDataNormal } from "./interfaces";

export interface LaunchpadContextData {
  searching: boolean;
  loadingFavorites: boolean;
  pushRecentVisit(item: MenuItemDataNormal): void;
  toggleStar(item: MenuItemDataNormal | MenuItemDataLink): void;
  isStarred(item: MenuItemDataNormal): boolean;
}

export const LaunchpadsContext = React.createContext<LaunchpadContextData>(
  {} as LaunchpadContextData
);

export const useLaunchpadContext = (): LaunchpadContextData =>
  React.useContext(LaunchpadsContext);
