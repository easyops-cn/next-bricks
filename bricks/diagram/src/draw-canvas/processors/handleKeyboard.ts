import type { ActiveTarget, Cell } from "../interfaces";
import { sameTarget } from "./sameTarget";

export type KeyboardAction = KeyboardActionDeleteCell;

export interface KeyboardActionDeleteCell {
  action: "delete-cell";
  cell: Cell;
}

export function handleKeyboard(
  event: KeyboardEvent,
  {
    cells,
    activeTarget,
  }: {
    cells: Cell[];
    activeTarget: ActiveTarget | null | undefined;
  }
): KeyboardAction | undefined {
  const activeCell = cells.find((cell) => sameTarget(cell, activeTarget));

  if (!activeCell) {
    return;
  }

  const key =
    event.key ||
    /* istanbul ignore next: compatibility */ event.keyCode ||
    /* istanbul ignore next: compatibility */ event.which;

  switch (key) {
    case "Backspace":
    case 8:
    case "Delete":
    case 46: {
      event.preventDefault();
      event.stopPropagation();
      return {
        action: "delete-cell",
        cell: activeCell,
      };
    }
  }
}
