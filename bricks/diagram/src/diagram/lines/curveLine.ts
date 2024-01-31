import {
  curveLinear,
  line,
  curveBasis,
  curveBumpX,
  curveBumpY,
  type CurveFactory,
  curveMonotoneX,
  curveNatural,
  curveMonotoneY,
} from "d3-shape";
import type { CurveType, NodePosition } from "../interfaces";

/**
 * Generate Line from points
 */
export function curveLine(
  points: Array<NodePosition> | null | undefined,
  curveType: CurveType | undefined,
  startOffset: number,
  endOffset: number
): string {
  if (!Array.isArray(points)) {
    return "";
  }
  let curveFactory: CurveFactory;
  switch (curveType) {
    case "curveLinear":
      curveFactory = curveLinear;
      break;
    case "curveBumpX":
      curveFactory = curveBumpX;
      break;
    case "curveBumpY":
      curveFactory = curveBumpY;
      break;
    case "curveMonotoneX":
      curveFactory = curveMonotoneX;
      break;
    case "curveMonotoneY":
      curveFactory = curveMonotoneY;
      break;
    case "curveNatural":
      curveFactory = curveNatural;
      break;
    default:
      curveFactory = curveBasis;
  }
  const startOffsets = getOffsets(points[1], points[0], startOffset);
  const endOffsets = getOffsets(
    points[points.length - 2],
    points[points.length - 1],
    endOffset
  );
  const lineFunction = line()
    .x(
      (d, index) =>
        (d as unknown as { x: number }).x -
        (index === 0
          ? startOffsets.x
          : index === points.length - 1
            ? endOffsets.x
            : 0)
    )
    .y(
      (d, index) =>
        (d as unknown as { y: number }).y -
        (index === 0
          ? startOffsets.y
          : index === points.length - 1
            ? endOffsets.y
            : 0)
    )
    .curve(curveFactory);
  return lineFunction(points as unknown as Array<[number, number]>)!;
}

function getOffsets(
  start: NodePosition,
  end: NodePosition,
  offset: number
): NodePosition {
  if (!offset) {
    return { x: 0, y: 0 };
  }
  const { x: x0, y: y0 } = start;
  const { x: x1, y: y1 } = end;
  const distance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  const ratio = offset / distance;
  return {
    x: (x1 - x0) * ratio,
    y: (y1 - y0) * ratio,
  };
}
