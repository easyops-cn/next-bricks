import { describe, test, expect } from "@jest/globals";
import { getCenterOffsets } from "./getCenterOffsets";
import type { RenderedNode } from "../interfaces";

describe("getCenterOffsets", () => {
  test("basic usage", () => {
    const offsets = getCenterOffsets(
      [
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
      ] as RenderedNode[],
      [600, 400]
    );
    expect(offsets).toEqual([190, 110]);
  });
});
