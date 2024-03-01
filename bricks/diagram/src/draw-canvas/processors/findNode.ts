import type { Cell, NodeCell, NodeId } from "../interfaces";
import { isNodeCell } from "./asserts";

export function findNode(cells: Cell[], id: NodeId): NodeCell | undefined {
  return cells.find((cell) => isNodeCell(cell) && cell.id === id) as
    | NodeCell
    | undefined;
}
