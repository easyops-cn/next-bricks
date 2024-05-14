import type { ActiveTarget, Cell } from "../interfaces";
import { targetIsActive } from "./targetIsActive";

export type KeyboardAction = KeyboardActionDeleteCells;

export interface KeyboardActionDeleteCells {
  action: "delete-cells";
  cells: Cell[];
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
  const activeCells = cells.filter((cell) =>
    targetIsActive(cell, activeTarget)
  );

  if (activeCells.length === 0) {
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
        action: "delete-cells",
        cells: activeCells,
      };
    }
  }
}
