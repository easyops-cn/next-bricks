import React, { useCallback, useState } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import {
  ReactUseBrick,
  type UseSingleBrickConf,
} from "@next-core/react-runtime";
import "@next-core/theme";
import type { PositionTuple, SizeTuple } from "../diagram/interfaces";
import type { Cell, NodeCell } from "./interfaces";
import { Shape } from "./shapes/Shape";
import styleText from "./styles.shadow.css";
import { HoverState, HoverStateContext } from "./HoverStateContext";

const { defineElement, property, method, event } = createDecorators();

export interface EoDrawCanvasProps {
  cells: Cell[] | undefined;
  // add(...args: unknown[]): unknown;

  // undo(...args: unknown[]): unknown;
  // redo(...args: unknown[]): unknown;

  // setActiveTargets(targets: Cell[]): void;

  // toggleActiveTargets(targets: Cell[]): void;
}

/**
 * 构件 `eo-draw-canvas`
 */
export
@defineElement("eo-draw-canvas", {
  styleTexts: [styleText],
})
class EoDrawCanvas extends ReactNextElement implements EoDrawCanvasProps {
  @property({ attribute: false })
  accessor cells: Cell[] | undefined;

  @event({ type: "cells.change" })
  accessor #cellsChangeEvent!: EventEmitter<Cell[]>;

  #handleCellsChange = (cells: Cell[]) => {
    this.#cellsChangeEvent.emit(cells);
  };

  @method()
  async drop({
    id,
    position,
    size,
    data,
    useBrick,
  }: {
    id: string | number;
    /** [PointerEvent::clientX, PointerEvent::clientY] */
    position: PositionTuple;
    size: SizeTuple;
    data: unknown;
    useBrick: UseSingleBrickConf;
  }): Promise<NodeCell | null> {
    // Drag and then drop a node
    const droppedInside = document
      .elementsFromPoint?.(position[0], position[1])
      ?.includes(this);
    if (droppedInside) {
      const boundingClientRect = this.getBoundingClientRect();
      return {
        id,
        view: {
          x: position[0] - boundingClientRect.left,
          y: position[1] - boundingClientRect.top,
          width: size[0],
          height: size[1],
        },
        data,
        useBrick,
      };
    }
    return null;
  }

  @method()
  async add(): Promise<void> {
    // Add a node
  }

  render() {
    return (
      <EoDrawCanvasComponent
        cells={this.cells}
        onCellsChange={this.#handleCellsChange}
      />
    );
  }
}

export interface EoDrawCanvasComponentProps extends EoDrawCanvasProps {
  onCellsChange?(cells: Cell[]): void;
}

export function EoDrawCanvasComponent({ cells }: EoDrawCanvasComponentProps) {
  const [hoverState, setHoverState] = useState<HoverState | null>(null);

  // console.log("hover:", hoverState);

  const unsetActivePointIndex = useCallback(() => {
    setHoverState((prev) =>
      prev?.activePointIndex === undefined
        ? prev
        : { ...hoverState!, activePointIndex: undefined }
    );
  }, [hoverState]);

  const hoverPadding = 5;

  return (
    <HoverStateContext.Provider value={{ setHoverState }}>
      <svg width={800} height={600}>
        <g>
          {cells?.map((cell, index) =>
            cell.tag === "shape" ? (
              <Shape key={index} cell={cell} />
            ) : cell.useBrick ? (
              <foreignObject
                key={index}
                x={cell.view.x}
                y={cell.view.y}
                width={cell.view.width}
                height={cell.view.height}
                style={{ overflow: "visible" }}
              >
                <ReactUseBrick useBrick={cell.useBrick} />
              </foreignObject>
            ) : null
          )}
        </g>
        <g>
          {hoverState && (
            <g
              pointerEvents="all"
              onMouseEnter={unsetActivePointIndex}
              onMouseLeave={() => setHoverState(null)}
            >
              <rect
                x={hoverState.cell.view.x - hoverPadding}
                y={hoverState.cell.view.y - hoverPadding}
                width={hoverState.cell.view.width + hoverPadding * 2}
                height={hoverState.cell.view.height + hoverPadding * 2}
                fill="none"
                stroke="none"
                pointerEvents="all"
              />
              <rect
                x={hoverState.cell.view.x}
                y={hoverState.cell.view.y}
                width={hoverState.cell.view.width}
                height={hoverState.cell.view.height}
                fill="none"
                stroke="cyan"
              />
              {hoverState?.activePointIndex !== undefined && (
                <circle
                  cx={hoverState.points[hoverState.activePointIndex].x}
                  cy={hoverState.points[hoverState.activePointIndex].y}
                  r={10}
                  fill="blue"
                />
              )}
              {hoverState.points.map((p, index) => (
                <circle
                  key={index}
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill="red"
                  onMouseEnter={() =>
                    setHoverState({ ...hoverState, activePointIndex: index })
                  }
                  onMouseLeave={unsetActivePointIndex}
                />
              ))}
            </g>
          )}
        </g>
      </svg>
    </HoverStateContext.Provider>
  );
}
