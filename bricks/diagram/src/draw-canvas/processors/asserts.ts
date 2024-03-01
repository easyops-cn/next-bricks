import type {
  Cell,
  DecoratorCell,
  EdgeCell,
  InitialCell,
  InitialNodeCell,
  NodeCell,
} from "../interfaces";

export function isNodeCell(cell: Cell): cell is NodeCell {
  return cell.type === "node";
}

export function isDecoratorCell(cell: Cell): cell is DecoratorCell {
  return cell.type === "decorator";
}

export function isInitialNodeCell(cell: InitialCell): cell is InitialNodeCell {
  return cell.type === "node";
}

export function isEdgeCell(cell: Cell): cell is EdgeCell {
  return cell.type === "edge";
}
