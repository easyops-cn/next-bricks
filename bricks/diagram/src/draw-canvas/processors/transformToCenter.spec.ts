import { describe, test, expect } from "@jest/globals";
import { transformToCenter } from "./transformToCenter";
import type { Cell } from "../interfaces";

describe("transformToCenter", () => {
  const cells = [
    {
      view: {
        width: 120,
        height: 100,
        x: 90,
        y: -50,
      },
    },
    {
      view: {
        width: 120,
        height: 100,
        x: -60,
        y: 150,
      },
    },
    {
      view: {
        width: 120,
        height: 100,
        x: 140,
        y: 150,
      },
    },
  ] as Cell[];

  test("without scale range", () => {
    const transform = transformToCenter(cells, {
      canvasWidth: 600,
      canvasHeight: 400,
    });
    expect(transform).toEqual({ x: 200, y: 100, k: 1 });
  });

  test("with scale range", () => {
    const transform = transformToCenter(cells, {
      canvasWidth: 300,
      canvasHeight: 240,
      scaleRange: [0.5, 2],
    });
    expect(transform).toEqual({ x: 70, y: 40, k: 0.8 });
  });

  test("with scale range (height not enough)", () => {
    const transform = transformToCenter(cells, {
      canvasWidth: 600,
      canvasHeight: 180,
      scaleRange: [0.5, 2],
    });
    expect(transform).toEqual({ x: 240, y: 30, k: 0.6 });
  });

  test("empty cells", () => {
    const transform = transformToCenter([], {
      canvasWidth: 600,
      canvasHeight: 400,
      scaleRange: [0.5, 2],
    });
    expect(transform).toEqual({ x: 0, y: 0, k: 1 });
  });
});
