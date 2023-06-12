import { WorkbenchNodeData } from "../interfaces.js";
import {
  getNodeTreeByPath,
  getNodesByPathTree,
} from "./normalizeTreeNodeWithPath.js";

describe("normalizeTreeNodeWithPath", () => {
  it("getNodeTreeByPath should work", () => {
    const mockData = [
      {
        name: "a",
        path: "a",
        children: [
          {
            name: "a-child-1",
          },
          {
            name: "a-child-2",
          },
        ],
      },
      {
        name: "b",
        path: "a/b",
      },
      {
        name: "c",
        path: "a/b/c",
      },
      {
        name: "d",
      },
      {
        name: "e",
        path: "a/b",
      },
    ] as WorkbenchNodeData[];
    expect(getNodeTreeByPath(mockData, "$key")).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "name": "a-child-1",
                },
                {
                  "name": "a-child-2",
                },
              ],
              "name": "a",
              "path": "a",
            },
            {
              "children": [
                {
                  "name": "b",
                  "path": "a/b",
                },
                {
                  "children": [
                    {
                      "name": "c",
                      "path": "a/b/c",
                    },
                  ],
                  "data": {
                    "$key": "a/b/c",
                    "isContainer": true,
                  },
                  "icon": {
                    "color": "orange",
                    "icon": "folder",
                    "lib": "antd",
                    "theme": "filled",
                  },
                  "isContainer": true,
                  "key": "a/b/c",
                  "name": "c",
                  "originKey": undefined,
                  "parentPath": "a/b",
                },
                {
                  "name": "e",
                  "path": "a/b",
                },
              ],
              "data": {
                "$key": "a/b",
                "isContainer": true,
              },
              "icon": {
                "color": "orange",
                "icon": "folder",
                "lib": "antd",
                "theme": "filled",
              },
              "isContainer": true,
              "key": "a/b",
              "name": "b",
              "originKey": undefined,
              "parentPath": "a",
            },
          ],
          "data": {
            "$key": "a",
            "isContainer": true,
          },
          "icon": {
            "color": "orange",
            "icon": "folder",
            "lib": "antd",
            "theme": "filled",
          },
          "isContainer": true,
          "key": "a",
          "name": "a",
          "originKey": undefined,
          "parentPath": "",
        },
        {
          "name": "d",
        },
      ]
    `);
  });

  it("getNodesByPathTree should work", () => {
    const mockData = [
      {
        name: "a-1",
      },
      {
        name: "a",
        path: "a",
        isContainer: true,
        children: [
          {
            name: "b",
            isContainer: true,
            children: [
              {
                name: "a",
              },
            ],
          },
          {
            name: "b",
          },
        ],
      },
      {
        name: "c",
      },
      {
        name: "d",
      },
      {
        name: "e",
        isContainer: true,
        children: [
          {
            name: "e",
          },
        ],
      },
    ] as WorkbenchNodeData[];
    expect(getNodesByPathTree(mockData)).toStrictEqual([
      { name: "a-1" },
      { name: "a" },
      { name: "b" },
      { name: "c" },
      { name: "d" },
      { name: "e" },
    ]);
  });
});
