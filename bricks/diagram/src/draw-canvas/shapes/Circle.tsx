import React from "react";
import type { BasicShapeProps } from "../interfaces";
import type { NodePosition } from "../../diagram/interfaces";

const smallerOffset = 0.5 - Math.SQRT1_2 / 2;
const largerOffset = 0.5 + Math.SQRT1_2 / 2;

const CircleRelativeConnectPoints: ReadonlyArray<NodePosition> = [
  { x: smallerOffset, y: smallerOffset },
  { x: 0.5, y: 0 },
  { x: largerOffset, y: smallerOffset },
  { x: 1, y: 0.5 },
  { x: largerOffset, y: largerOffset },
  { x: 0.5, y: 1 },
  { x: smallerOffset, y: largerOffset },
  { x: 0, y: 0.5 },
];

export function Circle({ cell, onMouseEnter, onMouseLeave }: BasicShapeProps): JSX.Element {
  const style = {
    fill: "white",
    stroke: "gray",
    strokeWidth: 1,
    ...cell.style,
  };

  return (
    <ellipse
      cx={cell.x + cell.width / 2}
      cy={cell.y + cell.height / 2}
      rx={cell.width / 2}
      ry={cell.height / 2}
      fill={style.fill}
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      pointerEvents="all"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}

export function getConnectPointsOfCircle(): ReadonlyArray<NodePosition> {
  return CircleRelativeConnectPoints;
}
