import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getRuntime,
  handleHttpError,
  httpErrorToString,
} from "@next-core/runtime";
import { auth } from "@next-core/easyops-runtime";
import { JsonStorage } from "@next-shared/general/JsonStorage";
import { DeferredService } from "../shared/DeferredService";
import { showDialog, showNotification } from "./wrapped-bricks";
import type {
  FavMenuItem,
  MenuGroupData,
  MenuItemDataCustom,
  MenuItemDataLink,
  MenuItemDataNormal,
  MicroAppWithInstanceId,
  PlatformCategoryItem,
  StoredMenuItem,
} from "./interfaces";
import {
  favorite,
  fetchFavorites,
  fetchLaunchpadInfo,
  fetchPlatformCategories,
  undoFavorite,
} from "./api";
import { search, searchCategories } from "./search";
import { FAVORITES_LIMIT, RECENT_VISITS_LIMIT } from "./constants";

const storageKey = `launchpad-recent-visits:${(
  auth.getAuth() as Record<string, string>
)?.org}`;
const storage = new JsonStorage(localStorage);

let candidateDesktops: MenuGroupData[] = [];
let candidateMicroAppsById = new Map<string, MicroAppWithInstanceId>();
let candidateCustomLinksById = new Map<string, MenuItemDataCustom>();
let preLoaded = false;

let candidateFavorites: FavMenuItem[] = [];
let preLoadedFavorites = false;

let candidatePlatformCategories: PlatformCategoryItem[] = [];
let preLoadedPlatformCategories = false;

export const deferredLaunchpadInfo = new DeferredService(async () => {
  ({
    menuGroups: candidateDesktops,
    microAppsById: candidateMicroAppsById,
    customLinksById: candidateCustomLinksById,
  } = await fetchLaunchpadInfo());
  preLoaded = true;
});

export const deferredFavorites = new DeferredService(async () => {
  candidateFavorites = await fetchFavorites();
  preLoadedFavorites = true;
});

export const deferredPlatformCategories = new DeferredService(async () => {
  candidatePlatformCategories = await fetchPlatformCategories();
  preLoadedPlatformCategories = true;
});

const showErrorAsNotification = (error: unknown) =>
  showNotification({
    type: "error",
    message: httpErrorToString(error),
  });

/**
 * - 页面初始化时预加载 launchpad 信息。
 * - 每次打开 launchpad 都发起请求，但该请求的数据只在下次打开 launchpad 时使用。
 *   即每次打开 launchpad 使用的都是上一次获取的数据，以便达到两个效果：
 *     - 每次打开 launchpad 都能立即显示菜单列表；
 *     - 同时当用户在 launchpad 上操作时，不会出现数据突然更新（新数据请求完成）。
 */
