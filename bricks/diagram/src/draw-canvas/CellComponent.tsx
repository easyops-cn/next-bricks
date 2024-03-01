import React, { useEffect, useRef } from "react";
import type { ActiveTarget, Cell, NodeBrickConf } from "./interfaces";
import { isDecoratorCell, isEdgeCell, isNodeCell } from "./processors/asserts";
import { EdgeComponent } from "./EdgeComponent";
import { NodeComponent } from "./NodeComponent";
import { handleMouseDown } from "./processors/handleMouseDown";
import type { MoveCellPayload, ResizeCellPayload } from "./reducers/interfaces";
import { DecoratorComponent } from "./decorators";

export interface CellComponentProps {
  cell: Cell;
  cells: Cell[];
  defaultNodeBricks?: NodeBrickConf[];
  markerEnd: string;
  activeTarget: ActiveTarget | null;
  onCellMoving(info: MoveCellPayload): void;
  onCellMoved(info: MoveCellPayload): void;
  onCellResizing(info: ResizeCellPayload): void;
  onCellResized(info: ResizeCellPayload): void;
  onSwitchActiveTarget(target: ActiveTarget | null): void;
}

export function CellComponent({
  cell,
  cells,
  defaultNodeBricks,
  markerEnd,
  activeTarget,
  onCellMoving,
  onCellMoved,
  onCellResizing,
  onCellResized,
  onSwitchActiveTarget,
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

  return (
    <g
      className="cell"
      ref={gRef}
      transform={
        cell.type === "edge"
          ? undefined
          : `translate(${cell.view.x} ${cell.view.y})`
      }
    >
      {isNodeCell(cell) ? (
        <NodeComponent node={cell} defaultNodeBricks={defaultNodeBricks} />
      ) : isEdgeCell(cell) ? (
        <EdgeComponent edge={cell} cells={cells} markerEnd={markerEnd} />
      ) : isDecoratorCell(cell) ? (
        <DecoratorComponent
          cell={cell}
          active={
            activeTarget?.type === "decorator" && activeTarget.id === cell.id
          }
          onCellResizing={onCellResizing}
          onCellResized={onCellResized}
          onSwitchActiveTarget={onSwitchActiveTarget}
        />
      ) : null}
    </g>
  );
}
