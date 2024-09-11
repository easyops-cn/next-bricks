import { pull } from "lodash";
import type { NodePosition } from "../../../diagram/interfaces";
import { getConnectPointsOfRectangle } from "../shapes/Rectangle";
import type { EdgeView, NodeView } from "../../../draw-canvas/interfaces";
import { getPolyLinePoints } from "../../../diagram/lines/getPolyLinePoints";
import { nodeViewToNodeRect } from "./nodeViewToNodeRect";
import { DEFAULT_NODE_PADDING_FOR_SMART_LINES } from "../../../draw-canvas/constants";

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

  const padding = DEFAULT_NODE_PADDING_FOR_SMART_LINES;
  const halfPadding = padding / 2;

  const sourceX =
    sourceView.x - halfPadding + exitPosition.x * (sourceView.width + padding);
  const sourceY =
    sourceView.y - halfPadding + exitPosition.y * (sourceView.height + padding);
  const targetX =
    targetView.x - halfPadding + entryPosition.x * (targetView.width + padding);
  const targetY =
    targetView.y -
    halfPadding +
    entryPosition.y * (targetView.height + padding);

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
    nodeViewToNodeRect(sourceView, padding),
    nodeViewToNodeRect(targetView, padding),
    sourceDirection,
    targetDirection,
    sourcePosition,
    targetPosition
  );
}
