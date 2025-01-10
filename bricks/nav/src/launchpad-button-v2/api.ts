import type { Storyboard } from "@next-core/types";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import {
  LaunchpadApi_createCollectionV2,
  LaunchpadApi_deleteCollectionV2,
  LaunchpadApi_listCollectionV2,
} from "@next-api-sdk/user-service-sdk";
import { InstanceApi_postSearchV3 } from "@next-api-sdk/cmdb-sdk";
import { sortBy } from "lodash";
import { auth } from "@next-core/easyops-runtime";
import type {
  FavMenuItem,
  MenuGroupData,
  MenuItemData,
  MenuItemDataApp,
  MenuItemDataCustom,
  MenuItemDataDir,
  MenuItemDataNormal,
  MicroAppWithInstanceId,
  PlatformCategoryItem,
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
    if (!auth.isBlockedPath?.(app.homepage)) {
      microAppsById.set(app.id, app);
    }
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
          if (!auth.isBlockedHref?.(item.url)) {
            items.push(item);
            customLinksById.set(item.id, item);
          }
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
            } else if (
              subItem.type === "custom" &&
              !auth.isBlockedHref?.(subItem.url)
            ) {
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
  // 不屏蔽收藏夹中的任何项，否则无法取消收藏
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

export async function fetchPlatformCategories(): Promise<
  PlatformCategoryItem[]
> {
  const categories = (
    await InstanceApi_postSearchV3("MICRO_APP_CATEGORY@EASYOPS", {
      fields: [
        "id",
        "type",
        "name",
        "icon",
        "order",
        "platformApps.appId",
        "platformApps.name",
        "platformApps.homepage",
        "platformApps.description",
        "platformApps.menuIcon",
        "platformApps.locales",
        "platformApps._object_id",
        "platformApps.@.order",
        "platformItems.id",
        "platformItems.name",
        "platformItems.url",
        "platformItems.description",
        "platformItems.menuIcon",
        "platformItems._object_id",
        "platformItems.@.order",
      ],
      page: 1,
      page_size: 300,
      query: {
        type: "platform",
      },
    })
  ).list;

  const _categories = categories?.map((category) => {
    const apps = category.platformApps
      .map((app: Record<string, any>) => {
        if (auth.isBlockedPath?.(app.homepage)) {
          return null;
        }
        return {
          type: "app",
          name: getAppLocaleName(app.locales, app.name),
          id: app.appId,
          url: app.homepage,
          menuIcon: app.menuIcon,
          description: app.description,
          instanceId: app.instanceId,
          order: app["@"]?.order,
        };
      })
      .filter(Boolean) as MenuItemDataApp[];
    const customItems = category.platformItems
      .map((item: Record<string, any>) => {
        if (auth.isBlockedHref?.(item.url)) {
          return null;
        }
        return {
          type: "custom",
          name: item.name,
          id: item.id,
          url: item.url,
          menuIcon: item.menuIcon,
          description: item.description,
          instanceId: item.instanceId,
          order: item["@"]?.order,
        };
      })
      .filter(Boolean) as MenuItemDataCustom[];

    const items = sortBy([...apps, ...customItems], "order");
    return {
      instanceId: category.instanceId,
      id: category.id,
      name: category.name,
      icon: category.icon,
      order: category.order,
      items,
    } as PlatformCategoryItem;
  });

  return [
    {
      id: "#all",
      name: "全部",
      icon: {
        lib: "easyops",
        category: "second-menu",
        icon: "sprint-planning-second-menu",
      },
      items: [],
    },
    ...sortBy(_categories, "order"),
  ];
}
