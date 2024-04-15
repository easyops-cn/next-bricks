import type { PositionTuple } from "../../diagram/interfaces";
import { DEFAULT_SNAP_GRID_SIZE } from "../constants";
import type {
  ActiveTarget,
  Cell,
  LayoutOptions,
  LayoutType,
} from "../interfaces";
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
    layoutOptions,
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
    layoutOptions?: LayoutOptions;
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

  const snapToGrid = layoutOptions?.snapToGrid
    ? layoutOptions.snapToGrid === true
      ? {}
      : layoutOptions.snapToGrid
    : null;
  const snapToGridSize = snapToGrid?.size ?? DEFAULT_SNAP_GRID_SIZE;

  const from: PositionTuple = [event.clientX, event.clientY];
  const original: PositionTuple =
    action === "move"
      ? [cell.view.x, cell.view.y]
      : [cell.view.width, cell.view.height];
  let previous: PositionTuple = [...original];

  function getMovement(e: MouseEvent): PositionTuple {
    return [(e.clientX - from[0]) / scale, (e.clientY - from[1]) / scale];
  }

  let moved = false;

  const handleMove = (e: MouseEvent, finished?: boolean) => {
    // Respect the scale
    const movement = getMovement(e);
    let newValue: PositionTuple;

    // Use alt key (or option key ⌥ on Mac) to toggle snap
    if (!snapToGrid === !e.altKey) {
      // No snap
      newValue = [original[0] + movement[0], original[1] + movement[1]];
      if (!moved) {
        moved = movement[0] ** 2 + movement[1] ** 2 >= 9;
      }
    } else {
      // Snap
      newValue = [
        Math.round((original[0] + movement[0]) / snapToGridSize) *
          snapToGridSize,
        Math.round((original[1] + movement[1]) / snapToGridSize) *
          snapToGridSize,
      ];
      const changed =
        newValue[0] !== previous[0] || newValue[1] !== previous[1];
      if (changed) {
        previous = newValue;
        moved = true;
      }
    }

    if (moved) {
      if (action === "move") {
        (finished ? onCellMoved : onCellMoving)?.({
          type: cell.type,
          id: cell.id,
          x: newValue[0],
          y: newValue[1],
        });
      } else {
        (finished ? onCellResized : onCellResizing)?.({
          type: cell.type,
          id: cell.id,
          width: newValue[0],
          height: newValue[1],
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
