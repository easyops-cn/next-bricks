import type {
  Cell,
  DecoratorCell,
  EdgeCell,
  InitialCell,
  InitialNodeCell,
  LayoutType,
  NodeCell,
} from "../interfaces";
import { MoveCellPayload } from "../reducers/interfaces";

export function isNodeCell(cell: Cell | MoveCellPayload): cell is NodeCell {
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

export function isNodeOrEdgeCell(cell: Cell): cell is NodeCell | EdgeCell {
  return cell.type === "node" || cell.type === "edge";
}

export function isNodeOrAreaDecoratorCell(
  cell: Cell
): cell is NodeCell | DecoratorCell {
  return (
    cell.type === "node" ||
    (cell.type === "decorator" && cell.decorator === "area")
  );
}
export function isNodeOrTextDecoratorCell(
  cell: Cell | MoveCellPayload
): cell is NodeCell | DecoratorCell {
  return (
    cell.type === "node" ||
    (cell.type === "decorator" && cell.decorator === "text")
  );
}

export function isTextDecoratorCell(cell: Cell): cell is DecoratorCell {
  return cell.type === "decorator" && cell.decorator === "text";
}
export function isContainerDecoratorCell(
  cell: Cell | MoveCellPayload
): cell is DecoratorCell {
  return cell.type === "decorator" && cell.decorator === "container";
}

export function isNoManualLayout(layout: LayoutType) {
  return !["manual", undefined].includes(layout!);
}
