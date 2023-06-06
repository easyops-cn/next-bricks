import { JsonStorage } from "@next-shared/general/JsonStorage";
import { MicroApp, Storyboard } from "@next-core/types";
import {
  LaunchpadApi_ListCollectionResponseItem,
  LaunchpadApi_listCollection,
  LaunchpadApi_CreateCollectionRequestBody,
  LaunchpadApi_createCollection,
  LaunchpadApi_deleteCollection,
} from "@next-api-sdk/user-service-sdk";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import { getRuntime, getAuth } from "@next-core/runtime";
import { pick } from "lodash";
import { i18n } from "@next-core/i18n";
import { LaunchpadSettings } from "./LaunchpadSettingsContext.js";
import {
  DesktopData,
  DesktopItemApp,
  DesktopItemCustom,
  SiteMapItem,
} from "./interfaces.js";

interface LaunchpadBaseInfo {
  settings: LaunchpadSettings;
  microApps: MicroApp[];
  desktops: DesktopData[];
  siteSort: SiteMapItem[];
}

export class LaunchpadService {
  readonly storageKey = `launchpad-recently-visited:${
    (getAuth() as Record<string, string>)?.org
  }`;
  private storage: JsonStorage;
  private favoriteList: LaunchpadApi_ListCollectionResponseItem[] = [];
  private filteredFavoriteList: LaunchpadApi_ListCollectionResponseItem[] = [];
  private microApps: MicroApp[] = [];
  private customList: DesktopItemCustom[] = [];
  private maxVisitorLength = 7;
  private preFetchId: any;
  private fetched = false;
  private baseInfo: LaunchpadBaseInfo = {
    settings: {
      columns: 7,
      rows: 4,
    },
    microApps: [],
    desktops: [],
    siteSort: [],
  };
  public isFetching = false;
  constructor() {
    this.storage = new JsonStorage(localStorage);

    this.init();
  }

  init(): void {
    const runtime = getRuntime();
    this.baseInfo = {
      desktops: runtime.getDesktops() as DesktopData[],
      microApps: [runtime.getCurrentApp() as MicroApp],
      settings: runtime.getLaunchpadSettings(),
      siteSort: runtime.getLaunchpadSiteMap() as SiteMapItem[],
    };

    this.initValue();
  }

  private initValue(): void {
    this.customList = this.baseInfo.desktops
      .map((desktop) => desktop.items.filter((i) => i.type === "custom"))
      .flat() as DesktopItemCustom[];

    const microApps = this.baseInfo.microApps
      // 兼容较老版本接口未返回 `status` 的情况。
      .filter(
        (item) =>
          item &&
          (!item.status ||
            item.status === "enabled" ||
            item.status === "developing")
      );

    this.setMicroApps(microApps);
  }

  setMaxVisitorLength(value: number) {
    this.maxVisitorLength = value;
  }

  async fetchFavoriteList() {
    const result = (
      await LaunchpadApi_listCollection({ page: 1, pageSize: 25 })
    ).list;
    // const result = [];
    this.setFavorites(result);
    return result;
  }

  async preFetchLaunchpadInfo(): Promise<void> {
    if (window.STANDALONE_MICRO_APPS && !this.fetched) {
      this.fetched = true;
      const preFetchLaunchpadInfo = async (): Promise<void> => {
        await this.fetchLaunchpadInfo();
      };
      if (typeof window.requestIdleCallback === "function") {
        this.preFetchId = window.requestIdleCallback(preFetchLaunchpadInfo);
      } else {
        this.preFetchId = setTimeout(preFetchLaunchpadInfo);
      }
    }
  }

