import type { Storyboard } from "@next-core/types";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import {
  LaunchpadApi_createCollectionV2,
  LaunchpadApi_deleteCollectionV2,
  LaunchpadApi_listCollectionV2,
} from "@next-api-sdk/user-service-sdk";
import type {
  FavMenuItem,
  MenuGroupData,
  MenuItemData,
  MenuItemDataApp,
  MenuItemDataCustom,
  MenuItemDataDir,
  MenuItemDataNormal,
  MicroAppWithInstanceId,
} from "./interfaces";
import { FAVORITES_LIMIT } from "./constants";
import { getAppLocaleName } from "../shared/getLocaleName";

export async function fetchLaunchpadInfo() {
  const launchpadInfo = await LaunchpadApi_getLaunchpadInfo(
    {},
    {
      interceptorParams: { ignoreLoadingBar: true },
      noAbortOnRouteChange: true,
    }
  );

  const microAppsById = new Map<string, MicroAppWithInstanceId>();
  for (const storyboard of launchpadInfo.storyboards as Storyboard[]) {
    const app = storyboard.app as unknown as MicroAppWithInstanceId;
    app.localeName = getAppLocaleName(app.locales, app.name);
    microAppsById.set(app.id, app);
  }

  const menuGroups: MenuGroupData[] = [];
  const customLinksById = new Map<string, MenuItemDataCustom>();

  for (const group of launchpadInfo.desktops as unknown as MenuGroupData[]) {
    const items: MenuItemData[] = [];
    for (const item of group.items) {
      switch (item.type) {
        case "app": {
          const app = microAppsById.get(item.id);
          if (app) {
            items.push({
              ...item,
              name: app.localeName,
              url: app.homepage,
              menuIcon: app.menuIcon,
            } as MenuItemDataApp);
          }
          break;
        }
        case "custom":
          items.push(item);
          customLinksById.set(item.id, item);
          break;
        case "dir": {
          const subItems: MenuItemDataNormal[] = [];
          for (const subItem of item.items) {
            if (subItem.type === "app") {
              const app = microAppsById.get(subItem.id);
              if (app) {
                subItems.push({
                  ...subItem,
                  name: app.localeName,
                  url: app.homepage,
                  menuIcon: app.menuIcon,
                } as MenuItemDataApp);
              }
            } else if (subItem.type === "custom") {
              subItems.push(subItem as MenuItemDataCustom);
              customLinksById.set(subItem.id, subItem);
            }
          }
          if (subItems.length > 0) {
            items.push({
              ...item,
              items: subItems,
            } as MenuItemDataDir);
          }
          break;
        }
      }
    }
    if (items.length > 0) {
      menuGroups.push({ ...group, items });
    }
  }

  return { menuGroups, microAppsById, customLinksById };
}

async function fetchRawFavorites() {
  return (
    await LaunchpadApi_listCollectionV2(
      { page: 1, pageSize: FAVORITES_LIMIT },
      {
        interceptorParams: { ignoreLoadingBar: true },
        noAbortOnRouteChange: true,
      }
    )
  ).list;
}

export async function fetchFavorites() {
  const list = await fetchRawFavorites();
  const stored: FavMenuItem[] = [];
  for (const fav of list) {
    if (fav.type === "microApp") {
      const app = fav.relatedApp as Omit<MicroAppWithInstanceId, "id"> & {
        appId: string;
      };
      app.localeName = getAppLocaleName(app.locales, app.name);
      stored.push({
        favoriteId: fav.instanceId,
        type: "app",
        name: app.localeName,
        id: app.appId,
        url: app.homepage,
        instanceId: app.instanceId,
        menuIcon: app.menuIcon,
      } as FavMenuItem);
    } else if (fav.type === "customItem") {
      const customItem = fav.relatedCustomItem!;
      stored.push({
        favoriteId: fav.instanceId,
        type: "custom",
        name: customItem.name,
        id: customItem.id,
        url: customItem.url,
        menuIcon: customItem.menuIcon,
      } as FavMenuItem);
    } else if (fav.type === "link") {
      stored.push({
        favoriteId: fav.instanceId,
        type: "link",
        name: fav.name,
        // id: fav.id,
        url: fav.link,
        menuIcon: fav.icon,
      } as FavMenuItem);
    }
  }
  return stored;
}

export async function favorite(
  item: MenuItemDataNormal
): Promise<{ instanceId?: string }> {
  return LaunchpadApi_createCollectionV2(
    {
      type: item.type === "app" ? "microApp" : "customItem",
      relatedInstanceId: item.instanceId,
    },
    {
      interceptorParams: { ignoreLoadingBar: true },
    }
  );
}

export async function undoFavorite(item: FavMenuItem) {
  if (item.favoriteId) {
    return LaunchpadApi_deleteCollectionV2(item.favoriteId);
  }

  return fetchRawFavorites().then((list) => {
    const foundId = list.find((fav) =>
      item.type === "app"
        ? fav.type === "microApp" && fav.relatedApp?.appId === item.id
        : item.type === "custom" && fav.relatedCustomItem?.id === item.id
    )?.instanceId;

    if (foundId) {
      return LaunchpadApi_deleteCollectionV2(foundId);
    }
    // eslint-disable-next-line no-console
    console.error("Menu item to unstar not found:", item);
  });
}
