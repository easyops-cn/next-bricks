import { describe, test, expect } from "@jest/globals";
import { getPolyLinePoints } from "./getPolyLinePoints";
import type { RenderedNode } from "../interfaces";

describe("getPolyLinePoints", () => {
  const nodeA = {
    x: 200,
    y: 100,
    width: 180,
    height: 120,
  } as RenderedNode;
  // const nodeB = {
  //   x: 100,
  //   y: 150,
  //   width: 180,
  //   height: 120,
  // } as RenderedNode;
  const nodeC = {
    x: 420,
    y: 150,
    width: 180,
    height: 120,
  } as RenderedNode;
  const nodeD = {
    x: 420,
    y: 350,
    width: 180,
    height: 120,
  } as RenderedNode;

  test("basic usage", () => {
    expect(getPolyLinePoints(nodeA, nodeC, "right", "left", 0.5, 0.5)).toEqual([
      {
        x: 290,
        y: 100,
      },
      {
        x: 310,
        y: 100,
      },
      {
        x: 310,
        y: 150,
      },
      {
        x: 330,
        y: 150,
      },
    ]);
    expect(getPolyLinePoints(nodeC, nodeD, "bottom", "top", 0.5, 0.5)).toEqual([
      {
        x: 420,
        y: 210,
      },
      {
        x: 420,
        y: 250,
      },
      {
        x: 420,
        y: 250,
      },
      {
        x: 420,
        y: 290,
      },
    ]);
  });
});
