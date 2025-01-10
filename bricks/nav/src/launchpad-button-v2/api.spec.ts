import { describe, test, expect } from "@jest/globals";
import { initializeI18n } from "@next-core/i18n";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import { LaunchpadApi_createCollectionV2 } from "@next-api-sdk/user-service-sdk";
import { InstanceApi_postSearchV3 } from "@next-api-sdk/cmdb-sdk";
import {
  favorite,
  fetchLaunchpadInfo,
  fetchPlatformCategories,
} from "./api.js";

jest.mock("@next-api-sdk/micro-app-standalone-sdk");
jest.mock("@next-api-sdk/user-service-sdk");
jest.mock("@next-api-sdk/cmdb-sdk");
jest.mock("@next-core/easyops-runtime", () => ({
  auth: {
    isBlockedPath(path: string) {
      return path?.includes("blocked");
    },
    isBlockedHref(href: string) {
      return href?.includes("blocked");
    },
  },
}));

const getLaunchpadInfo = LaunchpadApi_getLaunchpadInfo as jest.Mock;
const createCollectionV2 = LaunchpadApi_createCollectionV2 as jest.Mock;
const postSearchV3 = InstanceApi_postSearchV3 as jest.Mock;

initializeI18n();

describe("fetchLaunchpadInfo", () => {
  test("basic usage", async () => {
    getLaunchpadInfo.mockResolvedValueOnce({
      desktops: [
        {
          name: "IT 资源管理",
          items: [
            {
              type: "app",
              id: "cmdb-instances",
            },
            {
              type: "app",
              id: "models",
            },
            {
              type: "custom",
              id: "foo",
              name: "Bar",
            },
            {
              type: "dir",
              name: "extends",
              items: [
                {
                  type: "app",
                  id: "dir-cmdb-app",
                },
                {
                  type: "custom",
                  id: "dir-cmdb-custom",
                  name: "Dir Custom",
                },
                {
                  type: "custom",
                  id: "blocked-item",
                  name: "Blocked Item",
                  url: "/blocked",
                },
              ],
            },
            {
              type: "app",
              id: "blocked-app",
            },
            {
              type: "custom",
              id: "blocked-item",
              name: "Blocked Item",
              url: "/blocked",
            },
          ],
        },
        {
          name: "新分类",
          items: [
            {
              type: "dir",
              name: "cmdb-extends",
              items: [
                {
                  type: "app",
                  id: "dir-foo-app",
                },
              ],
            },
          ],
        },
      ],
      storyboards: [
        {
          app: {
            id: "cmdb-instances",
            locales: {
              en: {
                name: "Cmdb Instances",
              },
              zh: {
                name: "实例管理",
              },
            },
          },
        },
        {
          app: {
            id: "dir-cmdb-app",
            name: "DIR CMDB",
          },
        },
        {
          app: {
            id: "oops",
            name: "Oops",
          },
        },
        {
          app: {
            id: "blocked-app",
            name: "Blocked App",
            homepage: "/blocked",
          },
        },
      ],
    });
    const result = await fetchLaunchpadInfo();
    expect(result).toMatchInlineSnapshot(`
{
  "customLinksById": Map {
    "foo" => {
      "id": "foo",
      "name": "Bar",
      "type": "custom",
    },
    "dir-cmdb-custom" => {
      "id": "dir-cmdb-custom",
      "name": "Dir Custom",
      "type": "custom",
    },
  },
  "menuGroups": [
    {
      "items": [
        {
          "id": "cmdb-instances",
          "menuIcon": undefined,
          "name": "Cmdb Instances",
          "type": "app",
          "url": undefined,
        },
        {
          "id": "foo",
          "name": "Bar",
          "type": "custom",
        },
        {
          "items": [
            {
              "id": "dir-cmdb-app",
              "menuIcon": undefined,
              "name": "DIR CMDB",
              "type": "app",
              "url": undefined,
            },
            {
              "id": "dir-cmdb-custom",
              "name": "Dir Custom",
              "type": "custom",
            },
          ],
          "name": "extends",
          "type": "dir",
        },
      ],
      "name": "IT 资源管理",
    },
  ],
  "microAppsById": Map {
    "cmdb-instances" => {
      "id": "cmdb-instances",
      "localeName": "Cmdb Instances",
      "locales": {
        "en": {
          "name": "Cmdb Instances",
        },
        "zh": {
          "name": "实例管理",
        },
      },
    },
    "dir-cmdb-app" => {
      "id": "dir-cmdb-app",
      "localeName": "DIR CMDB",
      "name": "DIR CMDB",
    },
    "oops" => {
      "id": "oops",
      "localeName": "Oops",
      "name": "Oops",
    },
  },
}
`);
  });
});

