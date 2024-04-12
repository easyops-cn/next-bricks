import type { NodeConnectPoint } from "../../../draw-canvas/interfaces";

//  *--*--*--*--*
//  |           |
//  *           *
//  |           |
//  *    Rect   *
//  |           |
//  *           *
//  |           |
//  *--*--*--*--*
const RectangleRelativeConnectPoints: ReadonlyArray<NodeConnectPoint> = [
  {
    x: 0,
    y: 0,
    d: ["top", "left"],
  },
  { x: 0.5, y: 0, d: ["top"] },
  {
    x: 1,
    y: 0,
    d: ["top", "right"],
  },
  { x: 0, y: 0.5, d: ["left"] },
  { x: 1, y: 0.5, d: ["right"] },
  {
    x: 0,
    y: 1,
    d: ["bottom", "left"],
  },
  { x: 0.5, y: 1, d: ["bottom"] },
  {
    x: 1,
    y: 1,
    d: ["bottom", "right"],
  },
];

export function getConnectPointsOfRectangle(): ReadonlyArray<NodeConnectPoint> {
  return RectangleRelativeConnectPoints;
}
