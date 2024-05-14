import { pick } from "lodash";
import type { ActiveTargetOfSingular, Cell } from "../interfaces";

export function cellToTarget(cell: Cell): ActiveTargetOfSingular {
  return cell.type === "edge"
    ? pick(cell, ["type", "source", "target", "data"])
    : pick(cell, ["type", "id", "data"]);
}
