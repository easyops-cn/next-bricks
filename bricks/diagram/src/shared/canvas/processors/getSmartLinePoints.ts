import { pull } from "lodash";
import type { NodePosition } from "../../../diagram/interfaces";
import { getConnectPointsOfRectangle } from "../shapes/Rectangle";
import type { EdgeView, NodeView } from "../../../draw-canvas/interfaces";
import { getPolyLinePoints } from "../../../diagram/lines/getPolyLinePoints";
import { nodeViewToNodeRect } from "./nodeViewToNodeRect";

const DEFAULT_DIRECTIONS = ["right", "top", "left", "bottom"] as const;

export function getSmartLinePoints(
  sourceView: NodeView,
  targetView: NodeView,
  {
    exitPosition,
    entryPosition,
  }: Required<Pick<EdgeView, "exitPosition" | "entryPosition">>
): NodePosition[] {
  const connectPoints = getConnectPointsOfRectangle();

  const originalSourceDirections =
    connectPoints.find((p) => p.x === exitPosition.x && p.y === exitPosition.y)
      ?.d ?? DEFAULT_DIRECTIONS;
  const originalTargetDirections =
    connectPoints.find(
      (p) => p.x === entryPosition.x && p.y === entryPosition.y
    )?.d ?? DEFAULT_DIRECTIONS;
  const sourceDirections = [...originalSourceDirections];
  const targetDirections = [...originalTargetDirections];

  const sourceX = sourceView.x + exitPosition.x * sourceView.width;
  const sourceY = sourceView.y + exitPosition.y * sourceView.height;
  const targetX = targetView.x + entryPosition.x * targetView.width;
  const targetY = targetView.y + entryPosition.y * targetView.height;

  if (sourceX < targetX) {
    pull(sourceDirections, "left");
    pull(targetDirections, "right");
  } else {
    pull(sourceDirections, "right");
    pull(targetDirections, "left");
  }

  if (sourceY < targetY) {
    pull(sourceDirections, "top");
    pull(targetDirections, "bottom");
  } else {
    pull(sourceDirections, "bottom");
    pull(targetDirections, "top");
  }

  const sourceDirection = sourceDirections[0] ?? originalSourceDirections[0];
  const targetDirection = targetDirections[0] ?? originalTargetDirections[0];

  const sourcePosition =
    sourceDirection === "left" || sourceDirection === "right"
      ? exitPosition.y
      : exitPosition.x;
  const targetPosition =
    targetDirection === "left" || targetDirection === "right"
      ? entryPosition.y
      : entryPosition.x;

  return getPolyLinePoints(
    nodeViewToNodeRect(sourceView, 0),
    nodeViewToNodeRect(targetView, 0),
    sourceDirection,
    targetDirection,
    sourcePosition,
    targetPosition
  );
}
