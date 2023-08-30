import { describe, test, expect } from "@jest/globals";
import { GraphData, getTreeData } from "./get-tree-data.js";
import { CommandDoc } from "../interface.js";

describe("getTreeData", () => {
  test.each([
    [
      {
        topic_vertices: [
          {
            instanceId: "603a85a03c2c6",
            label: "demo app",
            name: "suite",
            params: null,
            type: "suite",
          },
        ],
        vertices: [
          {
            instanceId: "603a85ccfb595",
            label: "should work",
            name: "it",
            params: null,
            type: "block",
          },
          {
            instanceId: "603ab42f8eae9",
            label: null,
            name: "beforeEach",
            params: null,
            type: "block",
          },
          {
            instanceId: "603a8bb21c8e6",
            label: null,
            name: "code",
            params: ["console.log(1323)"],
            type: "command",
          },
          {
            instanceId: "603aabdd6d6cd",
            label: null,
            name: "get",
            params: [".selector", { timeout: 1e4 }],
            type: "command",
          },
          {
            instanceId: "603ab463e5d3e",
            label: null,
            name: "code",
            params: null,
            type: "command",
          },
          {
            instanceId: "603aac31912bd",
            label: null,
            name: "type",
            params: null,
            type: "command",
          },
          {
            instanceId: "603aac508c916",
            label: null,
            name: "click",
            params: null,
            type: "command",
          },
          {
            instanceId: "603aac508c917",
            label: null,
            name: "should:exist",
            params: null,
            type: "command",
          },
        ],
        edges: [
          {
            out: "603a85ccfb595",
            in: "603a85a03c2c6",
            out_name: "children",
            properties: null,
          },
          {
            out: "603ab42f8eae9",
            in: "603a85a03c2c6",
            out_name: "children",
            properties: null,
          },
          {
            out: "603a8bb21c8e6",
            in: "603a85ccfb595",
            out_name: "children",
            properties: null,
          },
          {
            out: "603aabdd6d6cd",
            in: "603a85ccfb595",
            out_name: "children",
            properties: null,
          },
          {
            out: "603ab463e5d3e",
            in: "603ab42f8eae9",
            out_name: "children",
            properties: null,
          },
          {
            out: "603aac31912bd",
            in: "603aabdd6d6cd",
            out_name: "children",
            properties: null,
          },
          {
            out: "603aac508c916",
            in: "603aabdd6d6cd",
            out_name: "children",
            properties: null,
          },
          {
            out: "603aac508c917",
            in: "603aac508c916",
            out_name: "children",
            properties: null,
          },
        ],
      },
      [
        {
          name: "code",
          category: "other",
          chain: "dual",
          from: "custom",
          params: [
            {
              label: "Source",
              required: true,
              type: "string",
            },
          ],
          icon: {
            lib: "fa",
            icon: "code",
          },
        },
        {
          name: "get",
          description: "获取元素",
          category: "query",
          from: "cypress",
          chain: "parent",
        },
        {
          name: "type",
          description: "输入内容",
          category: "action",
          from: "cypress",
          chain: "child",
        },
        {
          name: "click",
          description: "点击",
          category: "action",
          from: "cypress",
          chain: "child",
        },
        {
          name: "should:exist",
          category: "assertion",
          from: "cypress",
          chain: "child",
        },
      ],
      {
        children: [
          {
            children: [
              {
                children: [],
                data: {
                  instanceId: "603a8bb21c8e6",
                  isChainChild: false,
                  label: null,
                  name: "code",
                  params: ["console.log(1323)"],
                  parent: {
                    instanceId: "603a85ccfb595",
                    label: "should work",
                    name: "it",
                    params: null,
                    type: "block",
                  },
                  type: "command",
                },
                icon: {
                  color: "var(--palette-yellow-6)",
                  icon: "code",
                  lib: "fa",
                },
                key: "603a8bb21c8e6",
                name: "code: console.log(1323)",
              },
              {
                children: [
                  {
                    children: [],
                    data: {
                      instanceId: "603aac31912bd",
                      isChainChild: true,
                      label: null,
                      name: "type",
                      params: null,
                      parent: {
                        instanceId: "603aabdd6d6cd",
                        label: null,
                        name: "get",
                        params: [".selector", { timeout: 1e4 }],
                        type: "command",
                      },
                      type: "command",
                    },
                    icon: {
                      color: "var(--palette-red-6)",
                      lib: "fa",
                      icon: "computer-mouse",
                    },
                    key: "603aac31912bd",
                    name: "type",
                  },
                  {
                    children: [
                      {
                        children: [],
                        data: {
                          instanceId: "603aac508c917",
                          isChainChild: true,
                          label: null,
                          name: "should:exist",
                          params: null,
                          parent: {
                            instanceId: "603aac508c916",
                            label: null,
                            name: "click",
                            params: null,
                            type: "command",
                          },
                          type: "command",
                        },
                        icon: {
                          color: "var(--palette-green-6)",
                          icon: "spell-check",
                          lib: "fa",
                        },
                        key: "603aac508c917",
                        name: "should:exist",
                      },
                    ],
                    data: {
                      instanceId: "603aac508c916",
                      isChainChild: true,
                      label: null,
                      name: "click",
                      params: null,
                      parent: {
                        instanceId: "603aabdd6d6cd",
                        label: null,
                        name: "get",
                        params: [".selector", { timeout: 1e4 }],
                        type: "command",
                      },
                      type: "command",
                    },
                    icon: {
                      color: "var(--palette-red-6)",
                      lib: "fa",
                      icon: "computer-mouse",
                    },
                    key: "603aac508c916",
                    name: "click",
                  },
                ],
                data: {
                  instanceId: "603aabdd6d6cd",
                  isChainChild: false,
                  label: null,
                  name: "get",
                  params: [".selector", { timeout: 1e4 }],
                  parent: {
                    instanceId: "603a85ccfb595",
                    label: "should work",
                    name: "it",
                    params: null,
                    type: "block",
                  },
                  type: "command",
                },
                icon: {
                  color: "var(--palette-blue-6)",
                  icon: "aim",
                  lib: "antd",
                },
                key: "603aabdd6d6cd",
                name: "get: .selector",
              },
            ],
            data: {
              instanceId: "603a85ccfb595",
              isChainChild: false,
              label: "should work",
              name: "it",
              params: null,
              parent: {
                instanceId: "603a85a03c2c6",
                label: "demo app",
                name: "suite",
                params: null,
                type: "suite",
              },
              type: "block",
            },
            icon: {
              color: "var(--palette-cyan-6)",
              icon: "bookmark",
              lib: "fa",
            },
            key: "603a85ccfb595",
            name: "it: should work",
          },
          {
            children: [
              {
                children: [],
                data: {
                  instanceId: "603ab463e5d3e",
                  isChainChild: false,
                  label: null,
                  name: "code",
                  params: null,
                  parent: {
                    instanceId: "603ab42f8eae9",
                    label: null,
                    name: "beforeEach",
                    params: null,
                    type: "block",
                  },
                  type: "command",
                },
                icon: {
                  color: "var(--palette-yellow-6)",
                  icon: "code",
                  lib: "fa",
                },
                key: "603ab463e5d3e",
                name: "code",
              },
            ],
            data: {
              instanceId: "603ab42f8eae9",
              isChainChild: false,
              label: null,
              name: "beforeEach",
              params: null,
              parent: {
                instanceId: "603a85a03c2c6",
                label: "demo app",
                name: "suite",
                params: null,
                type: "suite",
              },
              type: "block",
            },
            icon: {
              color: "var(--palette-cyan-6)",
              icon: "bookmark",
              lib: "fa",
            },
            key: "603ab42f8eae9",
            name: "beforeEach",
          },
        ],
        data: {
          instanceId: "603a85a03c2c6",
          label: "demo app",
          name: "suite",
          params: null,
          type: "suite",
        },
        icon: {
          color: "var(--palette-purple-6)",
          icon: "vial",
          lib: "fa",
        },
        key: "603a85a03c2c6",
        name: "suite",
      },
    ],
  ])("should work", (GraphData, commandDocs, result) => {
    expect(
      getTreeData(GraphData as GraphData, commandDocs as CommandDoc[])
    ).toEqual(result);
  });
});
