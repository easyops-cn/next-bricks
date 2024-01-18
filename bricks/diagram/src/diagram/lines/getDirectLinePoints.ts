import type { NodePosition, RenderedNode } from "../interfaces";

export function getDirectLinePoints(
  source: RenderedNode,
  target: RenderedNode
): NodePosition[] | null {
  // Ignore if two nodes are the same.
  if (source === target) {
    return null;
  }

  // Ignore if two nodes overlap.
  const left = Math.min(
    source.x - source.width / 2,
    target.x - target.width / 2
  );
  const right = Math.max(
    source.x + source.width / 2,
    target.x + target.width / 2
  );
  const top = Math.min(
    source.y - source.height / 2,
    target.y - target.height / 2
  );
  const bottom = Math.max(
    source.y + source.height / 2,
    target.y + target.height / 2
  );
  if (
    right - left < source.width + target.width &&
    bottom - top < source.height + target.height
  ) {
    return null;
  }

  const dx = target.x - source.x;
  const dy = target.y - source.y;

  let x0: number, y0: number, x1: number, y1: number;
  const directionX = dx > 0 ? 1 : -1;
  if (dy !== 0) {
    const deltaRadio = Math.abs(dx / dy);
    const directionY = dy > 0 ? 1 : -1;
    const sourceRadio = source.width / source.height;
    if (deltaRadio < sourceRadio) {
      x0 = source.x + ((deltaRadio * source.height) / 2) * directionX;
      y0 = source.y + (source.height / 2) * directionY;
    } else {
      x0 = source.x + (source.width / 2) * directionX;
      y0 = source.y + (source.width / 2 / deltaRadio) * directionY;
    }
    const targetRadio = target.width / target.height;
    if (deltaRadio < targetRadio) {
      x1 = target.x - ((deltaRadio * target.height) / 2) * directionX;
      y1 = target.y - (target.height / 2) * directionY;
    } else {
      x1 = target.x - (target.width / 2) * directionX;
      y1 = target.y - (target.width / 2 / deltaRadio) * directionY;
    }
  } else {
    x0 = source.x + (source.width / 2) * directionX;
    x1 = target.x - (target.width / 2) * directionX;
    y0 = y1 = source.y;
  }

  return [
    { x: x0, y: y0 },
    { x: x1, y: y1 },
  ];
}
