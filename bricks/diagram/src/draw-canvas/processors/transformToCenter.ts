import type { TransformLiteral } from "../../diagram/interfaces";
import type { Cell } from "../interfaces";
import { isEdgeCell } from "./asserts";

export interface TransformToCenterOptions {
  canvasWidth: number;
  canvasHeight: number;
  scaleRange?: [min: number, max: number];
}

export function transformToCenter(
  cells: Cell[],
  { canvasWidth, canvasHeight, scaleRange }: TransformToCenterOptions
): TransformLiteral {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  let empty = true;
  for (const cell of cells) {
    if (!isEdgeCell(cell)) {
      empty = false;
      const { view } = cell;
      const r = view.x + view.width;
      const b = view.y + view.height;
      if (view.x < left) {
        left = view.x;
      }
      if (r > right) {
        right = r;
      }
      if (view.y < top) {
        top = view.y;
      }
      if (b > bottom) {
        bottom = b;
      }
    }
  }

  const width = right - left;
  const height = bottom - top;

  const scale =
    scaleRange && !empty && (width > canvasWidth || height > canvasHeight)
      ? Math.max(
          Math.min(canvasWidth / width, canvasHeight / height, scaleRange[1]),
          scaleRange[0]
        )
      : 1;

  const x = empty ? 0 : (canvasWidth - width * scale) / 2 - left * scale;
  const y = empty ? 0 : (canvasHeight - height * scale) / 2 - top * scale;

  return { x, y, k: scale };
}
