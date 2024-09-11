import { describe, test, expect } from "@jest/globals";
import { getEditingLinePoints } from "./getEditingLinePoints";
import type { LineEditorState } from "../../../draw-canvas/interfaces";
import type { HoverState } from "../../../draw-canvas/HoverStateContext";

describe("getEditingLinePoints", () => {
  const state = {
    source: {
      view: {
        x: 100,
        y: 200,
        width: 80,
        height: 60,
      },
    },
    target: {
      view: {
        x: 200,
        y: 300,
        width: 80,
        height: 60,
      },
    },
    exitPosition: { x: 0.5, y: 0.5 },
  } as Omit<LineEditorState, "type">;
  const entryState: LineEditorState = {
    type: "entry",
    ...state,
  };
  const exitState: LineEditorState = {
    type: "exit",
    ...state,
  };

  test("null inputs", () => {
    expect(getEditingLinePoints(null, null, null)).toBe(null);
  });

  test("entry with hoverState.activePointIndex is defined", () => {
    expect(
      getEditingLinePoints(entryState, null, {
        relativePoints: [{ x: 0, y: 0.5 }],
        activePointIndex: 0,
        points: [],
      } as unknown as HoverState)
    ).toEqual([
      { x: 180, y: 230 },
      { x: 200, y: 230 },
      { x: 200, y: 280 },
      { x: 180, y: 280 },
      { x: 180, y: 330 },
      { x: 200, y: 330 },
    ]);
  });

  test("entry with connectLineTo", () => {
    expect(getEditingLinePoints(entryState, [150, 100], null)).toEqual([
      { x: 180, y: 230 },
      { x: 200, y: 230 },
      { x: 200, y: 150 },
      { x: 150, y: 150 },
      { x: 150, y: 100 },
    ]);
  });

  test("exit with hoverState.activePointIndex is defined", () => {
    expect(
      getEditingLinePoints(exitState, null, {
        relativePoints: [{ x: 0, y: 0.5 }],
        activePointIndex: 0,
        points: [],
      } as unknown as HoverState)
    ).toEqual([
      { x: 100, y: 230 },
      { x: 80, y: 230 },
      { x: 80, y: 280 },
      { x: 240, y: 280 },
      { x: 240, y: 300 },
    ]);
  });

  test("exit with connectLineTo", () => {
    expect(getEditingLinePoints(exitState, [150, 100], null)).toEqual([
      { x: 150, y: 100 },
      { x: 150, y: 200 },
      { x: 240, y: 200 },
      { x: 240, y: 300 },
    ]);
  });
});
