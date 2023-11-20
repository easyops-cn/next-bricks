import { describe, test, expect } from "@jest/globals";
import type { MenuGroupData } from "./interfaces.js";
import { search } from "./search.js";

describe("search", () => {
  const allMenuGroups = [
    {
      name: "IT 资源管理",
      items: [
        {
          type: "app",
          id: "cmdb-instances",
          name: "实例管理",
        },
        {
          type: "app",
          id: "models",
          name: "CMDB 模型",
        },
        {
          type: "app",
          id: "others",
          name: "其他",
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
              name: "Dir APP",
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
              name: "Dir Bar APP",
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
  ] as MenuGroupData[];

  test("no query", () => {
    expect(search(allMenuGroups, "")).toBe(allMenuGroups);
  });

  test("with query", () => {
    expect(search(allMenuGroups, "cmdb")).toMatchInlineSnapshot(`
[
  {
    "items": [
      {
        "id": "cmdb-instances",
        "name": "实例管理",
        "type": "app",
      },
      {
        "id": "models",
        "name": "CMDB 模型",
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
            "id": "dir-cmdb-app",
            "name": "Dir APP",
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
