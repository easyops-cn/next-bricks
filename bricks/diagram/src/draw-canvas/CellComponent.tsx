import React, { useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import type {
  ActiveTarget,
  Cell,
  CellContextMenuDetail,
  NodeBrickConf,
} from "./interfaces";
import { isDecoratorCell, isEdgeCell, isNodeCell } from "./processors/asserts";
import { EdgeComponent } from "./EdgeComponent";
import { NodeComponent } from "./NodeComponent";
import { handleMouseDown } from "./processors/handleMouseDown";
import type { MoveCellPayload, ResizeCellPayload } from "./reducers/interfaces";
import { DecoratorComponent } from "./decorators";
import { cellToTarget } from "./processors/cellToTarget";

export interface CellComponentProps {
  cell: Cell;
  cells: Cell[];
  defaultNodeBricks?: NodeBrickConf[];
  markerEnd: string;
  active: boolean;
  onCellMoving(info: MoveCellPayload): void;
  onCellMoved(info: MoveCellPayload): void;
  onCellResizing(info: ResizeCellPayload): void;
  onCellResized(info: ResizeCellPayload): void;
  onSwitchActiveTarget(target: ActiveTarget | null): void;
  onCellContextMenu(detail: CellContextMenuDetail): void;
}

export function CellComponent({
  cell,
  cells,
  defaultNodeBricks,
  markerEnd,
  active,
  onCellMoving,
  onCellMoved,
  onCellResizing,
  onCellResized,
  onSwitchActiveTarget,
  onCellContextMenu,
}: CellComponentProps): JSX.Element | null {
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = gRef.current;
    const onMouseDown = (event: MouseEvent) => {
      handleMouseDown(event, {
        action: "move",
        cell,
        onCellMoving,
        onCellMoved,
        onSwitchActiveTarget,
      });
    };
    g?.addEventListener("mousedown", onMouseDown);
    return () => {
      g?.removeEventListener("mousedown", onMouseDown);
    };
  }, [cell, onCellMoved, onCellMoving, onSwitchActiveTarget]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      event.preventDefault();
      onSwitchActiveTarget(cellToTarget(cell));
      onCellContextMenu({
        cell,
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [cell, onCellContextMenu, onSwitchActiveTarget]
  );

  return (
    <g
      className={classNames("cell", { active })}
      ref={gRef}
      transform={
        cell.type === "edge"
          ? undefined
          : `translate(${cell.view.x} ${cell.view.y})`
      }
      onContextMenu={handleContextMenu}
    >
      {isNodeCell(cell) ? (
        <NodeComponent node={cell} defaultNodeBricks={defaultNodeBricks} />
      ) : isEdgeCell(cell) ? (
        <EdgeComponent edge={cell} cells={cells} markerEnd={markerEnd} />
      ) : isDecoratorCell(cell) ? (
        <DecoratorComponent
          cell={cell}
          onCellResizing={onCellResizing}
          onCellResized={onCellResized}
          onSwitchActiveTarget={onSwitchActiveTarget}
        />
      ) : null}
    </g>
  );
}
