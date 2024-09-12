import { describe, test, expect } from "@jest/globals";
import { getSmartLinePoints } from "./getSmartLinePoints";

describe("getSmartLinePoints", () => {
  test("source moved with vertices", () => {
    expect(
      getSmartLinePoints(
        {
          x: 95,
          y: 206,
          width: 80,
          height: 60,
        },
        {
          x: 300,
          y: 100,
          width: 80,
          height: 60,
        },
        {
          exitPosition: { x: 1, y: 0.5 },
          entryPosition: { x: 0, y: 0.5 },
          vertices: [
            { x: 240, y: 230 },
            { x: 240, y: 130 },
          ],
        }
      )
    ).toEqual([
      { x: 175, y: 236 },
      { x: 175, y: 230 },
      { x: 240, y: 230 },
      { x: 240, y: 130 },
      { x: 300, y: 130 },
    ]);
  });

  test("target moved with vertices", () => {
    expect(
      getSmartLinePoints(
        {
          x: 100,
          y: 200,
          width: 80,
          height: 60,
        },
        {
          x: 305,
          y: 96,
          width: 80,
          height: 60,
        },
        {
          exitPosition: { x: 1, y: 0.5 },
          entryPosition: { x: 0, y: 0.5 },
          vertices: [
            { x: 240, y: 230 },
            { x: 240, y: 130 },
          ],
        }
      )
    ).toEqual([
      { x: 180, y: 230 },
      { x: 240, y: 230 },
      { x: 240, y: 130 },
      { x: 305, y: 130 },
      { x: 305, y: 126 },
    ]);
  });
});
