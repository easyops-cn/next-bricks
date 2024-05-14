import type { Cell, NodeCell, DecoratorCell, NodeId } from "../interfaces";
import { isNodeOrAreaDecoratorCell } from "./asserts";

export function findNodeOrAreaDecorator(
  cells: Cell[],
  id: NodeId
): NodeCell | DecoratorCell | undefined {
  return cells.find(
    (cell) => isNodeOrAreaDecoratorCell(cell) && cell.id === id
  ) as NodeCell | DecoratorCell | undefined;
}
