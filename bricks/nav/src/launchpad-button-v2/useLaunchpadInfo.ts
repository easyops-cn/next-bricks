import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MicroApp, Storyboard } from "@next-core/types";
import { getRuntime, handleHttpError } from "@next-core/runtime";
import { auth } from "@next-core/easyops-runtime";
import { JsonStorage } from "@next-shared/general/JsonStorage";
import type {
  DesktopData,
  DesktopItemApp,
  DesktopItemCustom,
} from "../launchpad/interfaces";
import { DeferredService } from "../shared/DeferredService";
import { showDialog } from "./wrapped-bricks";
import type { FavMenuItem, StoredMenuItem } from "./interfaces";
import {
  favorite,
  fetchFavorites,
  fetchLaunchpadInfo,
  undoFavorite,
} from "./api";
import { search } from "./search";
import { getMenuGroups } from "./getMenuGroups";

const storageKey = `launchpad-recent-visits:${(
  auth.getAuth() as Record<string, string>
)?.org}`;
const storage = new JsonStorage(localStorage);

const FAVORITES_LIMIT = 10;
const RECENT_VISITS_LIMIT = 10;

let candidateDesktops: DesktopData[] = [];
let candidateMicroAppsById = new Map<string, MicroApp>();
let candidateCustomLinksById = new Map<string, DesktopItemCustom>();
let preLoaded = false;

let candidateFavorites: FavMenuItem[] = [];
let preLoadedFavorites = false;

export const deferredLaunchpadInfo = new DeferredService(async () => {
  const info = await fetchLaunchpadInfo();
  candidateDesktops = info.desktops as DesktopData[];

  candidateMicroAppsById = (info.storyboards as Storyboard[]).reduce(
    (acc, { app }) => {
      acc.set(app.id, app);
      return acc;
    },
    new Map<string, MicroApp>()
  );

  const linksById = new Map<string, DesktopItemCustom>();
  for (const desktop of info.desktops as DesktopData[]) {
    for (const item of desktop.items) {
      if (item.type === "custom") {
        linksById.set(item.id, item);
      } else if (item.type === "dir") {
        for (const subItem of item.items) {
          if (subItem.type === "custom") {
            linksById.set(subItem.id, subItem);
          }
        }
      }
    }
  }
  candidateCustomLinksById = linksById;
  preLoaded = true;
});

export const deferredFavorites = new DeferredService(async () => {
  candidateFavorites = await fetchFavorites();
  preLoadedFavorites = true;
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

  const [storedRecentVisits, setStoredRecentVisits] = useState<
    StoredMenuItem[]
  >([]);

  const [recentVisits, setRecentVisits] = useState<
    (DesktopItemApp | DesktopItemCustom)[]
  >([]);

  const [storedFavorites, setStoredFavorites] =
    useState<FavMenuItem[]>(candidateFavorites);
  const [favorites, setFavorites] = useState<
    (DesktopItemApp | DesktopItemCustom)[]
  >([]);

  useEffect(() => {
    // 仅当首次加载完成或重新打开 launchpad 时更新一次数据。
    if (active || !loading) {
      setDesktops(candidateDesktops);
      setMicroAppsById(candidateMicroAppsById);
      setCustomLinksById(candidateCustomLinksById);
    }
  }, [active, loading]);

  useEffect(() => {
    if (active || !loadingFavorites) {
      setStoredFavorites(candidateFavorites);
    }
  }, [active, loadingFavorites]);

  useEffect(() => {
    if (active) {
      setStoredRecentVisits(storage.getItem(storageKey) ?? []);
    }
  }, [active]);

  useEffect(() => {
    if (window.STANDALONE_MICRO_APPS && active) {
      const startFetchLaunchpadInfo = async (): Promise<void> => {
        try {
          await deferredLaunchpadInfo.fetch();
          setLoading(false);
        } catch (error) {
          // props.onWillClose?.();
          handleHttpError(error);
        }
      };
      startFetchLaunchpadInfo();
    }
  }, [active]);

  useEffect(() => {
    if (!window.STANDALONE_MICRO_APPS) {
      const runtime = getRuntime();
      candidateDesktops = runtime.getDesktops() as DesktopData[];
      candidateMicroAppsById = new Map();
      const currentApp = runtime.getCurrentApp();
      if (currentApp) {
        candidateMicroAppsById.set(currentApp.id, currentApp);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (active) {
      const startFetchFavorites = async (): Promise<void> => {
        try {
          await deferredFavorites.fetch();
          setLoadingFavorites(false);
        } catch (error) {
          // props.onWillClose?.();
          // handleHttpError(error);
        }
      };
      startFetchFavorites();
    }
  }, [active]);

  useEffect(() => {
    if (loading) {
      return;
    }
    const visits = storedRecentVisits
      .map((item) => {
        if (item.type === "app") {
          const app = microAppsById.get(item.id);
          return app ? { type: "app", app } : null;
        }
        return customLinksById.get(item.id);
      })
      .filter(Boolean) as (DesktopItemApp | DesktopItemCustom)[];
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

  useEffect(() => {
    if (loading || loadingFavorites) {
      return;
    }
    const list = storedFavorites
      .map((item) => {
        if (item.type === "app") {
          const app = microAppsById.get(item.id);
          return app ? { type: "app", app } : null;
        }
        return customLinksById.get(item.id);
      })
      .filter(Boolean) as (DesktopItemApp | DesktopItemCustom)[];
    setFavorites(list);
  }, [
    customLinksById,
    loading,
    loadingFavorites,
    microAppsById,
    storedFavorites,
  ]);

  const isStarred = useCallback(
    ({ type, id }: FavMenuItem) => {
      return storedFavorites.some(
        (item) => item.type === type && item.id === id
      );
    },
    [storedFavorites]
  );

  const toggleStar = useCallback(
    (item: DesktopItemApp | DesktopItemCustom) => {
      const { type, id } = item;
      const index = storedFavorites.findIndex(
        (item) => item.type === type && item.id === id
      );
      let newFavorites: StoredMenuItem[];
      if (index > -1) {
        const removed = storedFavorites[index];
        newFavorites = storedFavorites
          .slice(0, index)
          .concat(storedFavorites.slice(index + 1));
        undoFavorite(removed);
      } else {
        if (storedFavorites.length >= FAVORITES_LIMIT) {
          showDialog({
            type: "warn",
            title: "收藏数量已达上限",
            content: `当前收藏链接数量已达上限（${FAVORITES_LIMIT}个），请删除部分收藏后再添加。`,
          });
          return;
        }
        const fav: FavMenuItem = { type, id };
        newFavorites = storedFavorites.concat(fav);
        favorite(item);
      }
      setStoredFavorites(newFavorites);
      candidateFavorites = newFavorites;
    },
    [storedFavorites]
  );

  const allMenuGroups: DesktopData[] = useMemo(() => {
    if (loading) {
      return [];
    }
    return getMenuGroups(desktops, microAppsById);
  }, [loading, desktops, microAppsById]);

  const menuGroups: DesktopData[] = useMemo(
    () => search(allMenuGroups, q),
    [allMenuGroups, q]
  );

  return {
    loading,
    q,
    setQ,
    menuGroups,
    loadingFavorites,
    favorites,
    recentVisits,
    pushRecentVisit,
    isStarred,
    toggleStar,
  };
}
