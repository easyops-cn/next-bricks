import { MicroApp } from "@next-core/types";
import { LaunchpadService } from "./LaunchpadService.js";
import {
  LaunchpadApi_listCollection,
  LaunchpadApi_createCollection,
  LaunchpadApi_deleteCollection,
} from "@next-api-sdk/user-service-sdk";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import { DesktopData, DesktopItemCustom } from "./interfaces.js";

jest.mock("@next-api-sdk/user-service-sdk");
jest.mock("@next-api-sdk/micro-app-standalone-sdk");

const listCollectionData = [
  {
    launchpadCollection: {
      instanceId: "5b7ac056ea2ac",
      type: "microApp",
      name: "aaa",
      icon: {
        type: "",
        theme: "",
        icon: "default-app",
        lib: "easyops",
        category: "app",
        prefix: "",
      },
      link: "https://lanhuapp.com/web/#/item/project/detailDetach?pid=d79ded47-8f66-4ce2-8b29-a154da5ef01d&project_id=d79ded47-8f66-4ce2-8b29-a154da5ef01d&image_id=4564f2e0-b8bb-4174-a8dc-477e296f5558",
    },
    microAppId: "a",
    customItemId: "",
  },
  {
    launchpadCollection: {
      instanceId: "5b74075f52248",
      type: "customItem",
      name: "b",
      icon: {
        type: "",
        theme: "",
        icon: "default-app",
        lib: "easyops",
        category: "app",
        prefix: "",
      },
      link: "http://192.168.103.123",
    },
    microAppId: "",
    customItemId: "b",
  },
  {
    launchpadCollection: {
      instanceId: "5b810969df6a0",
      type: "microApp",
      name: "c1",
      icon: {
        type: "",
        theme: "",
        icon: "ambulance",
        lib: "fa",
        category: "",
        prefix: "fas",
      },
      link: "https://uwintech.yuque.com/uwintech",
    },
    microAppId: "c1",
    customItemId: "",
  },
];
const spyOnListCollection = (
  LaunchpadApi_listCollection as jest.Mock
).mockReturnValue({
  list: listCollectionData,
});

spyOnListCollection.mock;
const spyOnCreateCollection = LaunchpadApi_createCollection as jest.Mock;
const spyOnDeleteCollection = LaunchpadApi_deleteCollection as jest.Mock;
const spyOnGetLaunchpadInfo = LaunchpadApi_getLaunchpadInfo as jest.Mock;

jest.mock("@next-core/runtime", () => {
  return {
    getRuntime: () => ({
      getCurrentApp: (): MicroApp => ({
        id: "a",
        name: "a",
        homepage: "/a",
        icons: {
          large: "a.svg",
        },
      }),
      getDesktops: (): DesktopData[] => [
        {
          items: [],
        },
      ],
      getLaunchpadSettings: () => ({
        columns: 5,
        rows: 4,
      }),
      getLaunchpadSiteMap: () => [
        {
          name: "资源管理",
          id: "ResourceManagement",
          apps: [{ id: "a", sort: 1 }],
        },
        { name: "资源可视化", id: "ResourceVisualization" },
        {
          name: "DevOps持续交付",
          id: "DevOpsContinuousDelivery",
          apps: [
            { id: "c", sort: 1 },
            { id: "d", sort: 2 },
          ],
        },
        {
          name: "敏捷管理",
          id: "agile",
          apps: [{ id: "f", sort: 1 }],
        },
      ],
    }),
    getAuth: jest.fn().mockReturnValue({ org: "8888" }),
  };
});

const visitorHelper = (app: MicroApp) => {
  return {
    id: app.id,
    app: {
      name: app.name,
      icons: app.icons,
      localeName: app.localeName,
      id: app.id,
      homepage: app.homepage,
    } as MicroApp,
    type: "app",
  };
};
const data = [
  {
    id: "a",
    name: "a",
    homepage: "/a",
    localeName: "a",
    type: "app",
    icons: {
      large: "a.svg",
    },
  },
  {
    id: "test",
    name: "自定义项",
    type: "custom",
    url: "http://www.baidu.com",
    items: [0],
  },
  {
    id: "c",
    name: "c",
    homepage: "/c",
    type: "app",
    installStatus: "running",
  },
  {
    id: "d",
    name: "d",
    homepage: "/d",
    type: "app",
    status: "developing",
  },
  {
    id: "e",
    name: "e",
    homepage: "/e",
    type: "app",
    installStatus: "running",
  },
  {
    id: "f",
    name: "f",
    homepage: "/f",
    type: "app",
    status: "developing",
  },
  {
    id: "g",
    name: "g",
    homepage: "/g",
    type: "app",
    installStatus: "running",
  },
  {
    id: "h",
    name: "h",
    homepage: "/h",
    type: "app",
    status: "developing",
  },
] as unknown as Array<MicroApp | DesktopItemCustom>;

