import React, { useCallback, useEffect, useMemo, useRef } from "react";
import classNames from "classnames";
import type {
  ActiveTarget,
  Cell,
  CellContextMenuDetail,
  ComputedEdgeLineConf,
  DecoratorTextChangeDetail,
  EdgeCell,
  LayoutType,
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
  layout: LayoutType;
  cell: Cell;
  cells: Cell[];
  degraded: boolean;
  degradedNodeLabel?: string;
  defaultNodeBricks?: NodeBrickConf[];
  transform: TransformLiteral;
  lineConfMap: WeakMap<EdgeCell, ComputedEdgeLineConf>;
  active: boolean;
  readOnly?: boolean;
  unrelatedCells: Cell[];
  onCellMoving?(info: MoveCellPayload): void;
  onCellMoved?(info: MoveCellPayload): void;
  onCellResizing?(info: ResizeCellPayload): void;
  onCellResized?(info: ResizeCellPayload): void;
  onSwitchActiveTarget(target: ActiveTarget | null): void;
  onCellContextMenu(detail: CellContextMenuDetail): void;
  onCellClick?(detail: CellContextMenuDetail): void;
  onDecoratorTextEditing?(detail: { id: string; editing: boolean }): void;
  onDecoratorTextChange?(detail: DecoratorTextChangeDetail): void;
  onNodeBrickResize(id: string, size: SizeTuple | null): void;
  onCellMouseEnter?(cell: Cell): void;
  onCellMouseLeave?(cell: Cell): void;
}

export function CellComponent({
  layout,
  cell,
  cells,
  degraded,
  degradedNodeLabel,
  defaultNodeBricks,
  lineConfMap,
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
  onCellClick,
  onDecoratorTextEditing,
  onDecoratorTextChange,
  onNodeBrickResize,
  onCellMouseEnter,
  onCellMouseLeave,
}: CellComponentProps): JSX.Element | null {
  const gRef = useRef<SVGGElement>(null);

  const unrelated = useMemo(
    () => unrelatedCells.some((item) => sameTarget(item, cell)),
    [cell, unrelatedCells]
  );

  useEffect(() => {
    const g = gRef.current;
    if (!g) {
      return;
    }
    const onMouseDown = (event: MouseEvent) => {
      if (readOnly) {
        event.stopPropagation();
      } else {
        handleMouseDown(event, {
          layout,
          action: "move",
          cell,
          scale: transform.k,
          onCellMoving,
          onCellMoved,
          onSwitchActiveTarget,
        });
      }
    };
    g.addEventListener("mousedown", onMouseDown);
    return () => {
      g.removeEventListener("mousedown", onMouseDown);
    };
  }, [
    layout,
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

  const handleCellClick = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      if (!onCellClick || cell.type === "decorator") {
        return;
      }
      onCellClick({
        cell,
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [cell, onCellClick]
  );

  const handleMouseEnter = useCallback(() => {
    onCellMouseEnter?.(cell);
  }, [cell, onCellMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    onCellMouseLeave?.(cell);
  }, [cell, onCellMouseLeave]);

  return (
    <g
      className={classNames("cell", {
        active,
        faded: unrelated,
        "read-only": readOnly,
      })}
      ref={gRef}
      transform={
        cell.type === "edge" || cell.view.x == null
          ? undefined
          : `translate(${cell.view.x} ${cell.view.y})`
      }
      onContextMenu={handleContextMenu}
      onClick={handleCellClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isNodeCell(cell) ? (
        <NodeComponent
          node={cell}
          degraded={degraded}
          degradedNodeLabel={degradedNodeLabel}
          defaultNodeBricks={defaultNodeBricks}
          onResize={onNodeBrickResize}
        />
      ) : isEdgeCell(cell) ? (
        <EdgeComponent edge={cell} cells={cells} lineConfMap={lineConfMap} />
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
