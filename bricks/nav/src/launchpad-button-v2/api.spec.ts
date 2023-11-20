import { describe, test, expect } from "@jest/globals";
import { initializeI18n } from "@next-core/i18n";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import {
  LaunchpadApi_createCollection,
  LaunchpadApi_deleteCollection,
  LaunchpadApi_listCollection,
} from "@next-api-sdk/user-service-sdk";
import { fetchLaunchpadInfo } from "./api.js";

jest.mock("@next-api-sdk/micro-app-standalone-sdk");
jest.mock("@next-api-sdk/user-service-sdk");

const getLaunchpadInfo = LaunchpadApi_getLaunchpadInfo as jest.Mock;

initializeI18n();

describe("fetchLaunchpadInfo", () => {
  test("", async () => {
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
              ],
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