export function useLaunchpadInfo(active?: boolean) {
  const [desktops, setDesktops] = useState(candidateDesktops);
  const [microAppsById, setMicroAppsById] = useState(candidateMicroAppsById);
  const [customLinksById, setCustomLinksById] = useState(
    candidateCustomLinksById
  );

  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(!preLoaded);
  const [loadingFavorites, setLoadingFavorites] = useState(!preLoadedFavorites);
  const [loadingPlatformCategories, setLoadingPlatformCategories] = useState(
    !preLoadedPlatformCategories
  );

  const [storedRecentVisits, setStoredRecentVisits] = useState<
    StoredMenuItem[]
  >([]);

  const [recentVisits, setRecentVisits] = useState<MenuItemDataNormal[]>([]);

  const [favorites, setFavorites] = useState<FavMenuItem[]>(candidateFavorites);
  const [platformCategories, setPlatformCategories] = useState<
    PlatformCategoryItem[]
  >(candidatePlatformCategories);

  useEffect(() => {
    // 仅当首次加载完成或重新打开 launchpad 时更新一次数据。
    if (active && !loading) {
      setDesktops(candidateDesktops);
      setMicroAppsById(candidateMicroAppsById);
      setCustomLinksById(candidateCustomLinksById);
    }
  }, [active, loading]);

  useEffect(() => {
    if (active && !loadingFavorites) {
      setFavorites(candidateFavorites);
    }
  }, [active, loadingFavorites]);

  useEffect(() => {
    if (active && !loadingPlatformCategories) {
      setPlatformCategories(candidatePlatformCategories);
    }
  }, [active, loadingPlatformCategories]);

  useEffect(() => {
    if (active) {
      setStoredRecentVisits(storage.getItem(storageKey) ?? []);
    }
  }, [active]);

  useEffect(() => {
    if (active) {
      const startFetchLaunchpadInfo = async (): Promise<void> => {
        try {
          await deferredLaunchpadInfo.fetch();
          setLoading(false);
        } catch (error) {
          handleHttpError(error);
        }
      };
      startFetchLaunchpadInfo();
    }
  }, [active]);

  useEffect(() => {
    if (active) {
      const startFetchFavorites = async (): Promise<void> => {
        try {
          await deferredFavorites.fetch();
          setLoadingFavorites(false);
        } catch (error) {
          setLoadingFavorites(false);
          showErrorAsNotification(error);
        }
      };
      startFetchFavorites();
    }
  }, [active]);

  useEffect(() => {
    if (
      active &&
      getRuntime()?.getFeatureFlags()["launchpad-show-platform-category"]
    ) {
      const startFetchPlatformCategories = async (): Promise<void> => {
        try {
          await deferredPlatformCategories.fetch();
          setLoadingPlatformCategories(false);
        } catch (error) {
          setLoadingPlatformCategories(false);
          showErrorAsNotification(error);
        }
      };
      startFetchPlatformCategories();
    }
  }, [active]);

  useEffect(() => {
    if (loading) {
      return;
    }
    const visits = storedRecentVisits
      .map((item) => {
        // Remembered recent visits maybe no longer existed in launchpad
        if (item.type === "app") {
          const app = microAppsById.get(item.id);
          return app
            ? {
                type: "app",
                name: app.localeName,
                id: app.id,
                url: app.homepage,
                instanceId: app.instanceId,
                menuIcon: app.menuIcon,
              }
            : null;
        }
        return customLinksById.get(item.id);
      })
      .filter(Boolean) as MenuItemDataNormal[];
    setRecentVisits(visits);
  }, [customLinksById, loading, microAppsById, storedRecentVisits]);

  const pushRecentVisit = useCallback(({ type, id }: StoredMenuItem) => {
    const visits: StoredMenuItem[] = storage.getItem(storageKey) ?? [];
    const index = visits.findIndex(
      (visit) => visit.type === type && visit.id === id
    );
    if (index > -1) {
      visits.splice(index, 1);
    }
    visits.unshift({ type, id });
    if (visits.length > RECENT_VISITS_LIMIT) {
      visits.pop();
    }
    // setStoredRecentVisits(visits);
    storage.setItem(storageKey, visits);
  }, []);

  const isStarred = useCallback(
    (item: MenuItemDataNormal) =>
      favorites.some((fav) => matchFavorite(item, fav)),
    [favorites]
  );

  const toggleStar = useCallback(
    (item: MenuItemDataNormal | MenuItemDataLink) => {
      const index = favorites.findIndex((fav) =>
        item.type === "link"
          ? fav.favoriteId === item.favoriteId
          : matchFavorite(item, fav)
      );
      let newFavorites: FavMenuItem[];
      if (index > -1) {
        const removed = favorites[index];
        newFavorites = favorites
          .slice(0, index)
          .concat(favorites.slice(index + 1));
        undoFavorite(removed).catch(showErrorAsNotification);
      } else {
        if (favorites.length >= FAVORITES_LIMIT) {
          showDialog({
            type: "warn",
            title: "收藏数量已达上限",
            content: `当前收藏链接数量已达上限（${FAVORITES_LIMIT}个），请删除部分收藏后再添加。`,
          });
          return;
        }
        // Assert: no link item
        const fav: FavMenuItem = { ...(item as MenuItemDataNormal) };
        newFavorites = favorites.concat(fav);
        favorite(item as MenuItemDataNormal).then((result) => {
          if (result) {
            fav.favoriteId = result.instanceId;
          }
        }, showErrorAsNotification);
      }
      setFavorites(newFavorites);
      candidateFavorites = newFavorites;
    },
    [favorites]
  );

  const menuGroups: MenuGroupData[] = useMemo(
    () => search(desktops, q),
    [desktops, q]
  );

  const filteredPlatformCategories: PlatformCategoryItem[] = useMemo(
    () => searchCategories(platformCategories, q),
    [platformCategories, q]
  );

  return {
    loading,
    q,
    setQ,
    menuGroups,
    loadingFavorites,
    loadingPlatformCategories,
    favorites,
    recentVisits,
    pushRecentVisit,
    isStarred,
    toggleStar,
    platformCategories: filteredPlatformCategories,
  };
}

export function matchFavorite(item: MenuItemDataNormal, fav: FavMenuItem) {
  return item.instanceId && fav.instanceId
    ? fav.instanceId === item.instanceId
    : fav.type === item.type && fav.id === item.id;
}
