import { pick } from "lodash";
import type { ActiveTarget, Cell } from "../interfaces";

export function cellToTarget(cell: Cell): ActiveTarget {
  return cell.type === "edge"
    ? pick(cell, ["type", "source", "target", "data"])
    : pick(cell, ["type", "id", "data"]);
}
