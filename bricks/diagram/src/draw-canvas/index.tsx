import React, { createRef, useImperativeHandle, useReducer } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import {
  ReactUseBrick,
  type UseSingleBrickConf,
} from "@next-core/react-runtime";
import "@next-core/theme";
import type { PositionTuple, SizeTuple } from "../diagram/interfaces";
import type { BrickCell, Cell, NodeCell } from "./interfaces";
import { rootReducer } from "./reducers";
import styleText from "./styles.shadow.css";

const { defineElement, property, method } = createDecorators();

export interface EoDrawCanvasProps {
  cells: Cell[] | undefined;
}

export interface DropInfo {
  id: string | number;
  data: unknown;
  useBrick: UseSingleBrickConf;
  size: SizeTuple;
  /** [PointerEvent::clientX, PointerEvent::clientY] */
  position: PositionTuple;
}

export const EoDrawCanvasComponent = React.forwardRef(
  LegacyEoDrawCanvasComponent
);

/**
 * 用于手工绘图的画布。
 *
 * 注意：将配套另外一个用于展示的画布构件。
 */
export
@defineElement("eo-draw-canvas", {
  styleTexts: [styleText],
})
class EoDrawCanvas extends ReactNextElement implements EoDrawCanvasProps {
  /**
   * 仅当初始化时使用，渲染后重新设置 `cells` 将无效。
   */
  @property({ attribute: false })
  accessor cells: Cell[] | undefined;

  // @event({ type: "cells.change" })
  // accessor #cellsChangeEvent!: EventEmitter<Cell[]>;

  // #handleCellsChange = (cells: Cell[]) => {
  //   this.#cellsChangeEvent.emit(cells);
  // };

  @method()
  async dropNode({
    id,
    position,
    size,
    data,
    useBrick,
  }: DropInfo): Promise<NodeCell | null> {
    // Drag and then drop a node
    const droppedInside = document
      .elementsFromPoint?.(position[0], position[1])
      ?.includes(this);
    if (droppedInside) {
      const boundingClientRect = this.getBoundingClientRect();
      const newNode: NodeCell = {
        type: "node",
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
      this.#canvasRef.current?.dropNode(newNode);
      return newNode;
    }
    return null;
  }

  #canvasRef = createRef<DrawCanvasRef>();

  render() {
    return (
      <EoDrawCanvasComponent
        ref={this.#canvasRef}
        cells={this.cells}
        // onCellsChange={this.#handleCellsChange}
      />
    );
  }
}

export interface EoDrawCanvasComponentProps extends EoDrawCanvasProps {
  onCellsChange?(cells: Cell[]): void;
}

export interface DrawCanvasRef {
  dropNode(node: NodeCell): void;
}

function LegacyEoDrawCanvasComponent(
  { cells: initialCells }: EoDrawCanvasComponentProps,
  ref: React.Ref<DrawCanvasRef>
) {
  const [{ cells }, dispatch] = useReducer(rootReducer, {
    cells: initialCells ?? [],
  });

  useImperativeHandle(
    ref,
    () => ({
      dropNode(node) {
        dispatch({ type: "drop-node", payload: node });
      },
    }),
    []
  );

  return (
    <svg width={800} height={600}>
      <g>
        {cells.map((cell, index) =>
          (cell as BrickCell).useBrick ? (
            <foreignObject
              key={index}
              x={cell.view.x}
              y={cell.view.y}
              width={cell.view.width}
              height={cell.view.height}
              style={{ overflow: "visible" }}
            >
              <ReactUseBrick useBrick={(cell as BrickCell).useBrick} />
            </foreignObject>
          ) : null
        )}
      </g>
    </svg>
  );
}
