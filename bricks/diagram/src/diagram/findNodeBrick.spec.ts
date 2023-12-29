import { findNodeBrick } from "./findNodeBrick";
import { GraphViewNodeBrick, GraphNode } from "../interfaces";

describe("findNodeBrick", () => {
  it.each<[GraphNode, Pick<GraphViewNodeBrick, "nodeType" | "if">[], number]>([
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
    expect(findNodeBrick(node, nodeBricks as GraphViewNodeBrick[])).toBe(
      nodeBricks[brickIndex]
    );
  });
});
