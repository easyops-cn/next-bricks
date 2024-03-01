import type {
  ActiveTarget,
  Cell,
  DecoratorCell,
  NodeOrDecoratorBasicInfo,
  NodeCell,
} from "../interfaces";

export type KeyboardAction = KeyboardActionDeleteCell;

export interface KeyboardActionDeleteCell {
  action: "delete-cell";
  cell: NodeOrDecoratorBasicInfo;
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
  const activeCell =
    activeTarget?.type === "node" || activeTarget?.type === "decorator"
      ? (cells.find(
          (cell) =>
            cell.type === activeTarget.type && cell.id === activeTarget.id
        ) as NodeCell | DecoratorCell)
      : undefined;

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
        cell: {
          type: activeCell.type,
          id: activeCell.id,
          data: activeCell.data,
        },
      };
    }
  }
}
