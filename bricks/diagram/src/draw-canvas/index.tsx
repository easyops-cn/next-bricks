import React, {
  createRef,
  useImperativeHandle,
  useMemo,
  useReducer,
} from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import {
  ReactUseBrick,
  type UseSingleBrickConf,
} from "@next-core/react-runtime";
import "@next-core/theme";
import { uniqueId } from "lodash";
import type { NodeRect, PositionTuple, SizeTuple } from "../diagram/interfaces";
import type {
  BrickCell,
  Cell,
  EdgeCell,
  InitialCell,
  NodeCell,
  NodeView,
} from "./interfaces";
import { rootReducer } from "./reducers";
import { getDirectLinePoints } from "../diagram/lines/getDirectLinePoints";
import { MarkerComponent } from "../diagram/MarkerComponent";
import {
  isEdgeCell,
  isInitialNodeCell,
  isNodeCell,
} from "./processors/asserts";
import styleText from "./styles.shadow.css";

const DEFAULT_NODE_SIZE = 20;

const { defineElement, property, method } = createDecorators();

export interface EoDrawCanvasProps {
  cells: InitialCell[] | undefined;
  defaultNodeSize?: SizeTuple;
}

export interface DropNodeInfo extends AddNodeInfo {
  /** [PointerEvent::clientX, PointerEvent::clientY] */
  position: PositionTuple;
}

export interface AddNodeInfo {
  id: string | number;
  useBrick: UseSingleBrickConf;
  data?: unknown;
  size?: SizeTuple;
}

export interface AddEdgeInfo {
  source: string | number;
  target: string | number;
  data?: unknown;
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
  accessor cells: InitialCell[] | undefined;

