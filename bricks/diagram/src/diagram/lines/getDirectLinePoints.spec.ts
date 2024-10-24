import { describe, test, expect } from "@jest/globals";
import { getDirectLinePoints } from "./getDirectLinePoints";

describe("getDirectLinePoints", () => {
  const nodeA = {
    x: 200,
    y: 100,
    width: 180,
    height: 120,
  };
  const nodeB = {
    x: 100,
    y: 150,
    width: 180,
    height: 120,
  };
  const nodeC = {
    x: 420,
    y: 150,
    width: 180,
    height: 120,
  };
  const nodeD = {
    x: 420,
    y: 350,
    width: 180,
    height: 120,
  };

  test("basic usage", () => {
    expect(getDirectLinePoints(nodeA, nodeA)).toBe(null);
    expect(getDirectLinePoints(nodeA, nodeB)).toBe(null);
    expect(getDirectLinePoints(nodeA, nodeC)).toEqual([
      {
        x: 290,
        y: expect.closeTo(120.45, 2),
      },
      {
        x: 330,
        y: expect.closeTo(129.55, 2),
      },
    ]);
    expect(getDirectLinePoints(nodeB, nodeC)).toEqual([
      {
        x: 190,
        y: 150,
      },
      {
        x: 330,
        y: 150,
      },
    ]);
    expect(getDirectLinePoints(nodeC, nodeD)).toEqual([
      {
        x: 420,
        y: 210,
      },
      {
        x: 420,
        y: 290,
      },
    ]);
    expect(getDirectLinePoints(nodeD, nodeC)).toEqual([
      {
        x: 420,
        y: 290,
      },
      {
        x: 420,
        y: 210,
      },
    ]);
  });

  test("with parallel gap", () => {
    expect(getDirectLinePoints(nodeA, nodeC, 10)).toEqual([
      {
        x: 290,
        y: expect.closeTo(125.58, 2),
      },
      {
        x: 330,
        y: expect.closeTo(134.67, 2),
      },
    ]);
  });

  test("with entry and exit positions", () => {
    const edgeView = {
      exitPosition: { x: 1, y: 0.5 },
      entryPosition: { x: 0, y: 0.5 },
    };
    expect(getDirectLinePoints(nodeA, nodeC, 0, edgeView)).toEqual([
      {
        x: 290,
        y: 100,
      },
      {
        x: 330,
        y: 150,
      },
    ]);
  });
});
