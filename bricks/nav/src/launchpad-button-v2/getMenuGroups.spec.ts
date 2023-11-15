import { describe, test, expect } from "@jest/globals";
import type { MicroApp } from "@next-core/types";
import type { DesktopData } from "../launchpad/interfaces.js";
import { getMenuGroups } from "./getMenuGroups.js";

describe("getMenuGroups", () => {
  const allMenuGroups = [
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
          id: "fun-cmdb",
          name: "Fun",
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
              app: {
                id: "dir-cmdb-app",
                localeName: "Dir APP",
              },
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
  ] as DesktopData[];
  const microAppsById = new Map([
    [
      "cmdb-instances",
      {
        app: {
          id: "cmdb-instances",
          localeName: "实例管理",
        },
      },
    ],
    [
      "dir-cmdb-app",
      {
        app: {
          id: "dir-cmdb-app",
          localeName: "Dir APP",
        },
      },
    ],
  ]) as unknown as Map<string, MicroApp>;

  test("basic usage", () => {
    expect(getMenuGroups(allMenuGroups, microAppsById)).toMatchInlineSnapshot(`
[
  {
    "items": [
      {
        "app": {
          "app": {
            "id": "cmdb-instances",
            "localeName": "实例管理",
          },
        },
        "id": "cmdb-instances",
        "type": "app",
      },
      {
        "id": "fun-cmdb",
        "name": "Fun",
        "type": "custom",
      },
      {
        "id": "foo",
        "name": "Bar",
        "type": "custom",
      },
      {
        "id": undefined,
        "items": [
          {
            "app": {
              "app": {
                "id": "dir-cmdb-app",
                "localeName": "Dir APP",
              },
            },
            "id": "dir-cmdb-app",
            "type": "app",
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
]
`);
  });
});