  @property({ attribute: false })
  accessor defaultNodeSize: SizeTuple | undefined;

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
  }: DropNodeInfo): Promise<NodeCell | null> {
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
          width: size?.[0] ?? this.defaultNodeSize?.[0] ?? DEFAULT_NODE_SIZE,
          height: size?.[1] ?? this.defaultNodeSize?.[0] ?? DEFAULT_NODE_SIZE,
        },
        data,
        useBrick,
      };
      this.#canvasRef.current?.dropNode(newNode);
      return newNode;
    }
    return null;
  }

  @method()
  async addNodes(nodes: AddNodeInfo[]): Promise<NodeCell[]> {
    if (nodes.length === 0) {
      return [];
    }
    const firstNode = nodes[0];
    const width = firstNode.size?.[0] ?? DEFAULT_NODE_SIZE;
    const height = firstNode.size?.[1] ?? DEFAULT_NODE_SIZE;
    const gap = 20;
    // Todo(steve): canvas size
    const canvasHeight = 600;
    const rows = Math.floor(canvasHeight / (height + gap));
    // Assert: nodes are all brick nodes (no shape nodes)
    const positionedNodes = nodes.map<NodeCell>(({ size, ...node }, index) => ({
      ...node,
      type: "node",
      view: {
        x: Math.floor(index / rows) * (width + gap) + gap,
        y: (index % rows) * (height + gap) + gap,
        width: size?.[0] ?? this.defaultNodeSize?.[0] ?? DEFAULT_NODE_SIZE,
        height: size?.[1] ?? this.defaultNodeSize?.[0] ?? DEFAULT_NODE_SIZE,
      },
    }));
    this.#canvasRef.current?.addNodes(positionedNodes);
    return positionedNodes;
  }

  @method()
  async addEdge({ source, target, data }: AddEdgeInfo): Promise<EdgeCell> {
    const newEdge: EdgeCell = {
      type: "edge",
      source,
      target,
      data,
    };
    this.#canvasRef.current?.addEdge(newEdge);
    return newEdge;
  }

  #canvasRef = createRef<DrawCanvasRef>();

  render() {
    return (
      <EoDrawCanvasComponent
        ref={this.#canvasRef}
        cells={this.cells}
        defaultNodeSize={this.defaultNodeSize}
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
  addNodes(nodes: NodeCell[]): void;
  addEdge(edge: EdgeCell): void;
}

function LegacyEoDrawCanvasComponent(
  { cells: initialCells, defaultNodeSize }: EoDrawCanvasComponentProps,
  ref: React.Ref<DrawCanvasRef>
) {
  const [{ cells }, dispatch] = useReducer(
    rootReducer,
    initialCells,
    (initialCells) => {
      const originalCells = initialCells ?? [];
      const finalCells: Cell[] = defaultNodeSize
        ? originalCells.map<Cell>((cell) =>
            isInitialNodeCell(cell)
              ? cell.view.width === undefined || cell.view.height === undefined
                ? ({
                    ...cell,
                    view: {
                      width: defaultNodeSize[0],
                      height: defaultNodeSize[1],
                      ...cell.view,
                    },
                  } as NodeCell)
                : (cell as NodeCell)
              : (cell as EdgeCell)
          )
        : (originalCells as NodeCell[]);
      return { cells: finalCells };
    }
  );

  useImperativeHandle(
    ref,
    () => ({
      dropNode(node) {
        dispatch({ type: "drop-node", payload: node });
      },
      addNodes(nodes) {
        dispatch({ type: "add-nodes", payload: nodes });
      },
      addEdge(edge) {
        dispatch({ type: "add-edge", payload: edge });
      },
    }),
    []
  );

  const defPrefix = useMemo(() => `${uniqueId("diagram-")}-`, []);
  const markerPrefix = `${defPrefix}line-arrow-`;
  const markerEnd = `${markerPrefix}1`;

  return (
    // Todo(steve): canvas size
    <svg width={800} height={600}>
      <defs>
        <MarkerComponent id={markerEnd} type="arrow" strokeColor="gray" />
      </defs>
      <g>
        {cells.map((cell) =>
          isNodeCell(cell) ? (
            (cell as BrickCell).useBrick ? (
              <foreignObject
                key={`node:${cell.id}`}
                x={cell.view.x}
                y={cell.view.y}
                width={cell.view.width}
                height={cell.view.height}
                style={{ overflow: "visible" }}
              >
                <ReactUseBrick useBrick={(cell as BrickCell).useBrick} />
              </foreignObject>
            ) : null
          ) : isEdgeCell(cell) ? (
            <EdgeComponent
              key={`edge:${cell.source}-${cell.target}`}
              edge={cell}
              cells={cells}
              markerEnd={markerEnd}
            />
          ) : null
        )}
      </g>
    </svg>
  );
}

export interface EdgeComponentProps {
  edge: EdgeCell;
  cells: Cell[];
  markerEnd: string;
}

export function EdgeComponent({
  edge,
  cells,
  markerEnd,
}: EdgeComponentProps): JSX.Element | null {
  const nodes = useMemo(() => {
    let sourceNode: NodeCell | undefined;
    let targetNode: NodeCell | undefined;
    for (const cell of cells) {
      if (isNodeCell(cell)) {
        if (cell.id === edge.source) {
          sourceNode = cell;
        }
        if (cell.id === edge.target) {
          targetNode = cell;
        }
      }
    }
    return sourceNode && targetNode
      ? ([sourceNode, targetNode] as const)
      : null;
  }, [cells, edge.source, edge.target]);

  const padding = 5;

  const line = useMemo(
    () =>
      nodes
        ? getDirectLinePoints(
            nodeViewToNodeRect(nodes[0].view, padding),
            nodeViewToNodeRect(nodes[1].view, padding)
          )
        : null,
    [nodes]
  );

  if (!line) {
    // This happens when source or target is not found
    return null;
  }

  return (
    <path
      className="line"
      d={`M${line[0].x} ${line[0].y}L${line[1].x} ${line[1].y}`}
      fill="none"
      stroke="gray"
      markerEnd={`url(#${markerEnd})`}
    />
  );
}

function nodeViewToNodeRect(view: NodeView, padding: number): NodeRect {
  return {
    x: view.x + view.width / 2,
    y: view.y + view.height / 2,
    width: view.width + padding,
    height: view.height + padding,
  };
}
