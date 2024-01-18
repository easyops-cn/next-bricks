import type { RenderedNode, TransformLiteral } from "../interfaces";

export interface TransformToCenterOptions {
  canvasWidth: number;
  canvasHeight: number;
  scaleRange?: [min: number, max: number];
}

export function transformToCenter(
  renderedNodes: RenderedNode[],
  { canvasWidth, canvasHeight, scaleRange }: TransformToCenterOptions
): TransformLiteral {
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

  const scale =
    scaleRange && (width > canvasWidth || height > canvasHeight)
      ? Math.max(
          Math.min(canvasWidth / width, canvasHeight / height, scaleRange[1]),
          scaleRange[0]
        )
      : 1;

  const x = (canvasWidth - width * scale) / 2 - left * scale;
  const y = (canvasHeight - height * scale) / 2 - top * scale;

  return { x, y, k: scale };
}