describe("LaunchpadService", () => {
  beforeEach(() => {
    window.STANDALONE_MICRO_APPS = undefined;
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should work", async () => {
    //const service = launchpadService;
    const service = new LaunchpadService();
    await service.init();
    await service.fetchFavoriteList();
    expect(service.getAllVisitors()).toHaveLength(0);

    service.pushVisitor("app", data[0]);
    expect(service.getAllVisitors()).toHaveLength(1);

    service.pushVisitor("custom", data[1]);
    expect(service.getAllVisitors()).toHaveLength(2);
    expect(service.getAllVisitors()[0]).toEqual(data[1]);
    expect(service.getAllVisitors()[1]).toEqual(
      visitorHelper(data[0] as MicroApp)
    ); //s

    service.pushVisitor("app", data[0]);
    expect(service.getAllVisitors()).toHaveLength(2);
    expect(service.getAllVisitors()[0]).toEqual(
      visitorHelper(data[0] as MicroApp)
    );
    expect(service.getAllVisitors()[1]).toEqual(data[1]);

    data.forEach((d) => {
      service.pushVisitor((d as DesktopItemCustom).type, d);
    });
    expect(service.getAllVisitors()).toHaveLength(7);

    expect(service.isFavorite(data[0] as DesktopItemCustom)).toBe(true);
    expect(service.isFavorite(data[1] as DesktopItemCustom)).toBe(false);

    await service.setAsFavorite(listCollectionData[0] as any);
    expect(spyOnCreateCollection).toHaveBeenCalledWith(listCollectionData[0], {
      interceptorParams: { ignoreLoadingBar: true },
    });

    await service.deleteFavorite(listCollectionData[0] as any);
    expect(spyOnDeleteCollection).toHaveBeenCalledWith(listCollectionData[0], {
      interceptorParams: { ignoreLoadingBar: true },
    });

    expect(service.getSitemapList()).toEqual([
      {
        name: "资源管理",
        id: "ResourceManagement",
        apps: [
          {
            id: "a",
            sort: 1,
            name: "a",
            homepage: "/a",
            icons: { large: "a.svg" },
          },
        ],
      },
      { name: "资源可视化", id: "ResourceVisualization", apps: [] },
      {
        name: "DevOps持续交付",
        id: "DevOpsContinuousDelivery",
        apps: [
          { id: "c", sort: 1 },
          { id: "d", sort: 2 },
        ],
      },
      {
        name: "敏捷管理",
        id: "agile",
        apps: [{ id: "f", sort: 1 }],
      },
    ]);
  });

  it("should fetch the launchpad info when window.STANDALONE_MICRO_APPS was true", async () => {
    spyOnGetLaunchpadInfo.mockResolvedValue({
      settings: {
        launchpad: {
          columns: 7,
          rows: 4,
        },
      },
      microApps: [],
      desktops: [],
      siteSort: [],
      storyboards: [],
    });

    const service = new LaunchpadService();

    await service.fetchLaunchpadInfo();

    jest.runAllTimers();

    expect(spyOnGetLaunchpadInfo).toBeCalledTimes(1);
  });

  it("should not syncValidRecentlyVisitor when window.STANDALONE_MICRO_APPS was true", async () => {
    window.STANDALONE_MICRO_APPS = true;
    const service = new LaunchpadService();
    await service.setAllVisitors([{ id: "app-1" }, { id: "app-2" }] as any[]);
    await service.syncValidRecentlyVisitor();
    const visitors = service.getAllVisitors();
    expect(visitors.length).toBe(2);
  });
});
