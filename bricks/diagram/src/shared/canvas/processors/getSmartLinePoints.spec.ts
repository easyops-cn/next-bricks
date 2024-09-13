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
          type: "polyline",
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
          type: "polyline",
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

  test("source moved with multiple vertices and exit position unset", () => {
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
          type: "polyline",
          entryPosition: { x: 0, y: 0.5 },
          vertices: [
            { x: 240, y: 230 },
            { x: 240, y: 130 },
          ],
        }
      )
    ).toEqual([
      { x: 175, y: 230 },
      { x: 240, y: 230 },
      { x: 240, y: 130 },
      { x: 300, y: 130 },
    ]);
  });

  test("source moved with single vertex and exit position unset", () => {
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
          type: "polyline",
          entryPosition: { x: 0, y: 0.5 },
          vertices: [{ x: 240, y: 130 }],
        }
      )
    ).toEqual([
      { x: 175, y: 236 },
      { x: 240, y: 236 },
      { x: 240, y: 130 },
      { x: 300, y: 130 },
    ]);
  });

  test("source moved with single vertex and exit and entry position unset", () => {
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
          type: "polyline",
          vertices: [{ x: 240, y: 130 }],
        }
      )
    ).toEqual([
      { x: 175, y: 236 },
      { x: 240, y: 236 },
      { x: 240, y: 130 },
      { x: 300, y: 130 },
    ]);
  });

  test("source moved with single vertex and exit and entry position unset", () => {
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
          type: "polyline",
          vertices: [{ x: 400, y: 130 }],
        }
      )
    ).toEqual([
      { x: 175, y: 236 },
      { x: 400, y: 236 },
      { x: 400, y: 130 },
      { x: 380, y: 130 },
    ]);
  });

  test("source moved with single vertex and exit and entry position unset", () => {
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
          type: "polyline",
          vertices: [{ x: 120, y: 230 }],
        }
      )
    ).toEqual([
      { x: 120, y: 230 },
      { x: 340, y: 230 },
      { x: 340, y: 160 },
    ]);
  });

  test("target moved with multiple vertices and entry position unset", () => {
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
          type: "polyline",
          exitPosition: { x: 1, y: 0.5 },
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
    ]);
  });

  test("target moved with single vertex and entry position unset", () => {
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
          type: "polyline",
          exitPosition: { x: 1, y: 0.5 },
          vertices: [{ x: 240, y: 230 }],
        }
      )
    ).toEqual([
      { x: 180, y: 230 },
      { x: 240, y: 230 },
      { x: 240, y: 126 },
      { x: 305, y: 126 },
    ]);
  });

  test("target moved with single vertex and exit and entry position unset", () => {
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
          type: "polyline",
          vertices: [{ x: 240, y: 230 }],
        }
      )
    ).toEqual([
      { x: 180, y: 230 },
      { x: 240, y: 230 },
      { x: 240, y: 126 },
      { x: 305, y: 126 },
    ]);
  });

  test("target moved with single vertex and exit and entry position unset", () => {
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
          type: "polyline",
          vertices: [{ x: 160, y: 120 }],
        }
      )
    ).toEqual([
      { x: 160, y: 200 },
      { x: 160, y: 120 },
      { x: 305, y: 120 },
    ]);
  });
});
