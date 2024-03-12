import React, { useCallback, useEffect, useMemo, useRef } from "react";
import classNames from "classnames";
import type {
  ActiveTarget,
  Cell,
  CellContextMenuDetail,
  DecoratorTextChangeDetail,
  EdgeLineConf,
  NodeBrickConf,
} from "./interfaces";
import { isDecoratorCell, isEdgeCell, isNodeCell } from "./processors/asserts";
import { EdgeComponent } from "./EdgeComponent";
import { NodeComponent } from "./NodeComponent";
import { handleMouseDown } from "./processors/handleMouseDown";
import type { MoveCellPayload, ResizeCellPayload } from "./reducers/interfaces";
import { DecoratorComponent } from "./decorators";
import { cellToTarget } from "./processors/cellToTarget";
import type { SizeTuple, TransformLiteral } from "../diagram/interfaces";
import { sameTarget } from "./processors/sameTarget";

export interface CellComponentProps {
  cell: Cell;
  cells: Cell[];
  defaultNodeBricks?: NodeBrickConf[];
  defaultEdgeLines?: EdgeLineConf[];
  transform: TransformLiteral;
  markerEnd: string;
  active: boolean;
  readOnly?: boolean;
  unrelatedCells: Cell[];
  onCellMoving?(info: MoveCellPayload): void;
  onCellMoved?(info: MoveCellPayload): void;
  onCellResizing?(info: ResizeCellPayload): void;
  onCellResized?(info: ResizeCellPayload): void;
  onSwitchActiveTarget(target: ActiveTarget | null): void;
  onCellContextMenu(detail: CellContextMenuDetail): void;
  onDecoratorTextEditing?(detail: { id: string; editing: boolean }): void;
  onDecoratorTextChange?(detail: DecoratorTextChangeDetail): void;
  onNodeBrickResize(id: string, size: SizeTuple | null): void;
}

export function CellComponent({
  cell,
  cells,
  defaultNodeBricks,
  defaultEdgeLines,
  markerEnd,
  active,
  readOnly,
  transform,
  unrelatedCells,
  onCellMoving,
  onCellMoved,
  onCellResizing,
  onCellResized,
  onSwitchActiveTarget,
  onCellContextMenu,
  onDecoratorTextEditing,
  onDecoratorTextChange,
  onNodeBrickResize,
}: CellComponentProps): JSX.Element | null {
  const gRef = useRef<SVGGElement>(null);

  const unrelated = useMemo(
    () => unrelatedCells.some((item) => sameTarget(item, cell)),
    [cell, unrelatedCells]
  );

  useEffect(() => {
    const g = gRef.current;
    if (!g || readOnly) {
      return;
    }
    const onMouseDown = (event: MouseEvent) => {
      handleMouseDown(event, {
        action: "move",
        cell,
        scale: transform.k,
        onCellMoving,
        onCellMoved,
        onSwitchActiveTarget,
      });
    };
    g.addEventListener("mousedown", onMouseDown);
    return () => {
      g.removeEventListener("mousedown", onMouseDown);
    };
  }, [
    cell,
    onCellMoved,
    onCellMoving,
    onSwitchActiveTarget,
    readOnly,
    transform.k,
  ]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      if (readOnly && cell.type === "decorator") {
        return;
      }
      event.preventDefault();
      onSwitchActiveTarget(cellToTarget(cell));
      onCellContextMenu({
        cell,
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [cell, onCellContextMenu, onSwitchActiveTarget, readOnly]
  );

  return (
    <g
      className={classNames("cell", {
        active,
        faded: unrelated,
        "read-only": readOnly,
      })}
      ref={gRef}
      transform={
        cell.type === "edge"
          ? undefined
          : `translate(${cell.view.x} ${cell.view.y})`
      }
      onContextMenu={handleContextMenu}
    >
      {isNodeCell(cell) ? (
        <NodeComponent
          node={cell}
          defaultNodeBricks={defaultNodeBricks}
          onResize={onNodeBrickResize}
        />
      ) : isEdgeCell(cell) ? (
        <EdgeComponent
          edge={cell}
          defaultEdgeLines={defaultEdgeLines}
          cells={cells}
          markerEnd={markerEnd}
        />
      ) : isDecoratorCell(cell) ? (
        <DecoratorComponent
          cell={cell}
          transform={transform}
          readOnly={readOnly}
          onCellResizing={onCellResizing}
          onCellResized={onCellResized}
          onSwitchActiveTarget={onSwitchActiveTarget}
          onDecoratorTextEditing={onDecoratorTextEditing}
          onDecoratorTextChange={onDecoratorTextChange}
        />
      ) : null}
    </g>
  );
}
