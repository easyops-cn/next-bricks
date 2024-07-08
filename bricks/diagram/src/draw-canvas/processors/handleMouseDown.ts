import type { PositionTuple } from "../../diagram/interfaces";
import type {
  ActiveTarget,
  Cell,
  DecoratorCell,
  LayoutType,
  NodeCell,
} from "../interfaces";
import type {
  MoveCellPayload,
  ResizeCellPayload,
} from "../reducers/interfaces";
import { isDecoratorCell, isEdgeCell, isNodeCell } from "./asserts";
import { cellToTarget } from "./cellToTarget";
import { targetIsActive } from "./targetIsActive";

export function handleMouseDown(
  event: MouseEvent,
  {
    action,
    cell,
    scale,
    layout,
    activeTarget,
    cells,
    onCellsMoving,
    onCellsMoved,
    onCellResizing,
    onCellResized,
    onSwitchActiveTarget,
  }: {
    action: "move" | "resize";
    cell: Cell;
    scale: number;
    layout?: LayoutType;
    activeTarget: ActiveTarget | null | undefined;
    cells: Cell[];
    onCellsMoving?(info: MoveCellPayload[]): void;
    onCellsMoved?(info: MoveCellPayload[]): void;
    onCellResizing?(info: ResizeCellPayload): void;
    onCellResized?(info: ResizeCellPayload): void;
    onSwitchActiveTarget?(activeTarget: ActiveTarget | null): void;
  }
) {
  event.stopPropagation();
  // Drag node
  if (action === "resize" || !targetIsActive(cell, activeTarget)) {
    onSwitchActiveTarget?.(cellToTarget(cell));
  }

  const isAutoLayout = layout === "force" || layout === "dagre";
  if (isEdgeCell(cell)) {
    return;
  }

  const activeCells =
    activeTarget?.type === "multi" && action === "move"
      ? cells.filter((c) => targetIsActive(c, activeTarget))
      : [cell];

  const movableActiveCells = activeCells.filter(
    (c) => (isNodeCell(c) && !isAutoLayout) || isDecoratorCell(c)
  ) as (NodeCell | DecoratorCell)[];

  if (movableActiveCells.length === 0) {
    return;
  }

  const from: PositionTuple = [event.clientX, event.clientY];
  const originals = movableActiveCells.map((c) => ({
    cell: c,
    position:
      action === "move" ? [c.view.x, c.view.y] : [c.view.width, c.view.height],
  }));

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
    if (moved) {
      if (action === "move") {
        const payloads = originals.map(({ cell, position }) => ({
          type: cell.type,
          id: cell.id,
          x: position[0] + movement[0],
          y: position[1] + movement[1],
          width: cell.view.width,
          height: cell.view.height,
          decorator: isDecoratorCell(cell) ? cell.decorator : undefined,
        }));
        (finished ? onCellsMoved : onCellsMoving)?.(payloads);
      } else {
        (finished ? onCellResized : onCellResizing)?.({
          type: cell.type,
          id: cell.id,
          width: originals[0].position[0] + movement[0],
          height: originals[0].position[1] + movement[1],
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
