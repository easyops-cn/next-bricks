import { describe, test, expect } from "@jest/globals";
import { cloneNodes } from "./clone-nodes.js";
import { InstanceApi_createInstance } from "@next-api-sdk/cmdb-sdk";
import { TreeNodeItemData, TestTreeData } from "../interface.js";

jest.mock("@next-api-sdk/cmdb-sdk");

describe("cloneNodes", () => {
  test("should work", async () => {
    const createInstanceSdk = InstanceApi_createInstance as jest.Mock;

    const clonedData = {
      instanceId: "604979fcf4e66",

      name: "beforeEach",
      params: null,
      sort: 0,
      type: "block",
      isChainChild: false,
      parent: {
        instanceId: "604979fc8fdff",
        label: "创建 route",
        name: "describe",
        params: null,

        sort: 0,
        type: "block",
      },
      displayLabel: "beforeEach",
      children: [
        {
          instanceId: "604979fd1e932",

          name: "visit",

          params: ["/visual-builder"],

          sort: 0,
          type: "command",
        },
        {
          instanceId: "604979fd4871e",

          name: "setLanguage",

          params: ["zh"],

          sort: 2,
          type: "command",
        },
        {
          instanceId: "604979fd50c52",

          name: "login",
          params: null,

          sort: 1,
          type: "command",
        },
      ],
    } as TreeNodeItemData;

    const parentData = {
      name: "describe",
      instanceId: "604979fc8fdff",
      label: "new describe",
      type: "block",
    } as TreeNodeItemData;

    const treeData = [
      {
        name: "describe: 创建 route",
        key: "604979fc8fdff",
        icon: {
          lib: "fa",
          icon: "bookmark",
          color: "var(--palette-cyan-6)",
        },
        data: {
          instanceId: "604979fc8fdff",
          label: "创建 route",

          name: "describe",

          params: null,

          sort: 0,
          type: "block",

          isChainChild: false,
          parent: {
            instanceId: "604974ed4c14e",
            label: "测试",

            name: "demo-test",
            params: null,

            type: "suite",
          },
          displayLabel: "describe: 创建 route",
          children: [
            {
              instanceId: "604979fcf4e66",

              name: "beforeEach",

              params: null,

              sort: 0,
              type: "block",
            },
            {
              instanceId: "604979fcf58f2",
              label: "should work with case 1",

              name: "it",

              params: null,

              sort: 1,
              type: "block",
            },
          ],
        },
        children: [
          {
            name: "beforeEach",
            key: "604979fcf4e66",
            icon: {
              lib: "fa",
              icon: "bookmark",
              color: "var(--palette-cyan-6)",
            },
            data: {
              instanceId: "604979fcf4e66",
              name: "beforeEach",
              params: null,
              sort: 0,
              type: "block",
              isChainChild: false,
              parent: {
                instanceId: "604979fc8fdff",
                label: "创建 route",
                name: "describe",
                params: null,
                sort: 0,
                type: "block",
              },
              displayLabel: "beforeEach",
              children: [
                {
                  instanceId: "604979fd1e932",
                  name: "visit",
                  params: ["/visual-builder"],
                  sort: 0,
                  type: "command",
                },
                {
                  instanceId: "604979fd4871e",
                  name: "setLanguage",
                  params: ["zh"],
                  sort: 2,
                  type: "command",
                },
                {
                  instanceId: "604979fd50c52",
                  name: "login",
                  sort: 1,
                  type: "command",
                },
              ],
            },
            children: [
              {
                name: "visit: /visual-builder",
                key: "604979fd1e932",
                icon: {
                  color: "var(--palette-teal-6)",
                  lib: "fa",
                  prefix: "far",
                  icon: "compass",
                },
                data: {
                  instanceId: "604979fd1e932",
                  name: "visit",
                  params: ["/visual-builder"],
                  sort: 0,
                  type: "command",
                  isChainChild: false,
                  parent: {
                    instanceId: "604979fcf4e66",
                    name: "beforeEach",
                    params: null,
                    sort: 0,
                    type: "block",
                  },
                  displayLabel: "visit: /visual-builder",
                  children: [],
                },
                children: [],
              },
              {
                name: "login",
                key: "604979fd50c52",
                icon: {
                  color: "var(--palette-yellow-6)",
                  lib: "fa",
                  icon: "sign-in-alt",
                },
                data: {
                  instanceId: "604979fd50c52",
                  name: "login",
                  params: null,
                  sort: 1,
                  type: "command",
                  isChainChild: false,
                  parent: {
                    instanceId: "604979fcf4e66",
                    name: "beforeEach",
                    params: null,
                    sort: 0,
                    type: "block",
                  },
                  displayLabel: "login",
                  children: [],
                },
                children: [],
              },
              {
                name: "setLanguage: zh",
                key: "604979fd4871e",
                icon: {
                  color: "var(--palette-yellow-6)",
                  lib: "fa",
                  icon: "language",
                },
                data: {
                  instanceId: "604979fd4871e",
                  name: "setLanguage",
                  org: 8888,
                  params: ["zh"],
                  sort: 2,
                  type: "command",
                  isChainChild: false,
                  parent: {
                    instanceId: "604979fcf4e66",
                    name: "beforeEach",
                    org: 8888,
                    params: null,
                    sort: 0,
                    type: "block",
                  },
                  displayLabel: "setLanguage: zh",
                  children: [],
                },
                children: [],
              },
            ],
          },
          {
            name: "it: should work with case 1",
            key: "604979fcf58f2",
            icon: {
              lib: "fa",
              icon: "bookmark",
              color: "var(--palette-cyan-6)",
            },
            data: {
              creator: "easyops",
              ctime: "2023-09-05 15:32:08",
              deleteAuthorizers: [],
              instanceId: "604979fcf58f2",
              label: "should work with case 1",
              name: "it",
              params: null,
              sort: 1,
              type: "block",
              isChainChild: false,
              parent: {
                instanceId: "604979fc8fdff",
                label: "创建 route",
                name: "describe",
                params: null,
                sort: 0,
                type: "block",
              },
              displayLabel: "it: should work with case 1",
              children: [
                {
                  instanceId: "604979fd17b0b",
                  name: "get",
                  params: ["cutomTitle"],
                  sort: null,
                  type: "command",
                },
                {
                  instanceId: "604979fd1e4e6",
                  name: "contains",
                  params: ["创建"],
                  sort: null,
                  type: "command",
                },
              ],
            },
            children: [
              {
                name: "get: cutomTitle",
                key: "604979fd17b0b",
                icon: {
                  lib: "antd",
                  icon: "aim",
                  color: "var(--palette-blue-6)",
                },
                data: {
                  instanceId: "604979fd17b0b",
                  name: "get",
                  params: ["cutomTitle"],
                  sort: null,
                  type: "command",
                  isChainChild: false,
                  parent: {
                    instanceId: "604979fcf58f2",
                    label: "should work with case 1",
                    name: "it",
                    org: 8888,
                    params: null,
                    sort: 1,
                    type: "block",
                  },
                  displayLabel: "get: cutomTitle",
                  children: [
                    {
                      instanceId: "604979fd65152",
                      name: "click",
                      params: [],
                      sort: 3,
                      type: "command",
                    },
                    {
                      instanceId: "604979fd6c42b",
                      name: "should:not.be.empty",
                      params: null,
                      sort: 1,
                      type: "command",
                    },
                    {
                      instanceId: "604979fd723de",

                      name: "as",

                      params: ["title"],

                      sort: 0,
                      type: "command",
                    },
                    {
                      instanceId: "604979fd72442",

                      name: "should:be.within",

                      params: [1, 2],

                      sort: 2,
                      type: "command",
                    },
                  ],
                },
                children: [
                  {
                    name: "as: title",
                    key: "604979fd723de",
                    icon: {
                      color: "var(--palette-blue-6)",
                      lib: "fa",
                      icon: "at",
                    },
                    data: {
                      instanceId: "604979fd723de",

                      name: "as",

                      params: ["title"],

                      sort: 0,
                      type: "command",

                      isChainChild: true,
                      parent: {
                        instanceId: "604979fd17b0b",

                        name: "get",

                        params: ["cutomTitle"],

                        type: "command",
                      },
                      displayLabel: "as: title",
                      children: [],
                    },
                    children: [],
                  },
                ],
              },
              {
                name: "contains: 创建",
                key: "604979fd1e4e6",
                icon: {
                  lib: "antd",
                  icon: "aim",
                  color: "var(--palette-blue-6)",
                },
                data: {
                  instanceId: "604979fd1e4e6",
                  name: "contains",
                  params: ["创建"],
                  type: "command",
                  isChainChild: false,
                  parent: {
                    instanceId: "604979fcf58f2",
                    label: "should work with case 1",
                    name: "it",
                    org: 8888,
                    params: null,
                    sort: 1,
                    type: "block",
                  },
                  displayLabel: "contains: 创建",
                  children: [
                    {
                      instanceId: "604979fd88116",
                      name: "should:be.true",
                      org: 8888,
                      params: null,
                      type: "command",
                    },
                  ],
                },
                children: [
                  {
                    name: "should:be.true",
                    key: "604979fd88116",
                    icon: {
                      lib: "fa",
                      icon: "spell-check",
                      color: "var(--palette-green-6)",
                    },
                    data: {
                      instanceId: "604979fd88116",
                      name: "should:be.true",
                      params: null,
                      type: "command",
                      isChainChild: true,
                      parent: {
                        instanceId: "604979fd1e4e6",
                        name: "contains",
                        params: ["创建"],
                        type: "command",
                      },
                      displayLabel: "should:be.true",
                      children: [],
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ] as TestTreeData[];

    await cloneNodes(clonedData, parentData, treeData);

    expect(createInstanceSdk).toBeCalledTimes(4);

    expect(createInstanceSdk.mock.calls[0][1]).toEqual({
      name: "beforeEach",
      params: null,
      parent: "604979fc8fdff",
      sort: 0,
      type: "block",
    });

    expect(createInstanceSdk.mock.calls[1][1]).toEqual({
      name: "visit",
      params: ["/visual-builder"],
      parent: undefined,
      sort: 0,
      type: "command",
    });
  });
});
