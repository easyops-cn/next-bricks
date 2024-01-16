import { describe, test, expect } from "@jest/globals";
import { transformToCenter } from "./transformToCenter";
import type { RenderedNode } from "../interfaces";

describe("transformToCenter", () => {
  const renderedNodes = [
    {
      width: 120,
      height: 100,
      x: 150,
      y: 0,
    },
    {
      width: 120,
      height: 100,
      x: 0,
      y: 200,
    },
    {
      width: 120,
      height: 100,
      x: 200,
      y: 200,
    },
  ] as RenderedNode[];

  test("without scale range", () => {
    const transform = transformToCenter(renderedNodes, {
      canvasWidth: 600,
      canvasHeight: 400,
    });
    expect(transform).toEqual({ x: 200, y: 100, k: 1 });
  });

  test("with scale range", () => {
    const transform = transformToCenter(renderedNodes, {
      canvasWidth: 300,
      canvasHeight: 240,
      scaleRange: [0.5, 2],
    });
    expect(transform).toEqual({ x: 82, y: 50, k: 0.8 });
  });

  test("with scale range (height not enough)", () => {
    const transform = transformToCenter(renderedNodes, {
      canvasWidth: 600,
      canvasHeight: 180,
      scaleRange: [0.5, 2],
    });
    expect(transform).toEqual({ x: 264, y: 50, k: 0.6 });
  });
});
