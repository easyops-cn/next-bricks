import type { PositionTuple } from "../../diagram/interfaces";
import type { NodeView, SnapToObjectPosition } from "../interfaces";

const DEFAULT_ALL_POSITIONS = ["center", "top", "bottom", "left", "right"];

export type SnapPositions = Partial<
  Record<SnapToObjectPosition, PositionTuple>
>;

export function getSnapPositions(
  view: NodeView,
  positions: string | undefined
) {
  const snapPositions: SnapPositions = {};
  for (const position of positions
    ?.split(/\s+/g)
    ?.flatMap((pos) => (pos === "all" ? DEFAULT_ALL_POSITIONS : pos)) ?? []) {
    let tuple: PositionTuple;
    const cx = view.x + view.width / 2;
    const cy = view.y + view.height / 2;
    switch (position) {
      case "center":
        tuple = [cx, cy];
        break;
      case "top":
        tuple = [cx, view.y];
        break;
      case "right":
        tuple = [view.x + view.width, cy];
        break;
      case "bottom":
        tuple = [cx, view.y + view.height];
        break;
      case "left":
        tuple = [view.x, cy];
        break;
      default:
        throw new Error(`Unknown snap position: "${position}"`);
    }
    snapPositions[position] = tuple;
  }
  return snapPositions;
}
