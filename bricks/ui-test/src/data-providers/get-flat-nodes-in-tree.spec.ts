import { describe, test, expect } from "@jest/globals";
import { getFlatNodesInTree } from "./get-flat-nodes-in-tree.js";

describe("getFlatNodesInTree", () => {
  test("should work", async () => {
    expect(
      await getFlatNodesInTree({
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
          nextChildSort: 2,
          type: "suite",
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
              sort: 0,
              nextChildSort: 2,
              parent: {
                instanceId: "603a85a03c2c6",
                label: "demo app",
                name: "suite",
                params: null,
                type: "suite",
              },
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
                  sort: 0,
                  nextChildSort: 0,
                  parent: {
                    instanceId: "603a85ccfb595",
                    label: "should work",
                    name: "it",
                    params: null,
                    type: "block",
                  },
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
                  sort: 1,
                  nextChildSort: 2,
                  parent: {
                    instanceId: "603a85ccfb595",
                    label: "should work",
                    name: "it",
                    params: null,
                    type: "block",
                  },
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
                      nextChildSort: 0,
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
                      nextChildSort: 1,
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
                          nextChildSort: 0,
                          parent: {
                            instanceId: "603aac508c916",
                            label: null,
                            name: "click",
                            params: null,
                            type: "command",
                          },
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
              nextChildSort: 1,
              sort: 1,
              isChainChild: false,
              parent: {
                instanceId: "603a85a03c2c6",
                label: "demo app",
                name: "suite",
                params: null,
                type: "suite",
              },
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
                  nextChildSort: 0,
                  parent: {
                    instanceId: "603ab42f8eae9",
                    label: null,
                    name: "beforeEach",
                    params: null,
                    type: "block",
                  },
                  children: [],
                },
                children: [],
              },
            ],
          },
        ],
      } as any)
    ).toMatchInlineSnapshot(`
[
  {
    "display": "suite",
    "initialSort": 2,
    "instanceId": "603a85a03c2c6",
    "type": "suite",
  },
  {
    "display": "it: should work",
    "initialSort": 2,
    "instanceId": "603a85ccfb595",
    "type": "block",
  },
  {
    "display": "code: console.log(1323)",
    "initialSort": 0,
    "instanceId": "603a8bb21c8e6",
    "type": "command",
  },
  {
    "display": "get: .selector",
    "initialSort": 2,
    "instanceId": "603aabdd6d6cd",
    "type": "command",
  },
  {
    "display": "type",
    "initialSort": 0,
    "instanceId": "603aac31912bd",
    "type": "command",
  },
  {
    "display": "click",
    "initialSort": 1,
    "instanceId": "603aac508c916",
    "type": "command",
  },
  {
    "display": "should:exist",
    "initialSort": 0,
    "instanceId": "603aac508c917",
    "type": "command",
  },
  {
    "display": "beforeEach",
    "initialSort": 1,
    "instanceId": "603ab42f8eae9",
    "type": "block",
  },
  {
    "display": "code",
    "initialSort": 0,
    "instanceId": "603ab463e5d3e",
    "type": "command",
  },
]
`);
  });
});
