import type {
  Cell,
  EdgeCell,
  InitialCell,
  InitialNodeCell,
  NodeCell,
} from "../interfaces";

export function isNodeCell(cell: Cell): cell is NodeCell {
  return cell.type === "node";
}

export function isInitialNodeCell(cell: InitialCell): cell is InitialNodeCell {
  return cell.type === "node";
}

export function isEdgeCell(cell: Cell): cell is EdgeCell {
  return cell.type === "edge";
}
