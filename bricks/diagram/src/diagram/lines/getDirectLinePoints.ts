import type { EdgeView } from "../../draw-canvas/interfaces";
import type { NodePosition, NodeRect, PositionTuple } from "../interfaces";
import { doTwoNodesOverlap } from "../processors/doTwoNodesOverlap";

type LineTuple = [start: PositionTuple, end: PositionTuple];

export function getDirectLinePoints(
  source: NodeRect,
  target: NodeRect,
  parallelGap?: number,
  edgeView?: EdgeView
): NodePosition[] | null {
  const hasExitPosition = !!edgeView?.exitPosition;
  const hasEntryPosition = !!edgeView?.entryPosition;

  // Ignore if two nodes are the same.
  // Ignore if two nodes overlap and no entry nor exit position.
  if (
    source === target ||
    (doTwoNodesOverlap(source, target, 0, 0) &&
      !(hasExitPosition || hasEntryPosition))
  ) {
    return null;
  }

  let p0: PositionTuple;
  let p1: PositionTuple;

  let xDiff = 0;
  let yDiff = 0;

  if (parallelGap) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const angle = Math.atan2(dy, dx);
    xDiff = (parallelGap / 2) * Math.cos(angle + Math.PI / 2);
    yDiff = (parallelGap / 2) * Math.sin(angle + Math.PI / 2);
  }

  const line: LineTuple = [
    hasExitPosition
      ? [
          source.x + (edgeView!.exitPosition!.x - 0.5) * source.width,
          source.y + (edgeView!.exitPosition!.y - 0.5) * source.height,
        ]
      : [source.x + xDiff, source.y + yDiff],
    hasEntryPosition
      ? [
          target.x + (edgeView!.entryPosition!.x - 0.5) * target.width,
          target.y + (edgeView!.entryPosition!.y - 0.5) * target.height,
        ]
      : [target.x + xDiff, target.y + yDiff],
  ];

  if (hasExitPosition) {
    p0 = line[0];
  } else {
    const sourceIntersections = getIntersections(source, line);
    // Todo: handle when more than one intersection
    if (sourceIntersections.length > 0) {
      p0 = sourceIntersections[0];
    } else {
      p0 = [source.x, source.y];
    }
  }

  if (hasEntryPosition) {
    p1 = line[1];
  } else {
    const targetIntersections = getIntersections(target, line);
    // Todo: handle when more than one intersection
    if (targetIntersections.length > 0) {
      p1 = targetIntersections[0];
    } else {
      p1 = [target.x, target.y];
    }
  }

  return [
    { x: p0[0], y: p0[1] },
    { x: p1[0], y: p1[1] },
  ];
}

function getIntersections(rect: NodeRect, line: LineTuple) {
  const vertices: PositionTuple[] = [
    [rect.x - rect.width / 2, rect.y - rect.height / 2],
    [rect.x + rect.width / 2, rect.y - rect.height / 2],
    [rect.x + rect.width / 2, rect.y + rect.height / 2],
    [rect.x - rect.width / 2, rect.y + rect.height / 2],
  ];
  const possibleLines: [start: PositionTuple, end: PositionTuple][] = [];
  for (let i = 0; i < 4; i++) {
    possibleLines.push([vertices[i], vertices[(i + 1) % 4]]);
  }
  const intersections: PositionTuple[] = [];
  for (const item of possibleLines) {
    const intersection = intersect(line[0], line[1], item[0], item[1]);
    if (intersection) {
      intersections.push(intersection);
    }
  }
  return intersections;
}

// https://paulbourke.net/geometry/pointlineplane/javascript.txt
function intersect(
  [x1, y1]: PositionTuple,
  [x2, y2]: PositionTuple,
  [x3, y3]: PositionTuple,
  [x4, y4]: PositionTuple
): null | PositionTuple {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return null;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return null;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null;
  }

  // Return a object with the x and y coordinates of the intersection
  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  return [x, y];
}
