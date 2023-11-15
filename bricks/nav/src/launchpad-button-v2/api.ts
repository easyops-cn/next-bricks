import type { MicroApp, Storyboard } from "@next-core/types";
import { i18n } from "@next-core/i18n";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import {
  LaunchpadApi_createCollection,
  LaunchpadApi_deleteCollection,
  LaunchpadApi_listCollection,
} from "@next-api-sdk/user-service-sdk";
import type {
  DesktopItemApp,
  DesktopItemCustom,
} from "../launchpad/interfaces";
import type { FavMenuItem } from "./interfaces";

export async function fetchLaunchpadInfo() {
  const launchpadInfo = await LaunchpadApi_getLaunchpadInfo(
    {},
    {
      interceptorParams: { ignoreLoadingBar: true },
      noAbortOnRouteChange: true,
    }
  );

  for (const storyboard of launchpadInfo.storyboards as Storyboard[]) {
    const app = storyboard.app as unknown as MicroApp;
    if (app.locales) {
      // Prefix to avoid conflict between brick package's i18n namespace.
      const ns = `$tmp-${app.id}`;
      // Support any languages in `app.locales`.
      Object.entries(app.locales).forEach(([lang, resources]) => {
        i18n.addResourceBundle(lang, ns, resources);
      });
      // Use `app.name` as the fallback `app.localeName`.
      app.localeName = i18n.getFixedT(null, ns)("name", app.name) as string;
      // Remove the temporary i18n resource bundles.
      Object.keys(app.locales).forEach((lang) => {
        i18n.removeResourceBundle(lang, ns);
      });
    } else {
      app.localeName = app.name;
    }
  }

  return launchpadInfo;
}

async function fetchRawFavorites() {
  return (
    await LaunchpadApi_listCollection(
      { page: 1, pageSize: 10 },
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
    if (fav.launchpadCollection?.type === "microApp") {
      if (fav.microAppId) {
        stored.push({
          type: "app",
          id: fav.microAppId,
          favoriteId: fav.launchpadCollection?.instanceId,
        });
      }
    }
    // TODO: custom links
  }
  return stored;
}

// istanbul ignore next: will refactor soon
export async function favorite(item: DesktopItemApp | DesktopItemCustom) {
  if (item.type === "app") {
    return LaunchpadApi_createCollection(
      {
        microAppId: item.id,
        launchpadCollection: {
          type: "microApp",
          name: item.app.localeName,
        },
      },
      {
        interceptorParams: { ignoreLoadingBar: true },
      }
    );
  }
  // TODO: custom links
}

// istanbul ignore next: will refactor soon
export async function undoFavorite(item: FavMenuItem) {
  if (item.favoriteId) {
    return LaunchpadApi_deleteCollection(item.favoriteId);
  }

  return fetchRawFavorites().then((list) => {
    const foundId = list.find(
      (fav) =>
        item.type === "app"
          ? fav.launchpadCollection?.type === "microApp" &&
            fav.microAppId === item.id
          : false // TODO: custom links
    )?.launchpadCollection?.instanceId;

    if (foundId) {
      return LaunchpadApi_deleteCollection(foundId);
    }
  });
}
