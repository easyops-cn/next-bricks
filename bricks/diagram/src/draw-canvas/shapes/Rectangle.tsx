import React from "react";
import type { BasicShapeProps } from "../interfaces";
import type { NodePosition } from "../../diagram/interfaces";

//  *--*--*--*--*
//  |           |
//  *           *
//  |           |
//  *    Rect   *
//  |           |
//  *           *
//  |           |
//  *--*--*--*--*
const RectangleRelativeConnectPoints: ReadonlyArray<NodePosition> = [
  { x: 0, y: 0 },
  { x: 0.25, y: 0 },
  { x: 0.5, y: 0 },
  { x: 0.75, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: .25 },
  { x: 1, y: .25 },
  { x: 0, y: 0.5 },
  { x: 1, y: 0.5 },
  { x: 0, y: 0.75 },
  { x: 1, y: 0.75 },
  { x: 0, y: 1 },
  { x: 0.25, y: 1 },
  { x: 0.5, y: 1 },
  { x: 0.75, y: 1 },
  { x: 1, y: 1 },
];

export function Rectangle({ cell, onMouseEnter, onMouseLeave }: BasicShapeProps): JSX.Element {
  const style = {
    fill: "white",
    stroke: "gray",
    strokeWidth: 1,
    ...cell.style,
  };

  return (
    <rect
      x={cell.x}
      y={cell.y}
      width={cell.width}
      height={cell.height}
      fill={style.fill}
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      pointerEvents="all"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}

export function getConnectPointsOfRectangle(): ReadonlyArray<NodePosition> {
  return RectangleRelativeConnectPoints;
}
