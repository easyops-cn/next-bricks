import { describe, test, expect } from "@jest/globals";
import type { MenuGroupData, PlatformCategoryItem } from "./interfaces.js";
import { search, searchCategories } from "./search.js";

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

describe("searchCategories", () => {
  const categories = [
    {
      id: "#all",
      items: [],
      name: "全部",
    },
    {
      id: "cmdb",
      items: [
        {
          description: undefined,
          id: "container",
          name: "容器部署",
          order: 1,
          type: "app",
          url: "/container",
        },
        {
          description: "这是一个自定义项",
          id: "baidu",
          name: "百度",
          order: 2,
          type: "custom",
          url: "https://baidu.com/",
        },
        {
          description: undefined,
          id: "k8s",
          name: "K8S集群管理",
          order: 3,
          type: "app",
          url: "/k8s",
        },
        {
          description: undefined,
          id: "message-subscribe",
          name: "Message Subscribe",
          order: 4,
          type: "app",
          url: "/message-subscribe",
        },
        {
          description: undefined,
          id: "sit",
          name: "sit",
          order: 5,
          type: "custom",
          url: "https://sit.easyops.local/next/visual-builder",
        },
        {
          description: undefined,
          id: "dev",
          name: "dev",
          order: 6,
          type: "custom",
          url: "https://dev.easyops.local/next/visual-builder",
        },
      ],
      name: "CMDB",
    },
  ] as unknown as PlatformCategoryItem[];

  test("no query", () => {
    expect(searchCategories(categories, "")).toBe(categories);
  });

  test("with query", () => {
    expect(searchCategories(categories, "message")).toMatchInlineSnapshot(`
[
  {
    "id": "#all",
    "items": [],
    "name": "全部",
  },
  {
    "id": "cmdb",
    "items": [
      {
        "description": undefined,
        "id": "message-subscribe",
        "name": "Message Subscribe",
        "order": 4,
        "type": "app",
        "url": "/message-subscribe",
      },
    ],
    "name": "CMDB",
  },
]
`);
    expect(searchCategories(categories, "自定义")).toMatchInlineSnapshot(`
[
  {
    "id": "#all",
    "items": [],
    "name": "全部",
  },
  {
    "id": "cmdb",
    "items": [
      {
        "description": "这是一个自定义项",
        "id": "baidu",
        "name": "百度",
        "order": 2,
        "type": "custom",
        "url": "https://baidu.com/",
      },
    ],
    "name": "CMDB",
  },
]
`);
  });
});
