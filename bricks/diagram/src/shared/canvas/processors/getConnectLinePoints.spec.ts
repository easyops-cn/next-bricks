import { describe, test, expect } from "@jest/globals";
import { getConnectLinePoints } from "./getConnectLinePoints";
import type { SmartConnectLineState } from "../../../draw-canvas/interfaces";
import type { HoverState } from "../../../draw-canvas/HoverStateContext";

describe("getConnectLinePoints", () => {
  const state = {
    source: {
      view: {
        x: 100,
        y: 200,
        width: 80,
        height: 60,
      },
    },
    exitPosition: { x: 0.5, y: 0.5 },
  } as SmartConnectLineState;

  test("null inputs", () => {
    expect(getConnectLinePoints(null, null, null)).toBe(null);
  });

  test("hoverState.activePointIndex is defined", () => {
    expect(
      getConnectLinePoints(
        state,
        null,
        {
          cell: {
            view: {
              x: 200,
              y: 300,
              width: 80,
              height: 60,
            },
          },
          relativePoints: [
            { x: 0.5, y: 0.5, d: ["right", "top", "left", "bottom"] },
          ],
          activePointIndex: 0,
          points: [],
        } as unknown as HoverState,
        { type: "polyline" }
      )
    ).toEqual([
      { x: 180, y: 230 },
      { x: 240, y: 230 },
      { x: 240, y: 300 },
    ]);
  });

  test("connectLineTo is above source", () => {
    expect(
      getConnectLinePoints(state, [150, 100], null, { type: "polyline" })
    ).toEqual([
      { x: 180, y: 230 },
      { x: 200, y: 230 },
      { x: 200, y: 150 },
      { x: 150, y: 150 },
      { x: 150, y: 100 },
    ]);
  });

  test("connectLineTo is below source", () => {
    expect(
      getConnectLinePoints(state, [150, 400], null, { type: "polyline" })
    ).toEqual([
      { x: 180, y: 230 },
      { x: 200, y: 230 },
      { x: 200, y: 330 },
      { x: 150, y: 330 },
      { x: 150, y: 400 },
    ]);
  });

  test("connectLineTo is left of source", () => {
    expect(
      getConnectLinePoints(
        { ...state, exitPosition: { x: 0, y: 0.5 } },
        [10, 220],
        null,
        { type: "polyline" }
      )
    ).toEqual([
      { x: 100, y: 230 },
      { x: 55, y: 230 },
      { x: 55, y: 220 },
      { x: 10, y: 220 },
    ]);
  });

  test("connectLineTo is right of source", () => {
    expect(
      getConnectLinePoints(state, [300, 240], null, { type: "polyline" })
    ).toEqual([
      { x: 180, y: 230 },
      { x: 240, y: 230 },
      { x: 240, y: 240 },
      { x: 300, y: 240 },
    ]);
  });
});