describe("favorite", () => {
  test("app", async () => {
    await favorite({ type: "app", instanceId: "my-fav-app" } as any);
    expect(createCollectionV2).toBeCalledWith(
      {
        type: "microApp",
        relatedInstanceId: "my-fav-app",
      },
      {
        interceptorParams: { ignoreLoadingBar: true },
      }
    );
  });

  test("custom", async () => {
    await favorite({ type: "custom", instanceId: "my-fav-custom" } as any);
    expect(createCollectionV2).toBeCalledWith(
      {
        type: "customItem",
        relatedInstanceId: "my-fav-custom",
      },
      {
        interceptorParams: { ignoreLoadingBar: true },
      }
    );
  });
});

describe("platformCategory", () => {
  test("basic usage", async () => {
    postSearchV3.mockResolvedValueOnce({
      list: [
        {
          icon: {
            icon: "insert-row-right",
            lib: "antd",
            theme: "outlined",
          },
          id: "cmdb",
          name: "CMDB",
          order: 2,
          platformApps: [
            {
              "@": {
                order: 3,
              },
              _object_id: "_INSTALLED_MICRO_APP",
              appId: "k8s",
              homepage: "/k8s",
              menuIcon: {
                category: "model",
                icon: "kubernetes",
                lib: "easyops",
              },
              name: "K8S集群管理",
            },
            {
              "@": {
                order: 4,
              },
              _object_id: "_INSTALLED_MICRO_APP",
              appId: "message-subscribe",
              homepage: "/message-subscribe",
              locales: {
                en: {
                  name: "Message Subscribe",
                },
                zh: {
                  name: "消息订阅",
                },
              },
              menuIcon: {
                category: "app",
                icon: "message-subscribe",
                lib: "easyops",
              },
              name: "消息订阅",
            },
            {
              "@": {
                order: 1,
              },
              _object_id: "_INSTALLED_MICRO_APP",
              appId: "container",
              homepage: "/container",
              locales: {},
              menuIcon: {
                category: "app",
                icon: "container",
                lib: "easyops",
              },
              name: "容器部署",
            },
            {
              "@": {
                order: 2,
              },
              _object_id: "_INSTALLED_MICRO_APP",
              appId: "blocked-app",
              homepage: "/blocked-app",
              locales: {},
              menuIcon: {
                category: "app",
                icon: "container",
                lib: "easyops",
              },
              name: "Blocked App",
            },
          ],
          platformItems: [
            {
              "@": {
                order: 2,
              },
              _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
              id: "baidu",
              menuIcon: {
                icon: "apple-alt",
                lib: "fa",
                prefix: "fas",
              },
              name: "百度",
              url: "https://baidu.com/",
            },
            {
              "@": {
                order: 6,
              },
              _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
              id: "dev",
              name: "dev",
              url: "https://dev.easyops.local/next/visual-builder",
            },
            {
              "@": {
                order: 5,
              },
              _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
              id: "sit",
              name: "sit",
              url: "https://sit.easyops.local/next/visual-builder",
            },
            {
              "@": {
                order: 9,
              },
              _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
              id: "blocked",
              name: "blocked",
              url: "https://sit.easyops.local/next/blocked-url",
            },
          ],
          type: "platform",
        },
        {
          icon: {
            icon: "pic-right",
            lib: "antd",
            theme: "outlined",
          },
          id: "lowCode",
          name: "LowCode",
          order: 1,
          platformApps: [
            {
              _object_id: "_INSTALLED_MICRO_APP",
              appId: "monitor-alarm-notice",
              homepage: "/legacy/monitor-alarm-notice",
              menuIcon: {
                category: "app",
                icon: "monitor-alarm-notice",
                lib: "easyops",
              },
              name: "告警事件",
            },
            {
              "@": {
                order: 1,
              },
              _object_id: "_INSTALLED_MICRO_APP",
              appId: "monitor-auto-recovery",
              homepage: "/legacy/monitor-auto-recovery",
              menuIcon: {
                category: "app",
                icon: "monitor-auto-recovery",
                lib: "easyops",
              },
              name: "故障自愈",
            },
            {
              "@": {
                order: 2,
              },
              _object_id: "_INSTALLED_MICRO_APP",
              appId: "monitor-alarm-rule",
              homepage: "/legacy/monitor-alarm-rule",
              menuIcon: {
                category: "app",
                icon: "monitor-alarm-rule",
                lib: "easyops",
              },
              name: "告警策略",
            },
          ],
          platformItems: [],
          type: "platform",
        },
        {
          icon: {
            icon: "right-square",
            lib: "antd",
            theme: "outlined",
          },
          id: "devOps",
          name: "DevOps",
          platformApps: [],
          platformItems: [
            {
              _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
              id: "github",
              name: "github",
              url: "https://github.com",
            },
            {
              "@": {
                order: 1,
              },
              _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
              id: "gitlab",
              name: "gitlab",
              url: "https://gitlab.com",
            },
          ],
          type: "platform",
        },
      ],
    });
    const result = await fetchPlatformCategories();
    expect(result).toMatchInlineSnapshot(`
[
  {
    "icon": {
      "category": "second-menu",
      "icon": "sprint-planning-second-menu",
      "lib": "easyops",
    },
    "id": "#all",
    "items": [],
    "name": "全部",
  },
  {
    "icon": {
      "icon": "pic-right",
      "lib": "antd",
      "theme": "outlined",
    },
    "id": "lowCode",
    "instanceId": undefined,
    "items": [
      {
        "description": undefined,
        "id": "monitor-auto-recovery",
        "instanceId": undefined,
        "menuIcon": {
          "category": "app",
          "icon": "monitor-auto-recovery",
          "lib": "easyops",
        },
        "name": "故障自愈",
        "order": 1,
        "type": "app",
        "url": "/legacy/monitor-auto-recovery",
      },
      {
        "description": undefined,
        "id": "monitor-alarm-rule",
        "instanceId": undefined,
        "menuIcon": {
          "category": "app",
          "icon": "monitor-alarm-rule",
          "lib": "easyops",
        },
        "name": "告警策略",
        "order": 2,
        "type": "app",
        "url": "/legacy/monitor-alarm-rule",
      },
      {
        "description": undefined,
        "id": "monitor-alarm-notice",
        "instanceId": undefined,
        "menuIcon": {
          "category": "app",
          "icon": "monitor-alarm-notice",
          "lib": "easyops",
        },
        "name": "告警事件",
        "order": undefined,
        "type": "app",
        "url": "/legacy/monitor-alarm-notice",
      },
    ],
    "name": "LowCode",
    "order": 1,
  },
  {
    "icon": {
      "icon": "insert-row-right",
      "lib": "antd",
      "theme": "outlined",
    },
    "id": "cmdb",
    "instanceId": undefined,
    "items": [
      {
        "description": undefined,
        "id": "container",
        "instanceId": undefined,
        "menuIcon": {
          "category": "app",
          "icon": "container",
          "lib": "easyops",
        },
        "name": "容器部署",
        "order": 1,
        "type": "app",
        "url": "/container",
      },
      {
        "description": undefined,
        "id": "baidu",
        "instanceId": undefined,
        "menuIcon": {
          "icon": "apple-alt",
          "lib": "fa",
          "prefix": "fas",
        },
        "name": "百度",
        "order": 2,
        "type": "custom",
        "url": "https://baidu.com/",
      },
      {
        "description": undefined,
        "id": "k8s",
        "instanceId": undefined,
        "menuIcon": {
          "category": "model",
          "icon": "kubernetes",
          "lib": "easyops",
        },
        "name": "K8S集群管理",
        "order": 3,
        "type": "app",
        "url": "/k8s",
      },
      {
        "description": undefined,
        "id": "message-subscribe",
        "instanceId": undefined,
        "menuIcon": {
          "category": "app",
          "icon": "message-subscribe",
          "lib": "easyops",
        },
        "name": "Message Subscribe",
        "order": 4,
        "type": "app",
        "url": "/message-subscribe",
      },
      {
        "description": undefined,
        "id": "sit",
        "instanceId": undefined,
        "menuIcon": undefined,
        "name": "sit",
        "order": 5,
        "type": "custom",
        "url": "https://sit.easyops.local/next/visual-builder",
      },
      {
        "description": undefined,
        "id": "dev",
        "instanceId": undefined,
        "menuIcon": undefined,
        "name": "dev",
        "order": 6,
        "type": "custom",
        "url": "https://dev.easyops.local/next/visual-builder",
      },
    ],
    "name": "CMDB",
    "order": 2,
  },
  {
    "icon": {
      "icon": "right-square",
      "lib": "antd",
      "theme": "outlined",
    },
    "id": "devOps",
    "instanceId": undefined,
    "items": [
      {
        "description": undefined,
        "id": "gitlab",
        "instanceId": undefined,
        "menuIcon": undefined,
        "name": "gitlab",
        "order": 1,
        "type": "custom",
        "url": "https://gitlab.com",
      },
      {
        "description": undefined,
        "id": "github",
        "instanceId": undefined,
        "menuIcon": undefined,
        "name": "github",
        "order": undefined,
        "type": "custom",
        "url": "https://github.com",
      },
    ],
    "name": "DevOps",
    "order": undefined,
  },
]
`);
  });
});
