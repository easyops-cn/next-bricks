import React, { useCallback, useEffect, useMemo, useRef } from "react";
import classNames from "classnames";
import type {
  ActiveTarget,
  Cell,
  CellContextMenuDetail,
  ComputedEdgeLineConf,
  DecoratorTextChangeDetail,
  DecoratorView,
  EdgeCell,
  LayoutOptions,
  LayoutType,
  NodeBrickConf,
  NodeCell,
} from "./interfaces";
import {
  isContainerDecoratorCell,
  isDecoratorCell,
  isEdgeCell,
  isNoManualLayout,
  isNodeCell,
} from "./processors/asserts";
import { EdgeComponent } from "./EdgeComponent";
import { NodeComponent } from "./NodeComponent";
import { handleMouseDown } from "./processors/handleMouseDown";
import type { MoveCellPayload, ResizeCellPayload } from "./reducers/interfaces";
import { DecoratorComponent } from "./decorators";
import { cellToTarget } from "./processors/cellToTarget";
import type { SizeTuple, TransformLiteral } from "../diagram/interfaces";
import { sameTarget } from "./processors/sameTarget";
import { targetIsActive } from "./processors/targetIsActive";
import { computeContainerRect } from "./processors/computeContainerRect";
import { get } from "lodash";
import { useHoverStateContext } from "./HoverStateContext";
export interface CellComponentProps {
  layout: LayoutType;
  layoutOptions?: LayoutOptions;
  cell: Cell;
  cells: Cell[];
  degraded: boolean;
  degradedNodeLabel?: string;
  defaultNodeBricks?: NodeBrickConf[];
  transform: TransformLiteral;
  lineConfMap: WeakMap<EdgeCell, ComputedEdgeLineConf>;
  activeTarget: ActiveTarget | null | undefined;
  readOnly?: boolean;
  unrelatedCells: Cell[];
  dragNodeToContainerActive?: boolean;
  onCellsMoving?(info: MoveCellPayload[]): void;
  onCellsMoved?(info: MoveCellPayload[]): void;
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
  layoutOptions,
  cell,
  cells,
  degraded,
  degradedNodeLabel,
  defaultNodeBricks,
  lineConfMap,
  activeTarget,
  dragNodeToContainerActive,
  readOnly,
  transform,
  unrelatedCells,
  onCellsMoving,
  onCellsMoved,
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
  const { smartConnectLineState, setSmartConnectLineState, onConnect } =
    useHoverStateContext();
  const gRef = useRef<SVGGElement>(null);
  const unrelated = useMemo(
    () => unrelatedCells.some((item) => sameTarget(item, cell)),
    [cell, unrelatedCells]
  );
  // `containerRect` is undefined when it's an edge cell.
  const containerRect = useMemo((): DecoratorView | undefined => {
    if (isContainerDecoratorCell(cell) && isNoManualLayout(layout)) {
      const containCells = cells.filter(
        (c): c is NodeCell => isNodeCell(c) && c.containerId === cell.id
      );
      const view = {
        ...cell.view,
        ...computeContainerRect(containCells),
      };
      cell.view = view; //Update the rect container to make sure Lasso gets the correct size
      return view;
    }
    return isEdgeCell(cell)
      ? undefined
      : get(cell, "view", { x: 0, y: 0, width: 0, height: 0 });
  }, [layout, cell, cells]);

  useEffect(() => {
    const g = gRef.current;
    if (!g) {
      return;
    }
    const onMouseDown = (event: MouseEvent) => {
      if (
        readOnly ||
        (isContainerDecoratorCell(cell) && isNoManualLayout(layout))
      ) {
        event.stopPropagation();
      } else {
        handleMouseDown(event, {
          layout,
          layoutOptions,
          action: "move",
          cell,
          scale: transform.k,
          activeTarget,
          cells,
          onCellsMoving,
          onCellsMoved,
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
    layoutOptions,
    cell,
    activeTarget,
    cells,
    onCellsMoved,
    onCellsMoving,
    onSwitchActiveTarget,
    readOnly,
    transform.k,
  ]);

  useEffect(() => {
    const g = gRef.current;
    if (!g || !isNodeCell(cell)) {
      return;
    }
    const onMouseUp = (e: MouseEvent) => {
      if (smartConnectLineState) {
        e.preventDefault();
        e.stopPropagation();
        if (smartConnectLineState.source !== cell) {
          onConnect?.(
            smartConnectLineState.source,
            cell,
            smartConnectLineState.exitPosition,
            undefined
          );
        }
        setSmartConnectLineState(null);
      }
    };
    g.addEventListener("mouseup", onMouseUp);
    return () => {
      g?.removeEventListener("mouseup", onMouseUp);
    };
  }, [cell, onConnect, setSmartConnectLineState, smartConnectLineState]);

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
        active: targetIsActive(cell, activeTarget),
        faded: unrelated,
        "read-only": readOnly,
        "container-active": dragNodeToContainerActive,
      })}
      ref={gRef}
      transform={
        cell.type === "edge" || cell.view.x == null
          ? undefined
          : `translate(${containerRect!.x} ${containerRect!.y})`
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
          view={containerRect!}
          transform={transform}
          readOnly={readOnly}
          layout={layout}
          layoutOptions={layoutOptions}
          activeTarget={activeTarget}
          cells={cells}
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
