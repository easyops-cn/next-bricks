import type { Direction, NodePosition, RenderedNode } from "../interfaces";

export function getPolyLinePoints(
  source: RenderedNode,
  target: RenderedNode,
  sourceDirection: Direction,
  targetDirection: Direction,
  sourcePosition: number,
  targetPosition: number
): NodePosition[] | null {
  const p0 = getCoordinates(source, sourceDirection, sourcePosition);
  const p1 = getCoordinates(target, targetDirection, targetPosition);

  let c1: NodePosition;
  let c2: NodePosition;
  switch (sourceDirection) {
    case "top":
    case "bottom":
      switch (targetDirection) {
        default:
          c1 = { x: p0.x, y: (p0.y + p1.y) / 2 };
          c2 = { x: p1.x, y: c1.y };
          break;
      }
      break;
    default:
      switch (targetDirection) {
        default:
          c1 = { x: (p0.x + p1.x) / 2, y: p0.y };
          c2 = { x: c1.x, y: p1.y };
          break;
      }
  }

  return [p0, c1, c2, p1];
}

function getCoordinates(
  node: RenderedNode,
  direction: Direction,
  position: number
): NodePosition {
  const { x, y, width, height } = node;
  switch (direction) {
    case "top":
      return {
        x: x - width / 2 + width * position,
        y: y - height / 2,
      };
    case "bottom":
      return {
        x: x - width / 2 + width * position,
        y: y + height / 2,
      };
    case "left":
      return {
        x: x - width / 2,
        y: y - height / 2 + height * position,
      };
    case "right":
      return {
        x: x + width / 2,
        y: y - height / 2 + height * position,
      };
  }
}
