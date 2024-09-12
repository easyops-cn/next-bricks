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
    edge: {
      view: {
        exitPosition: { x: 0.5, y: 0.5 },
      },
    },
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

describe("getEditingLinePoints with control", () => {
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
        x: 300,
        y: 100,
        width: 80,
        height: 60,
      },
    },
    edge: {
      view: {
        exitPosition: { x: 1, y: 0.5 },
        entryPosition: { x: 0, y: 0.5 },
        vertices: [
          { x: 240, y: 230 },
          { x: 240, y: 130 },
        ],
      },
    },
    linePoints: [
      { x: 180, y: 230 },
      { x: 240, y: 230 },
      { x: 240, y: 130 },
      { x: 300, y: 130 },
    ],
  } as Omit<LineEditorState, "type">;

  test("control pull down the first control", () => {
    //               ┌─────┐
    //           ┌───┤  T  │
    // ┌─────┐   │   └─────┘
    // │  S  ├─┬─┘
    // └─────┘ ↓
    expect(
      getEditingLinePoints(
        {
          type: "control",
          ...state,
          control: { x: 210, y: 230, index: 0, direction: "ns" },
        },
        [215, 240],
        null
      )
    ).toEqual([
      { x: 180, y: 230 },
      { x: 180, y: 240 },
      { x: 240, y: 240 },
      { x: 240, y: 130 },
      { x: 300, y: 130 },
    ]);
  });

  test("control pull up the last control", () => {
    //             ↑ ┌─────┐
    //           ┌─┴─┤  T  │
    // ┌─────┐   │   └─────┘
    // │  S  ├───┘
    // └─────┘
    expect(
      getEditingLinePoints(
        {
          type: "control",
          ...state,
          control: { x: 270, y: 130, index: 2, direction: "ns" },
        },
        [265, 120],
        null
      )
    ).toEqual([
      { x: 180, y: 230 },
      { x: 240, y: 230 },
      { x: 240, y: 120 },
      { x: 300, y: 120 },
      { x: 300, y: 130 },
    ]);
  });

  test("control pull left a intermediate control", () => {
    //               ┌─────┐
    //           ┌───┤  T  │
    // ┌─────┐  ←┤   └─────┘
    // │  S  ├───┘
    // └─────┘
    expect(
      getEditingLinePoints(
        {
          type: "control",
          ...state,
          control: { x: 240, y: 180, index: 1, direction: "ew" },
        },
        [230, 179],
        null
      )
    ).toEqual([
      { x: 180, y: 230 },
      { x: 230, y: 230 },
      { x: 230, y: 130 },
      { x: 300, y: 130 },
    ]);
  });

  test("control pull left to collapse some vertices", () => {
    //               ┌─────┐
    //           ┌───┤  T  │
    // ┌─────┐←──┤   └─────┘
    // │  S  ├───┘
    // └─────┘
    expect(
      getEditingLinePoints(
        {
          type: "control",
          ...state,
          linePoints: [
            { x: 180, y: 230 },
            { x: 240, y: 230 },
            { x: 240, y: 130 },
            { x: 270, y: 130 },
            { x: 270, y: 130 },
            { x: 300, y: 130 },
          ],
          control: { x: 240, y: 180, index: 1, direction: "ew" },
        },
        [180, 179],
        null
      )
    ).toEqual([
      { x: 180, y: 230 },
      { x: 180, y: 130 },
      { x: 300, y: 130 },
    ]);
  });
});
