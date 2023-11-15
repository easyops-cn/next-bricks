import React from "react";
import type {
  DesktopItemApp,
  DesktopItemCustom,
} from "../launchpad/interfaces";

export interface LaunchpadContextData {
  searching: boolean;
  pushRecentVisit(item: DesktopItemApp | DesktopItemCustom): void;
  toggleStar(item: DesktopItemApp | DesktopItemCustom): void;
  isStarred(item: DesktopItemApp | DesktopItemCustom): boolean;
}

export const LaunchpadsContext = React.createContext<LaunchpadContextData>(
  {} as LaunchpadContextData
);

export const useLaunchpadContext = (): LaunchpadContextData =>
  React.useContext(LaunchpadsContext);
