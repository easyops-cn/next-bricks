import React, {
  createRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import type { UseSingleBrickConf } from "@next-core/react-runtime";
import "@next-core/theme";
import { uniqueId } from "lodash";
import type {
  PositionTuple,
  RefRepository,
  SizeTuple,
} from "../diagram/interfaces";
import type {
  Cell,
  EdgeCell,
  InitialCell,
  NodeBrickConf,
  NodeCell,
  NodeId,
} from "./interfaces";
import { rootReducer } from "./reducers";
import { MarkerComponent } from "../diagram/MarkerComponent";
import {
  isEdgeCell,
  isInitialNodeCell,
  isNodeCell,
} from "./processors/asserts";
import { EdgeComponent } from "./EdgeComponent";
import styleText from "./styles.shadow.css";
import { NodeContainer } from "./NodeComponent";
import { handleMouseDown } from "./processors/handleMouseDown";
import type { MoveNodePayload } from "./reducers/interfaces";

const DEFAULT_NODE_SIZE = 20;

const { defineElement, property, method, event } = createDecorators();

export interface EoDrawCanvasProps {
  cells: InitialCell[] | undefined;
  defaultNodeSize?: SizeTuple;
  defaultNodeBricks?: NodeBrickConf[];
}

export interface DropNodeInfo extends AddNodeInfo {
  /** [PointerEvent::clientX, PointerEvent::clientY] */
  position: PositionTuple;
}

export interface AddNodeInfo {
  id: NodeId;
  useBrick?: UseSingleBrickConf;
  data?: unknown;
  size?: SizeTuple;
}

export interface AddEdgeInfo {
  source: NodeId;
  target: NodeId;
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

  @property({ attribute: false })
  accessor defaultNodeBricks: NodeBrickConf[] | undefined;

  // @event({ type: "cells.change" })
  // accessor #cellsChangeEvent!: EventEmitter<Cell[]>;

  // #handleCellsChange = (cells: Cell[]) => {
  //   this.#cellsChangeEvent.emit(cells);
  // };

  @event({ type: "node.move" })
  accessor #nodeMoveEvent!: EventEmitter<MoveNodePayload>;

  #handleNodeMove = (info: MoveNodePayload) => {
    this.#nodeMoveEvent.emit(info);
  };

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
    const width =
      firstNode.size?.[0] ?? this.defaultNodeSize?.[0] ?? DEFAULT_NODE_SIZE;
    const height =
      firstNode.size?.[1] ?? this.defaultNodeSize?.[1] ?? DEFAULT_NODE_SIZE;
    const gap = 20;
    // Todo(steve): canvas size
    const canvasHeight = 600;
    const rows = Math.floor(canvasHeight / (height + gap));
    // Assert: nodes are all brick nodes (no shape nodes)
    const positionedNodes = nodes.map<NodeCell>(
      ({ size, useBrick, ...node }, index) => ({
        ...node,
        type: "node",
        view: {
          x: Math.floor(index / rows) * (width + gap) + gap,
          y: (index % rows) * (height + gap) + gap,
          width: size?.[0] ?? this.defaultNodeSize?.[0] ?? DEFAULT_NODE_SIZE,
          height: size?.[1] ?? this.defaultNodeSize?.[0] ?? DEFAULT_NODE_SIZE,
        },
        useBrick,
      })
    );
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
        defaultNodeBricks={this.defaultNodeBricks}
        // onCellsChange={this.#handleCellsChange}
        onNodeMove={this.#handleNodeMove}
      />
    );
  }
}

export interface EoDrawCanvasComponentProps extends EoDrawCanvasProps {
  // onCellsChange?(cells: Cell[]): void;
  onNodeMove?(info: unknown): void;
}

export interface DrawCanvasRef {
  dropNode(node: NodeCell): void;
  addNodes(nodes: NodeCell[]): void;
  addEdge(edge: EdgeCell): void;
}

function LegacyEoDrawCanvasComponent(
  {
    cells: initialCells,
    defaultNodeSize,
    defaultNodeBricks,
    onNodeMove,
  }: EoDrawCanvasComponentProps,
  ref: React.Ref<DrawCanvasRef>
) {
  const [{ cells }, dispatch] = useReducer(
    rootReducer,
    initialCells,
    (initialCells) => {
      const originalCells = initialCells ?? [];
      const finalCells: Cell[] = defaultNodeSize
        ? originalCells.map<Cell>((cell) => {
            if (
              !isInitialNodeCell(cell) ||
              (cell.view.width !== undefined && cell.view.height !== undefined)
            ) {
              return cell as NodeCell;
            }
            return {
              ...cell,
              view: {
                width: defaultNodeSize[0],
                height: defaultNodeSize[1],
                ...cell.view,
              },
            } as NodeCell;
          })
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

  const cellsRef = useRef<SVGGElement>(null);

  const refRepository = useMemo<RefRepository>(() => new Map(), []);

  const handleNodeMount = useCallback(
    (id: NodeId, element: HTMLElement | null) => {
      if (element) {
        refRepository.set(id, element);
      }
    },
    [refRepository]
  );

  const handleNodeUnmount = useCallback(
    (id: NodeId) => {
      refRepository.delete(id);
    },
    [refRepository]
  );

  const defPrefix = useMemo(() => `${uniqueId("diagram-")}-`, []);
  const markerPrefix = `${defPrefix}line-arrow-`;
  const markerEnd = `${markerPrefix}1`;

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      handleMouseDown(event, {
        cells,
        nodesRefRepository: refRepository,
        onNodeMoving(info) {
          dispatch({ type: "move-node", payload: info });
        },
        onNodeMoved(info) {
          onNodeMove?.(info);
        },
      });
    };
    // Bind mousedown event manually, since the React event handler can't work with
    // d3-zoom inside shadow DOM.
    const cellsContainer = cellsRef.current;
    cellsContainer?.addEventListener("mousedown", onMouseDown);
    return () => {
      cellsContainer?.removeEventListener("mousedown", onMouseDown);
    };
  }, [cells, onNodeMove, refRepository]);

  return (
    // Todo(steve): canvas size
    <svg width={800} height={600}>
      <defs>
        <MarkerComponent id={markerEnd} type="arrow" strokeColor="gray" />
      </defs>
      <g ref={cellsRef}>
        {cells.map((cell) =>
          isNodeCell(cell) ? (
            <NodeContainer
              key={`node:${cell.id}`}
              node={cell}
              defaultNodeBricks={defaultNodeBricks}
              onMount={handleNodeMount}
              onUnmount={handleNodeUnmount}
            />
          ) : isEdgeCell(cell) ? (
            <EdgeComponent
              key={`edge:${cell.source}~${cell.target}`}
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
