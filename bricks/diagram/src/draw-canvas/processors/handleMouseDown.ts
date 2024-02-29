import type { PositionTuple, RefRepository } from "../../diagram/interfaces";
import type { Cell, NodeCell } from "../interfaces";
import type { MoveNodePayload } from "../reducers/interfaces";
import { findNode } from "./findNode";

export function handleMouseDown(
  event: MouseEvent,
  {
    cells,
    nodesRefRepository,
    onNodeMoving,
    onNodeMoved,
  }: {
    cells: Cell[];
    nodesRefRepository: RefRepository | null;
    onNodeMoving(info: MoveNodePayload): void;
    onNodeMoved(info: MoveNodePayload): void;
  }
) {
  function matchNode(
    match: (element: HTMLElement) => boolean
  ): [cell: NodeCell, element: HTMLElement] | undefined {
    if (nodesRefRepository) {
      for (const [id, element] of nodesRefRepository) {
        if (match(element)) {
          const cell = findNode(cells, id);
          if (cell) {
            return [cell, element];
          }
        }
      }
    }
  }

  const source = matchNode((element) =>
    element.contains(event.target as Node | null)
  );

  if (!source) {
    return;
  }

  const [sourceCell, sourceElement] = source;

  event.stopPropagation();

  const scale = 1;
  const from: PositionTuple = [event.clientX, event.clientY];
  const sourceCellContainer =
    sourceElement.parentNode as SVGForeignObjectElement;
  const sourceOriginalPosition = [
    sourceCellContainer.x.baseVal.value,
    sourceCellContainer.y.baseVal.value,
  ];

  function getMovement(e: MouseEvent): PositionTuple {
    return [(e.clientX - from[0]) / scale, (e.clientY - from[1]) / scale];
  }

  function adjustNodePosition(x: number, y: number) {
    sourceCellContainer.x.baseVal.value = x;
    sourceCellContainer.y.baseVal.value = y;
  }

  function getNewPosition(movement: PositionTuple): PositionTuple {
    return [
      sourceOriginalPosition[0] + movement[0],
      sourceOriginalPosition[1] + movement[1],
    ];
  }

  let moved = false;

  const handleMove = (e: MouseEvent, finished?: boolean) => {
    // Respect the scale
    const movement = getMovement(e);
    if (!moved) {
      moved = movement[0] ** 2 + movement[1] ** 2 >= 9;
    }
    const [x, y] = getNewPosition(movement);
    adjustNodePosition(x, y);
    if (moved) {
      (finished ? onNodeMoved : onNodeMoving)({
        id: sourceCell.id,
        x,
        y,
      });
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
