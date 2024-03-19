import type { PositionTuple } from "../../diagram/interfaces";
import type { ActiveTarget, Cell, LayoutType } from "../interfaces";
import type {
  MoveCellPayload,
  ResizeCellPayload,
} from "../reducers/interfaces";
import { isEdgeCell, isNodeCell } from "./asserts";
import { cellToTarget } from "./cellToTarget";

export function handleMouseDown(
  event: MouseEvent,
  {
    action,
    cell,
    scale,
    layout,
    onCellMoving,
    onCellMoved,
    onCellResizing,
    onCellResized,
    onSwitchActiveTarget,
  }: {
    action: "move" | "resize";
    cell: Cell;
    scale: number;
    layout?: LayoutType;
    onCellMoving?(info: MoveCellPayload): void;
    onCellMoved?(info: MoveCellPayload): void;
    onCellResizing?(info: ResizeCellPayload): void;
    onCellResized?(info: ResizeCellPayload): void;
    onSwitchActiveTarget?(activeTarget: ActiveTarget | null): void;
  }
) {
  event.stopPropagation();
  // Drag node
  onSwitchActiveTarget?.(cellToTarget(cell));

  if (
    isEdgeCell(cell) ||
    ((layout === "force" || layout === "dagre") && isNodeCell(cell))
  ) {
    return;
  }

  const from: PositionTuple = [event.clientX, event.clientY];
  const original =
    action === "move"
      ? [cell.view.x, cell.view.y]
      : [cell.view.width, cell.view.height];

  function getMovement(e: MouseEvent): PositionTuple {
    return [(e.clientX - from[0]) / scale, (e.clientY - from[1]) / scale];
  }

  let moved = false;

  const handleMove = (e: MouseEvent, finished?: boolean) => {
    // Respect the scale
    const movement = getMovement(e);
    if (!moved) {
      moved = movement[0] ** 2 + movement[1] ** 2 >= 9;
    }
    // const [x, y] = getNewPosition(movement);
    // adjustCellPosition(x, y);
    if (moved) {
      if (action === "move") {
        (finished ? onCellMoved : onCellMoving)?.({
          type: cell.type,
          id: cell.id,
          x: original[0] + movement[0],
          y: original[1] + movement[1],
        });
      } else {
        (finished ? onCellResized : onCellResizing)?.({
          type: cell.type,
          id: cell.id,
          width: original[0] + movement[0],
          height: original[1] + movement[1],
        });
      }
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    handleMove(e);
  };
  const onMouseUp = (e: MouseEvent) => {
    handleMove(e, true);
    moved = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}
