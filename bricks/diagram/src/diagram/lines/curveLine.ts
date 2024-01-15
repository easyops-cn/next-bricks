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
  points: Array<NodePosition> | undefined,
  arrowOffset: number,
  curveType?: CurveType
): string {
  if (!Array.isArray(points)) {
    return "";
  }
  let curveFactory: CurveFactory;
  switch (curveType) {
    case "curveBasis":
      curveFactory = curveBasis;
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
      curveFactory = curveLinear;
  }
  let arrowOffsetX = 0;
  let arrowOffsetY = 0;
  if (arrowOffset) {
    const { x: x0, y: y0 } = points[points.length - 2];
    const { x: x1, y: y1 } = points[points.length - 1];
    const distance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    const ratio = arrowOffset / distance;
    arrowOffsetX = (x0 - x1) * ratio;
    arrowOffsetY = (y0 - y1) * ratio;
  }
  const transformPoints = points;
  const lineFunction = line()
    .x(
      (d, index) =>
        (d as unknown as { x: number }).x -
        (index === points.length - 1 ? arrowOffsetX : 0)
    )
    .y(
      (d, index) =>
        (d as unknown as { y: number }).y -
        (index === points.length - 1 ? arrowOffsetY : 0)
    )
    .curve(curveFactory);
  return lineFunction(transformPoints as unknown as Array<[number, number]>)!;
}
