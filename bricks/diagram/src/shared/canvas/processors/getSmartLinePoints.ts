import { pull } from "lodash";
import type { NodePosition } from "../../../diagram/interfaces";
import { getConnectPointsOfRectangleWithDirection } from "../shapes/Rectangle";
import type { EdgeView, NodeView } from "../../../draw-canvas/interfaces";
import { getPolyLinePoints } from "../../../diagram/lines/getPolyLinePoints";
import { nodeViewToNodeRect } from "./nodeViewToNodeRect";
import { DEFAULT_NODE_PADDING_FOR_SMART_LINES } from "../../../draw-canvas/constants";

const DEFAULT_DIRECTIONS = ["right", "top", "left", "bottom"] as const;

export function getSmartLinePoints(
  sourceView: NodeView,
  targetView: NodeView,
  edgeView: EdgeView
): NodePosition[] {
  const connectPoints = getConnectPointsOfRectangleWithDirection();

  const exitPosition =
    edgeView.exitPosition ?? getDefaultPosition(targetView, sourceView);
  const entryPosition =
    edgeView.entryPosition ?? getDefaultPosition(sourceView, targetView);

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

  if (edgeView.vertices?.length) {
    const newLinePoints = [
      { x: sourceX, y: sourceY },
      ...edgeView.vertices,
      { x: targetX, y: targetY },
    ];

    const firstVertex = newLinePoints[1];
    const firstNextPoint = newLinePoints[2];
    // If the first vertex is not on any axis of the source exit point,
    // add a vertex to connect them.
    if (firstVertex && firstVertex.x !== sourceX && firstVertex.y !== sourceY) {
      newLinePoints.splice(
        1,
        0,
        firstVertex.x === firstNextPoint.x
          ? { x: sourceX, y: firstVertex.y }
          : { x: firstVertex.x, y: sourceY }
      );
    }

    const lastVertex = newLinePoints[newLinePoints.length - 2];
    const lastPreviousPoint = newLinePoints[newLinePoints.length - 3];
    // If the last vertex is not on any axis of the target entry point,
    // add a vertex to connect them.
    if (lastVertex && lastVertex.x !== targetX && lastVertex.y !== targetY) {
      newLinePoints.splice(
        newLinePoints.length - 1,
        0,
        lastVertex.x === lastPreviousPoint.x
          ? { x: targetX, y: lastVertex.y }
          : { x: lastVertex.x, y: targetY }
      );
    }

    return newLinePoints;
  } else {
    const originalSourceDirections =
      connectPoints.find(
        (p) => p.x === exitPosition.x && p.y === exitPosition.y
      )?.d ?? DEFAULT_DIRECTIONS;
    const originalTargetDirections =
      connectPoints.find(
        (p) => p.x === entryPosition.x && p.y === entryPosition.y
      )?.d ?? DEFAULT_DIRECTIONS;
    const sourceDirections = [...originalSourceDirections];
    const targetDirections = [...originalTargetDirections];

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
}

export function getDefaultPosition(
  sourceView: NodeView,
  targetView: NodeView
): NodePosition {
  if (targetView.y + targetView.height < sourceView.y) {
    return { x: 0.5, y: 1 };
  }
  if (targetView.y > sourceView.y + sourceView.height) {
    return { x: 0.5, y: 0 };
  }
  return targetView.x < sourceView.x ? { x: 1, y: 0.5 } : { x: 0, y: 0.5 };
}