  async fetchLaunchpadInfo(): Promise<boolean> {
    if (typeof window.cancelIdleCallback === "function") {
      cancelIdleCallback(this.preFetchId);
    } else {
      clearTimeout(this.preFetchId);
    }
    if (this.isFetching) return false;
    this.isFetching = true;
    const launchpadInfo = await LaunchpadApi_getLaunchpadInfo(null as any);

    for (const storyboard of launchpadInfo.storyboards as Storyboard[]) {
      const app = storyboard.app as unknown as MicroApp;
      if (app) {
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
    }

    this.baseInfo = {
      ...launchpadInfo,
      settings: (launchpadInfo.settings as Record<string, unknown>)
        .launchpad as LaunchpadSettings,
      microApps: (launchpadInfo.storyboards as Storyboard[])
        .map((storyboard) => storyboard.app)
        .filter(Boolean) as unknown as MicroApp[],
    } as unknown as LaunchpadBaseInfo;
    this.initValue();
    this.isFetching = false;
    return true;
  }

  getBaseInfo(): LaunchpadBaseInfo {
    return this.baseInfo;
  }

  getFavoritesLength(): number {
    return this.favoriteList.length;
  }

  typeAdaptor(type: string): string {
    if (type === "customItem") {
      return "custom";
    }

    if (type === "microApp") {
      return "app";
    }

    return type;
  }

  setFavorites(list: LaunchpadApi_ListCollectionResponseItem[]): void {
    this.filteredFavoriteList =
      list?.filter(
        (v) =>
          v.launchpadCollection?.type === "microApp" ||
          (v.launchpadCollection as any).type === "customItem"
      ) ?? [];

    this.favoriteList = list;
  }

  setMicroApps(microApps: MicroApp[]) {
    this.microApps = microApps;
    this.syncValidRecentlyVisitor();
  }

  syncValidRecentlyVisitor() {
    if (window.STANDALONE_MICRO_APPS) {
      // standalone模式时，刷新页面不会请求launchpad数据，拿不全microApps和customList，所以 syncValidRecentlyVisitor 直接返回
      return;
    }
    const visitors = this.getAllVisitors();
    const result = visitors.filter((v) => {
      if (v.type === "app") {
        return this.microApps.some((app) => app.id === v.id);
      } else {
        return this.customList.some((f) => f.type === v.type && f.id === v.id);
      }
    });

    this.setAllVisitors(result);
  }

  async setAsFavorite(params: LaunchpadApi_CreateCollectionRequestBody) {
    await LaunchpadApi_createCollection(params, {
      interceptorParams: { ignoreLoadingBar: true },
    });
  }

  async deleteFavorite(id: string | number) {
    await LaunchpadApi_deleteCollection(id, {
      interceptorParams: { ignoreLoadingBar: true },
    });
  }

  isFavorite(item: DesktopItemApp | DesktopItemCustom) {
    if (item.type === "app") {
      return this.filteredFavoriteList.some(
        (f) =>
          this.typeAdaptor((f.launchpadCollection as any).type) === "app" &&
          f.microAppId === item.id
      );
    }

    return this.filteredFavoriteList.some(
      (f) =>
        this.typeAdaptor((f.launchpadCollection as any).type) === "custom" &&
        (f as any).customItemId === item.id
    );
  }

  getItem(
    type: "app" | "custom",
    id: string
  ): DesktopItemApp | DesktopItemCustom {
    return (this.storage.getItem(this.storageKey) || []).find(
      (v: DesktopItemApp | DesktopItemCustom) => v.id === id && v.type === type
    );
  }

  getItemIndex(type: "app" | "custom", id: string): number {
    return (this.storage.getItem(this.storageKey) || []).findIndex(
      (v: DesktopItemApp | DesktopItemCustom) => v.id === id && v.type === type
    );
  }

  hasItem(type: "app" | "custom", id: string): boolean {
    return (this.storage.getItem(this.storageKey) || []).some(
      (v: DesktopItemApp | DesktopItemCustom) => v.id === id && v.type === type
    );
  }

  getAllVisitors(): (DesktopItemApp | DesktopItemCustom)[] {
    return this.storage.getItem(this.storageKey) || [];
  }

  setItem(
    type: "app" | "custom",
    item: DesktopItemApp | DesktopItemCustom
  ): void {
    const visitors = this.getAllVisitors();

    if (!this.hasItem(type, item.id)) {
      visitors.unshift(item);
    } else {
      const index = this.getItemIndex(type, item.id);
      visitors.splice(index, 1);
      visitors.unshift(item);
    }

    // 默认只保存一行
    if (visitors.length > this.maxVisitorLength) {
      visitors.pop();
    }
    this.setAllVisitors(visitors);
  }

  setAllVisitors(visitors: (DesktopItemApp | DesktopItemCustom)[]) {
    this.storage.setItem(this.storageKey, visitors);
  }

  pushVisitor(
    type: "app" | "custom",
    item: MicroApp | DesktopItemCustom
  ): void {
    if (type === "app") {
      const app = item as MicroApp;
      item = {
        id: app.id,
        app: {
          name: app.name,
          icons: app.icons,
          localeName: app.localeName,
          id: app.id,
          homepage: app.homepage,
          currentVersion: app.currentVersion,
          standaloneMode: (app as MicroApp & { standaloneMode: boolean })
            .standaloneMode,
        } as MicroApp,
        type: "app",
      } as any;
    }

    this.setItem(type, item as DesktopItemApp | DesktopItemCustom);
  }

  getVisitor(
    type: "app" | "custom",
    id: string
  ): DesktopItemApp | DesktopItemCustom | undefined {
    return this.getItem(type, id);
  }

  getRealDesktopItem(
    item: LaunchpadApi_ListCollectionResponseItem
  ): MicroApp | DesktopItemCustom {
    if (item.launchpadCollection?.type === "microApp") {
      return this.microApps.find(
        (app) => app.id === item.microAppId
      ) as MicroApp;
    } else {
      return this.customList.find(
        (custom) => custom.id === (item as any).customItemId
      ) as DesktopItemCustom;
    }
  }

  setFavoriteAsVisitor(item: LaunchpadApi_ListCollectionResponseItem) {
    const type = this.typeAdaptor(item.launchpadCollection?.type as string);
    if (type === "link") return;
    const data = this.getRealDesktopItem(item);
    if (data) {
      this.pushVisitor(type as "custom" | "app", data);
    }
  }

  getSitemapList() {
    const curMicroApps = this.baseInfo.microApps.filter((app) => !app.internal);
    const siteMapList = this.baseInfo.siteSort;

    return siteMapList?.map((item) => ({
      ...item,
      apps: (item.apps || []).map((row) => {
        const find = curMicroApps.find((item) => item.id === row.id) || {};
        return {
          ...row,
          ...pick(find, [
            "name",
            "icons",
            "localeName",
            "homepage",
            "currentVersion",
            "standaloneMode",
          ]),
        };
      }),
    }));
  }
}

const service = new LaunchpadService();
export const launchpadService = service;
