import type { PositionTuple } from "../../diagram/interfaces";
import { DEFAULT_SNAP_GRID_SIZE } from "../constants";
import type {
  ActiveTarget,
  Cell,
  LayoutOptions,
  DecoratorCell,
  LayoutType,
  NodeCell,
} from "../interfaces";
import type {
  MoveCellPayload,
  ResizeCellPayload,
} from "../reducers/interfaces";
import {
  isContainerDecoratorCell,
  isDecoratorCell,
  isEdgeCell,
  isNodeCell,
} from "./asserts";
import { cellToTarget } from "./cellToTarget";
import { targetIsActive } from "./targetIsActive";

export function handleMouseDown(
  event: MouseEvent,
  {
    action,
    cell,
    scale,
    layout,
    layoutOptions,
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
    layoutOptions?: LayoutOptions;
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
  const activeCells: Cell[] = [];
  const actives =
    activeTarget?.type === "multi" && action === "move"
      ? cells.filter((c) => targetIsActive(c, activeTarget))
      : [cell];
  actives.forEach((a) => {
    activeCells.push(a);
    if (isContainerDecoratorCell(a) && action === "move") {
      activeCells.push(
        ...cells.filter((c) => isNodeCell(c) && c.containerId === a.id)
      );
    }
  });
  const movableActiveCells = activeCells.filter(
    (c) => (isNodeCell(c) && !isAutoLayout) || isDecoratorCell(c)
  ) as (NodeCell | DecoratorCell)[];

  if (movableActiveCells.length === 0) {
    return;
  }

  const snapToGrid = layoutOptions?.snapToGrid
    ? layoutOptions.snapToGrid === true
      ? {}
      : layoutOptions.snapToGrid
    : null;
  const snapToGridSize = snapToGrid?.size ?? DEFAULT_SNAP_GRID_SIZE;

  const from: PositionTuple = [event.clientX, event.clientY];
  const originals = movableActiveCells.map<{
    cell: NodeCell | DecoratorCell;
    position: PositionTuple;
  }>((c) => ({
    cell: c,
    position:
      action === "move" ? [c.view.x, c.view.y] : [c.view.width, c.view.height],
  }));
  const firstOriginalPosition = originals[0].position;
  let previousPositions = originals.map(({ position }) => position);

  function getMovement(e: MouseEvent): PositionTuple {
    return [(e.clientX - from[0]) / scale, (e.clientY - from[1]) / scale];
  }
  let moved = false;

  const handleMove = (e: MouseEvent, finished?: boolean) => {
    // Respect the scale
    const movement = getMovement(e);
    let newPositions: PositionTuple[];

    // Use alt key (or option key ⌥ on Mac) to disable snap
    if (!snapToGrid || e.altKey) {
      // No snap
      newPositions = originals.map(({ position }) => [
        position[0] + movement[0],
        position[1] + movement[1],
      ]);
      if (!moved) {
        moved = movement[0] ** 2 + movement[1] ** 2 >= 9;
      }
    } else {
      // Snap: use the first cell to decide the snap position
      const firstNewPosition: PositionTuple = [
        Math.round((firstOriginalPosition[0] + movement[0]) / snapToGridSize) *
          snapToGridSize,
        Math.round((firstOriginalPosition[1] + movement[1]) / snapToGridSize) *
          snapToGridSize,
      ];
      const snapMovement: PositionTuple = [
        firstNewPosition[0] - firstOriginalPosition[0],
        firstNewPosition[1] - firstOriginalPosition[1],
      ];
      newPositions = originals.map(({ position }) => [
        Math.round(position[0] + snapMovement[0]),
        Math.round(position[1] + snapMovement[1]),
      ]);
      const changed =
        firstNewPosition[0] !== previousPositions[0][0] ||
        firstNewPosition[1] !== previousPositions[0][1];
      if (changed) {
        previousPositions = newPositions;
        moved = true;
      }
    }

    if (moved) {
      if (action === "move") {
        const payloads = originals.map(({ cell }, index) => ({
          type: cell.type,
          id: cell.id,
          x: newPositions[index][0],
          y: newPositions[index][1],
          width: cell.view.width,
          height: cell.view.height,
          decorator: isDecoratorCell(cell) ? cell.decorator : undefined,
        }));
        (finished ? onCellsMoved : onCellsMoving)?.(payloads);
      } else {
        (finished ? onCellResized : onCellResizing)?.({
          type: cell.type,
          id: cell.id,
          width: newPositions[0][0],
          height: newPositions[0][1],
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
