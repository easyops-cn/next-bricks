import type { RenderedNode } from "../interfaces";

export function getCenterOffsets(
  renderedNodes: RenderedNode[],
  [canvasWidth, canvasHeight]: [canvasWidth: number, canvasHeight: number]
): [offsetX: number, offsetY: number] {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const node of renderedNodes) {
    const hw = node.width / 2;
    const hh = node.height / 2;
    const l = node.x - hw;
    const r = node.x + hw;
    const t = node.y - hh;
    const b = node.y + hh;
    if (l < left) {
      left = l;
    }
    if (r > right) {
      right = r;
    }
    if (t < top) {
      top = t;
    }
    if (b > bottom) {
      bottom = b;
    }
  }

  const width = right - left;
  const height = bottom - top;

  return [(canvasWidth - width) / 2 - top, (canvasHeight - height) / 2 - left];
}
