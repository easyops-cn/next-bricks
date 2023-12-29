import { matchEdgeByFilter } from "./matchEdgeByFilter";
import type { DiagramEdge, LineConf } from "../interfaces";

describe("matchEdgeByFilter", () => {
  it.each<[DiagramEdge, LineConf, boolean]>([
    [
      {
        source: "1",
        target: "2",
        type: "good",
      },
      {
        edgeType: "bad",
      },
      false,
    ],
    [
      {
        source: "1",
        target: "2",
        type: "good",
      },
      {
        edgeType: "good",
      },
      true,
    ],
    [
      {
        source: "1",
        target: "2",
        type: "good",
      },
      {
        edgeType: ["good"],
      },
      true,
    ],
    [
      {
        source: "1",
        target: "2",
        type: "good",
      },
      {
        if: '@{edge.type | equal: "bad"}',
      },
      false,
    ],
    [
      {
        source: "1",
        target: "2",
        type: "good",
      },
      {
        if: '@{edge.type | equal: "good"}',
      },
      true,
    ],
    [
      {
        source: "1",
        target: "2",
        type: "good",
      },
      {
        if: null,
      },
      false,
    ],
    [
      {
        source: "1",
        target: "2",
        type: "good",
      },
      {
        if: "yes",
      },
      true,
    ],
  ])("matchEdgeByFilter(%j, %j) should return %j", (edge, filter, result) => {
    expect(matchEdgeByFilter(edge, filter)).toBe(result);
  });
});
