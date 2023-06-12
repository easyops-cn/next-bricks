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
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "name": "a-child-1",
                },
                Object {
                  "name": "a-child-2",
                },
              ],
              "name": "a",
              "path": "a",
            },
            Object {
              "children": Array [
                Object {
                  "name": "b",
                  "path": "a/b",
                },
                Object {
                  "children": Array [
                    Object {
                      "name": "c",
                      "path": "a/b/c",
                    },
                  ],
                  "data": Object {
                    "$key": "a/b/c",
                    "isContainer": true,
                  },
                  "icon": Object {
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
                Object {
                  "name": "e",
                  "path": "a/b",
                },
              ],
              "data": Object {
                "$key": "a/b",
                "isContainer": true,
              },
              "icon": Object {
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
          "data": Object {
            "$key": "a",
            "isContainer": true,
          },
          "icon": Object {
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
        Object {
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
