import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { useLaunchpadInfo } from "../launchpad-button-v2/useLaunchpadInfo";
import { LaunchpadsContext } from "../launchpad-button-v2/LaunchpadContext";
import { SidebarMenuItem } from "../launchpad-button-v2/MenuGroup";
import { SidebarMenuItemData } from "../launchpad-button-v2/interfaces";

const { defineElement } = createDecorators();

/**
 * 快捷访问
 * @insider
 */
export
@defineElement("eo-launchpad-quick-access", {
  styleTexts: [styleText],
})
class EoLaunchpadQuickAccess extends ReactNextElement {
  render() {
    return <EoLaunchpadQuickAccessComponent />;
  }
}

export function EoLaunchpadQuickAccessComponent() {
  const {
    favorites,
    loadingFavorites,
    pushRecentVisit,
    toggleStar,
    isStarred,
  } = useLaunchpadInfo(true);

  return (
    <LaunchpadsContext.Provider
      value={{
        searching: false,
        loadingFavorites,
        pushRecentVisit,
        toggleStar,
        isStarred,
      }}
    >
      <ul className="quick-access-list">
        {favorites.map((item, index) => (
          <SidebarMenuItem key={index} item={item as SidebarMenuItemData} />
        ))}
      </ul>
    </LaunchpadsContext.Provider>
  );
}
