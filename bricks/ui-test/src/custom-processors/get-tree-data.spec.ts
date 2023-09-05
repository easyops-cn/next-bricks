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
        name: "suite",
        key: "603a85a03c2c6",
        icon: {
          lib: "fa",
          icon: "vial",
          color: "var(--palette-purple-6)",
        },
        data: {
          instanceId: "603a85a03c2c6",
          label: "demo app",
          name: "suite",
          params: null,
          type: "suite",
          displayLabel: "suite",
          children: [
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
          ],
        },
        children: [
          {
            name: "it: should work",
            key: "603a85ccfb595",
            icon: {
              lib: "fa",
              icon: "bookmark",
              color: "var(--palette-cyan-6)",
            },
            data: {
              instanceId: "603a85ccfb595",
              label: "should work",
              name: "it",
              params: null,
              type: "block",
              isChainChild: false,
              parent: {
                instanceId: "603a85a03c2c6",
                label: "demo app",
                name: "suite",
                params: null,
                type: "suite",
              },
              displayLabel: "it: should work",
              children: [
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
                  params: [
                    ".selector",
                    {
                      timeout: 10000,
                    },
                  ],
                  type: "command",
                },
              ],
            },
            children: [
              {
                name: "code: console.log(1323)",
                key: "603a8bb21c8e6",
                icon: {
                  color: "var(--palette-yellow-6)",
                  lib: "fa",
                  icon: "code",
                },
                data: {
                  instanceId: "603a8bb21c8e6",
                  label: null,
                  name: "code",
                  params: ["console.log(1323)"],
                  type: "command",
                  isChainChild: false,
                  parent: {
                    instanceId: "603a85ccfb595",
                    label: "should work",
                    name: "it",
                    params: null,
                    type: "block",
                  },
                  displayLabel: "code: console.log(1323)",
                  children: [],
                },
                children: [],
              },
              {
                name: "get: .selector",
                key: "603aabdd6d6cd",
                icon: {
                  lib: "antd",
                  icon: "aim",
                  color: "var(--palette-blue-6)",
                },
                data: {
                  instanceId: "603aabdd6d6cd",
                  label: null,
                  name: "get",
                  params: [
                    ".selector",
                    {
                      timeout: 10000,
                    },
                  ],
                  type: "command",
                  isChainChild: false,
                  parent: {
                    instanceId: "603a85ccfb595",
                    label: "should work",
                    name: "it",
                    params: null,
                    type: "block",
                  },
                  displayLabel: "get: .selector",
                  children: [
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
                  ],
                },
                children: [
                  {
                    name: "type",
                    key: "603aac31912bd",
                    icon: {
                      lib: "fa",
                      icon: "computer-mouse",
                      color: "var(--palette-red-6)",
                    },
                    data: {
                      instanceId: "603aac31912bd",
                      label: null,
                      name: "type",
                      params: null,
                      type: "command",
                      isChainChild: true,
                      parent: {
                        instanceId: "603aabdd6d6cd",
                        label: null,
                        name: "get",
                        params: [
                          ".selector",
                          {
                            timeout: 10000,
                          },
                        ],
                        type: "command",
                      },
                      displayLabel: "type",
                      children: [],
                    },
                    children: [],
                  },
                  {
                    name: "click",
                    key: "603aac508c916",
                    icon: {
                      lib: "fa",
                      icon: "computer-mouse",
                      color: "var(--palette-red-6)",
                    },
                    data: {
                      instanceId: "603aac508c916",
                      label: null,
                      name: "click",
                      params: null,
                      type: "command",
                      isChainChild: true,
                      parent: {
                        instanceId: "603aabdd6d6cd",
                        label: null,
                        name: "get",
                        params: [
                          ".selector",
                          {
                            timeout: 10000,
                          },
                        ],
                        type: "command",
                      },
                      displayLabel: "click",
                      children: [
                        {
                          instanceId: "603aac508c917",
                          label: null,
                          name: "should:exist",
                          params: null,
                          type: "command",
                        },
                      ],
                    },
                    children: [
                      {
                        name: "should:exist",
                        key: "603aac508c917",
                        icon: {
                          lib: "fa",
                          icon: "spell-check",
                          color: "var(--palette-green-6)",
                        },
                        data: {
                          instanceId: "603aac508c917",
                          label: null,
                          name: "should:exist",
                          params: null,
                          type: "command",
                          isChainChild: true,
                          parent: {
                            instanceId: "603aac508c916",
                            label: null,
                            name: "click",
                            params: null,
                            type: "command",
                          },
                          displayLabel: "should:exist",
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
          {
            name: "beforeEach",
            key: "603ab42f8eae9",
            icon: {
              lib: "fa",
              icon: "bookmark",
              color: "var(--palette-cyan-6)",
            },
            data: {
              instanceId: "603ab42f8eae9",
              label: null,
              name: "beforeEach",
              params: null,
              type: "block",
              isChainChild: false,
              parent: {
                instanceId: "603a85a03c2c6",
                label: "demo app",
                name: "suite",
                params: null,
                type: "suite",
              },
              displayLabel: "beforeEach",
              children: [
                {
                  instanceId: "603ab463e5d3e",
                  label: null,
                  name: "code",
                  params: null,
                  type: "command",
                },
              ],
            },
            children: [
              {
                name: "code",
                key: "603ab463e5d3e",
                icon: {
                  color: "var(--palette-yellow-6)",
                  lib: "fa",
                  icon: "code",
                },
                data: {
                  instanceId: "603ab463e5d3e",
                  label: null,
                  name: "code",
                  params: null,
                  type: "command",
                  isChainChild: false,
                  parent: {
                    instanceId: "603ab42f8eae9",
                    label: null,
                    name: "beforeEach",
                    params: null,
                    type: "block",
                  },
                  displayLabel: "code",
                  children: [],
                },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  ])("should work", (GraphData, commandDocs, result) => {
    expect(
      getTreeData(GraphData as GraphData, commandDocs as CommandDoc[])
    ).toEqual(result);
  });
});
