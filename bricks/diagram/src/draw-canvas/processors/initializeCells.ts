import type { SizeTuple } from "../../diagram/interfaces";
import type { Cell, InitialCell, NodeCell } from "../interfaces";
import { isInitialNodeCell } from "./asserts";

export function initializeCells(
  initialCells: InitialCell[] | undefined,
  {
    defaultNodeSize,
  }: {
    defaultNodeSize: SizeTuple;
  }
): Cell[] {
  const originalCells = initialCells ?? [];
  const finalCells: Cell[] = originalCells.map<Cell>((cell) => {
    if (
      !isInitialNodeCell(cell) ||
      (cell.view?.width !== undefined && cell.view?.height !== undefined)
    ) {
      return cell as NodeCell;
    }
    return {
      ...cell,
      view: {
        width: defaultNodeSize[0],
        height: defaultNodeSize[1],
        ...cell.view,
      },
    } as NodeCell;
  });
  return finalCells;
}
