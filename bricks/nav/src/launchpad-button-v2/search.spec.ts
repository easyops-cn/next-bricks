import { describe, test, expect } from "@jest/globals";
import type { DesktopData } from "../launchpad/interfaces.js";
import { search } from "./search.js";

describe("search", () => {
  const allMenuGroups = [
    {
      name: "IT 资源管理",
      items: [
        {
          type: "app",
          app: {
            id: "cmdb-instances",
            localeName: "实例管理",
          },
        },
        {
          type: "app",
          app: {
            id: "models",
            localeName: "CMDB 模型",
          },
        },
        {
          type: "app",
          app: {
            id: "others",
            localeName: "其他",
          },
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
              app: {
                id: "dir-foo-app",
                localeName: "Dir Bar APP",
              },
            },
            {
              type: "custom",
              id: "dir-foo-custom",
              name: "Dir Bar Custom",
            },
          ],
        },
      ],
    },
  ] as DesktopData[];

  test("no query", () => {
    expect(search(allMenuGroups, "")).toBe(allMenuGroups);
  });

  test("with query", () => {
    expect(search(allMenuGroups, "cmdb")).toMatchInlineSnapshot(`
[
  {
    "items": [
      {
        "app": {
          "id": "cmdb-instances",
          "localeName": "实例管理",
        },
        "type": "app",
      },
      {
        "app": {
          "id": "models",
          "localeName": "CMDB 模型",
        },
        "type": "app",
      },
      {
        "id": "fun-cmdb",
        "name": "Fun",
        "type": "custom",
      },
      {
        "items": [
          {
            "app": {
              "id": "dir-cmdb-app",
              "localeName": "Dir APP",
            },
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
