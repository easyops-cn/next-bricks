import { describe, test, expect } from "@jest/globals";
import { findNodeBrick } from "./findNodeBrick";
import { NodeBrickConf, DiagramNode } from "../interfaces";

describe("findNodeBrick", () => {
  test.each<
    [
      node: DiagramNode,
      nodeBricks: Pick<NodeBrickConf, "nodeType" | "if">[],
      brickIndex: number,
    ]
  >([
    [
      {
        id: "1",
        type: "good",
      },
      [
        {
          nodeType: "bad",
        },
        {
          nodeType: "good",
        },
      ],
      1,
    ],
    [
      {
        id: "1",
        type: "good",
      },
      [
        {
          nodeType: "bad",
        },
        {
          nodeType: ["good"],
        },
      ],
      1,
    ],
    [
      {
        id: "1",
        type: "good",
      },
      [
        {
          if: '@{node.type | equal: "bad"}',
        },
        {
          if: '@{node.type | equal: "good"}',
        },
      ],
      1,
    ],
    [
      {
        id: "1",
        type: "good",
      },
      [
        {
          if: null,
        },
        {
          if: "yes",
        },
      ],
      1,
    ],
  ])("findNodeBrick(%j, %j) should work", (node, nodeBricks, brickIndex) => {
    expect(findNodeBrick(node, nodeBricks as NodeBrickConf[])).toBe(
      nodeBricks[brickIndex]
    );
  });
});
