import React from "react";
import type { BasicShapeProps, ShapeCell } from "../interfaces";
import { Rectangle, getConnectPointsOfRectangle } from "./Rectangle";
import { Circle, getConnectPointsOfCircle } from "./Circle";
import type { NodePosition } from "../../diagram/interfaces";
import { useHoverStateContext } from "../HoverStateContext";

export function Shape({ cell }: BasicShapeProps): JSX.Element | null {
  const { setHoverState } = useHoverStateContext();
  let ShapeComponent: (props: BasicShapeProps) => JSX.Element | null;
  let getRelativeConnectPoints: () => ReadonlyArray<NodePosition>;

  switch (cell.shape) {
    case "rectangle":
      ShapeComponent = Rectangle;
      getRelativeConnectPoints = getConnectPointsOfRectangle;
      break;
    case "circle":
      ShapeComponent = Circle;
      getRelativeConnectPoints = getConnectPointsOfCircle;
      break;
    default:
      throw new Error(`Unknown shape: ${cell.shape}`);
    // return null;
  }

  return (
    <ShapeComponent
      cell={cell}
      onMouseEnter={() => {
        setHoverState({
          cell,
          points: getConnectPoints(getRelativeConnectPoints(), cell),
        });
      }}
      // onMouseLeave={() => setHoverState(null)}
    />
  );
}

function getConnectPoints(
  relativePoints: ReadonlyArray<NodePosition>,
  cell: ShapeCell
) {
  return relativePoints.map((p) => ({
    x: cell.x + p.x * cell.width,
    y: cell.y + p.y * cell.height,
  }));
}
