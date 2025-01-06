import { describe, test, expect } from "@jest/globals";
import { getEditingLinePoints } from "./getEditingLinePoints";
import type {
  Cell,
  EdgeCell,
  LineEditorState,
} from "../../../draw-canvas/interfaces";
import type { HoverState } from "../../../draw-canvas/HoverStateContext";

describe("getEditingLinePoints", () => {
  const source = {
    view: {
      x: 100,
      y: 200,
      width: 80,
      height: 60,
    },
  } as Cell;
  const target = {
    view: {
      x: 200,
      y: 300,
      width: 80,
      height: 60,
    },
  } as Cell;
  const activeEditableEdge = {
    view: {
      type: "polyline",
      exitPosition: { x: 0.5, y: 0.5 },
    },
  } as EdgeCell;
  const entryState = {
    type: "entry",
  } as LineEditorState;
  const exitState = {
    type: "exit",
  } as LineEditorState;

  test("null inputs", () => {
    expect(getEditingLinePoints(null, null, new WeakMap(), null, null)).toBe(
      null
    );
  });

  test("entry with hoverState.activePointIndex is defined", () => {
    expect(
      getEditingLinePoints(
        activeEditableEdge,
        entryState,
        new WeakMap([[activeEditableEdge, { source, target } as any]]),
        null,
        {
          relativePoints: [{ x: 0, y: 0.5 }],
          activePointIndex: 0,
          points: [],
        } as unknown as HoverState
      )
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
    expect(
      getEditingLinePoints(
        activeEditableEdge,
        entryState,
        new WeakMap([[activeEditableEdge, { source, target } as any]]),
        [150, 100],
        null
      )
    ).toEqual([
      { x: 180, y: 230 },
      { x: 200, y: 230 },
      { x: 200, y: 150 },
      { x: 150, y: 150 },
      { x: 150, y: 100 },
    ]);
  });

  test("exit with hoverState.activePointIndex is defined", () => {
    expect(
      getEditingLinePoints(
        activeEditableEdge,
        exitState,
        new WeakMap([[activeEditableEdge, { source, target } as any]]),
        null,
        {
          relativePoints: [{ x: 0, y: 0.5 }],
          activePointIndex: 0,
          points: [],
        } as unknown as HoverState
      )
    ).toEqual([
      { x: 100, y: 230 },
      { x: 80, y: 230 },
      { x: 80, y: 280 },
      { x: 240, y: 280 },
      { x: 240, y: 300 },
    ]);
  });

  test("exit with connectLineTo", () => {
    expect(
      getEditingLinePoints(
        activeEditableEdge,
        exitState,
        new WeakMap([[activeEditableEdge, { source, target } as any]]),
        [150, 100],
        null
      )
    ).toEqual([
      { x: 150, y: 100 },
      { x: 150, y: 200 },
      { x: 240, y: 200 },
      { x: 240, y: 300 },
    ]);
  });
});

describe("getEditingLinePoints with control", () => {
  const source = {
    view: {
      x: 100,
      y: 200,
      width: 80,
      height: 60,
    },
  } as Cell;
  const target = {
    view: {
      x: 300,
      y: 100,
      width: 80,
      height: 60,
    },
  } as Cell;
  const activeEditableEdge = {
    view: {
      type: "polyline",
      exitPosition: { x: 1, y: 0.5 },
      entryPosition: { x: 0, y: 0.5 },
      vertices: [
        { x: 240, y: 230 },
        { x: 240, y: 130 },
      ],
    },
  } as EdgeCell;
  const points = [
    { x: 180, y: 230 },
    { x: 240, y: 230 },
    { x: 240, y: 130 },
    { x: 300, y: 130 },
  ];

  test("control pull down the first control", () => {
    //               ┌─────┐
    //           ┌───┤  T  │
    // ┌─────┐   │   └─────┘
    // │  S  ├─┬─┘
    // └─────┘ ↓
    expect(
      getEditingLinePoints(
        activeEditableEdge,
        {
          type: "control",
          control: { x: 210, y: 230, index: 0, direction: "ns" },
        } as LineEditorState,
        new WeakMap([[activeEditableEdge, { source, target, points } as any]]),
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
        activeEditableEdge,
        {
          type: "control",
          control: { x: 270, y: 130, index: 2, direction: "ns" },
        } as LineEditorState,
        new WeakMap([[activeEditableEdge, { source, target, points } as any]]),
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
        activeEditableEdge,
        {
          type: "control",
          control: { x: 240, y: 180, index: 1, direction: "ew" },
        } as LineEditorState,
        new WeakMap([[activeEditableEdge, { source, target, points } as any]]),
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
        activeEditableEdge,
        {
          type: "control",
          control: { x: 240, y: 180, index: 1, direction: "ew" },
        } as LineEditorState,
        new WeakMap([
          [
            activeEditableEdge,
            {
              source,
              target,
              points: [
                { x: 180, y: 230 },
                { x: 240, y: 230 },
                { x: 240, y: 130 },
                { x: 270, y: 130 },
                { x: 270, y: 130 },
                { x: 300, y: 130 },
              ],
            } as any,
          ],
        ]),
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
