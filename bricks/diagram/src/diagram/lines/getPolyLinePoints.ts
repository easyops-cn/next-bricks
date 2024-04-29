import type { Direction, NodePosition, NodeRect } from "../interfaces";

export function getPolyLinePoints(
  source: NodeRect,
  target: NodeRect,
  sourceDirection: Direction,
  targetDirection: Direction,
  sourcePosition: number,
  targetPosition: number
): NodePosition[] {
  const p0 = getCoordinates(source, sourceDirection, sourcePosition);
  const p1 = getCoordinates(target, targetDirection, targetPosition);

  let c1: NodePosition;
  let c2: NodePosition | undefined;
  switch (sourceDirection) {
    case "top":
    case "bottom":
      switch (targetDirection) {
        case "left":
        case "right":
          c1 = { x: p0.x, y: p1.y };
          break;
        default:
          c1 = { x: p0.x, y: (p0.y + p1.y) / 2 };
          c2 = { x: p1.x, y: c1.y };
      }
      break;
    default:
      switch (targetDirection) {
        case "top":
        case "bottom":
          c1 = { x: p1.x, y: p0.y };
          break;
        default:
          c1 = { x: (p0.x + p1.x) / 2, y: p0.y };
          c2 = { x: c1.x, y: p1.y };
      }
  }

  return [p0, c1, c2, p1].filter(Boolean) as NodePosition[];
}

function getCoordinates(
  node: NodeRect,
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
