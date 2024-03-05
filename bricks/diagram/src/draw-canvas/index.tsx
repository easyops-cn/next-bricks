import React, {
  createRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import type { UseSingleBrickConf } from "@next-core/react-runtime";
import { unwrapProvider } from "@next-core/utils/general";
import "@next-core/theme";
import { uniqueId } from "lodash";
import type { lockBodyScroll as _lockBodyScroll } from "@next-bricks/basic/data-providers/lock-body-scroll/lock-body-scroll";
import type { PositionTuple, SizeTuple } from "../diagram/interfaces";
import type {
  ActiveTarget,
  Cell,
  EdgeCell,
  InitialCell,
  NodeBrickConf,
  NodeCell,
  NodeId,
  DecoratorCell,
  DecoratorType,
  CellContextMenuDetail,
  ConnectLineState,
  Deferred,
  ConnectNodesDetail,
} from "./interfaces";
import { rootReducer } from "./reducers";
import { MarkerComponent } from "../diagram/MarkerComponent";
import { isInitialNodeCell, isNodeCell } from "./processors/asserts";
import type { MoveCellPayload, ResizeCellPayload } from "./reducers/interfaces";
import { sameTarget } from "./processors/sameTarget";
import { handleKeyboard } from "./processors/handleKeyboard";
import { CellComponent } from "./CellComponent";
import styleText from "./styles.shadow.css";
import { ConnectLineComponent } from "./ConnectLineComponent";

const DEFAULT_NODE_SIZE = 20;
const DEFAULT_AREA_WIDTH = 100;
const DEFAULT_AREA_HEIGHT = 60;

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);

const { defineElement, property, method, event } = createDecorators();

export interface EoDrawCanvasProps {
  cells: InitialCell[] | undefined;
  defaultNodeSize?: SizeTuple;
  defaultNodeBricks?: NodeBrickConf[];
  activeTarget?: ActiveTarget | null;
}

export interface DropNodeInfo extends AddNodeInfo {
  /** [PointerEvent::clientX, PointerEvent::clientY] */
  position: PositionTuple;
}

export interface DropDecoratorInfo {
  decorator: DecoratorType;
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

  @property({ attribute: false })
  accessor activeTarget: ActiveTarget | null | undefined;

  @event({ type: "activeTarget.change" })
  accessor #activeTargetChangeEvent!: EventEmitter<ActiveTarget | null>;

  #handleActiveTargetChange = (target: ActiveTarget | null) => {
    this.#activeTargetChangeEvent.emit(target);
  };

  #handleSwitchActiveTarget = (target: ActiveTarget | null) => {
    if (!sameTarget(target, this.activeTarget)) {
      this.activeTarget = target;
    }
  };

  /**
   * @deprecated Use `cell.move` instead.
   */
  @event({ type: "node.move" })
  accessor #nodeMoveEvent!: EventEmitter<MoveCellPayload>;

  @event({ type: "cell.move" })
  accessor #cellMoveEvent!: EventEmitter<MoveCellPayload>;

  #handleCellMove = (info: MoveCellPayload) => {
    this.#cellMoveEvent.emit(info);
    if (info.type === "node") {
      this.#nodeMoveEvent.emit(info);
    }
  };

  @event({ type: "cell.resize" })
  accessor #cellResizeEvent!: EventEmitter<ResizeCellPayload>;

  #handleCellResize = (info: ResizeCellPayload) => {
    this.#cellResizeEvent.emit(info);
  };

  /**
   * @deprecated Use `cell.delete` instead.
   */
  @event({ type: "node.delete" })
  accessor #nodeDelete!: EventEmitter<Cell>;

  @event({ type: "cell.delete" })
  accessor #cellDelete!: EventEmitter<Cell>;

  #handleCellDelete = (cell: Cell) => {
    this.#cellDelete.emit(cell);
    if (cell.type === "node") {
      this.#nodeDelete.emit(cell);
    }
  };

  @event({ type: "cell.contextmenu" })
  accessor #cellContextMenu!: EventEmitter<CellContextMenuDetail>;

  #handleCellContextMenu = (detail: CellContextMenuDetail) => {
    this.#cellContextMenu.emit(detail);
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
  async dropDecorator({
    position,
    decorator,
  }: DropDecoratorInfo): Promise<DecoratorCell | null> {
    // Drag and then drop a node
    const droppedInside = document
      .elementsFromPoint?.(position[0], position[1])
      ?.includes(this);
    if (droppedInside) {
      const boundingClientRect = this.getBoundingClientRect();
      const newDecorator: DecoratorCell = {
        type: "decorator",
        decorator,
        id: uuidV4(),
        view: {
          x: position[0] - boundingClientRect.left,
          y: position[1] - boundingClientRect.top,
          width: DEFAULT_AREA_WIDTH,
          height: DEFAULT_AREA_HEIGHT,
        },
      };
      this.#canvasRef.current?.dropDecorator(newDecorator);
      return newDecorator;
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

  @method()
  manuallyConnectNodes(source: NodeId): Promise<ConnectNodesDetail> {
    return this.#canvasRef.current!.manuallyConnectNodes(source);
  }

  #canvasRef = createRef<DrawCanvasRef>();

  disconnectedCallback(): void {
    super.disconnectedCallback();
    lockBodyScroll(this, false);
  }

  render() {
    return (
      <EoDrawCanvasComponent
        host={this}
        ref={this.#canvasRef}
        cells={this.cells}
        defaultNodeSize={this.defaultNodeSize}
        defaultNodeBricks={this.defaultNodeBricks}
        activeTarget={this.activeTarget}
        onActiveTargetChange={this.#handleActiveTargetChange}
        onSwitchActiveTarget={this.#handleSwitchActiveTarget}
        onCellMove={this.#handleCellMove}
        onCellResize={this.#handleCellResize}
        onCellDelete={this.#handleCellDelete}
        onCellContextMenu={this.#handleCellContextMenu}
      />
    );
  }
}

export interface EoDrawCanvasComponentProps extends EoDrawCanvasProps {
  host: HTMLElement;
  onActiveTargetChange(target: ActiveTarget | null): void;
  onSwitchActiveTarget(target: ActiveTarget | null): void;
  onCellMove(info: MoveCellPayload): void;
  onCellResize(cell: ResizeCellPayload): void;
  onCellDelete(cell: Cell): void;
  onCellContextMenu(detail: CellContextMenuDetail): void;
}

export interface DrawCanvasRef {
  dropNode(node: NodeCell): void;
  dropDecorator(decorator: DecoratorCell): void;
  addNodes(nodes: NodeCell[]): void;
  addEdge(edge: EdgeCell): void;
  manuallyConnectNodes(source: NodeId): Promise<ConnectNodesDetail>;
}

function LegacyEoDrawCanvasComponent(
  {
    host,
    cells: initialCells,
    defaultNodeSize,
    defaultNodeBricks,
    activeTarget: _activeTarget,
    onActiveTargetChange,
    onSwitchActiveTarget,
    onCellMove,
    onCellResize,
    onCellDelete,
    onCellContextMenu,
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

  const rootRef = useRef<SVGSVGElement>(null);
  const cellsRef = useRef<SVGGElement>(null);
  const manualConnectDeferredRef = useRef<Deferred<ConnectNodesDetail> | null>(
    null
  );

  const [connectLineState, setConnectLineState] =
    useState<ConnectLineState | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      dropNode(node) {
        dispatch({ type: "drop-node", payload: node });
      },
      dropDecorator(decorator) {
        dispatch({ type: "drop-decorator", payload: decorator });
      },
      addNodes(nodes) {
        dispatch({ type: "add-nodes", payload: nodes });
      },
      addEdge(edge) {
        dispatch({ type: "add-edge", payload: edge });
      },
      manuallyConnectNodes(sourceId) {
        const source = cells.find(
          (cell) => isNodeCell(cell) && cell.id === sourceId
        ) as NodeCell | undefined;
        if (source) {
          const rect = rootRef.current!.getBoundingClientRect();
          setConnectLineState({
            source,
            from: [
              source.view.x + source.view.width / 2,
              source.view.y + source.view.height / 2,
            ],
            offset: [rect.left, rect.top],
          });
          const promise = new Promise<ConnectNodesDetail>((resolve, reject) => {
            manualConnectDeferredRef.current = { resolve, reject };
          });
          return promise;
        }
        return Promise.reject(null);
      },
    }),
    [cells]
  );

  const handleConnect = useCallback(
    (state: ConnectLineState, to: PositionTuple) => {
      // Find the target node from top bo bottom,
      // detect whether the pointer is inside the target node.
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        // Currently ignore connecting to self
        if (isNodeCell(cell) && cell.id !== state.source.id) {
          if (
            cell.view.x < to[0] &&
            cell.view.x + cell.view.width > to[0] &&
            cell.view.y < to[1] &&
            cell.view.y + cell.view.height > to[1]
          ) {
            manualConnectDeferredRef.current?.resolve({
              source: state.source,
              target: cell,
            });
            break;
          }
        }
      }
      manualConnectDeferredRef.current?.reject(null);
      setConnectLineState(null);
    },
    [cells]
  );

  useEffect(() => {
    lockBodyScroll(host, !!connectLineState);
  }, [connectLineState, host]);

  const newActiveTarget = _activeTarget ?? null;
  const [activeTarget, setActiveTarget] = useState<ActiveTarget | null>(
    newActiveTarget
  );

  useEffect(() => {
    setActiveTarget((previous) =>
      sameTarget(previous, newActiveTarget) ? previous : newActiveTarget
    );
  }, [newActiveTarget]);

  const activeTargetChangeInitialized = useRef(false);
  useEffect(() => {
    if (!activeTargetChangeInitialized.current) {
      activeTargetChangeInitialized.current = true;
      return;
    }
    onActiveTargetChange(activeTarget);
  }, [activeTarget, onActiveTargetChange]);

  useEffect(() => {
    if (!activeTarget) {
      return;
    }
    const resetActiveTarget = (e: MouseEvent) => {
      const path = e.composedPath();
      const cellsContainerIndex = path.indexOf(cellsRef.current!);
      // Reset active target to null when clicking outside of the cells container,
      // Or inside the cells container but not on any cell.
      if (cellsContainerIndex <= 0) {
        setActiveTarget(null);
      }
    };
    document.addEventListener("click", resetActiveTarget);
    return () => {
      document.removeEventListener("click", resetActiveTarget);
    };
  }, [activeTarget]);

  useEffect(() => {
    const root = rootRef.current;
    const onKeydown = (event: KeyboardEvent) => {
      const action = handleKeyboard(event, {
        cells,
        activeTarget,
      });

      if (action?.action === "delete-cell") {
        onCellDelete(action.cell);
      }
    };
    root?.addEventListener("keydown", onKeydown);
    return () => {
      root?.removeEventListener("keydown", onKeydown);
    };
  }, [activeTarget, cells, onCellDelete]);

  const defPrefix = useMemo(() => `${uniqueId("diagram-")}-`, []);
  const markerPrefix = `${defPrefix}line-arrow-`;
  const markerEnd = `${markerPrefix}1`;

  const handleCellMoving = useCallback((info: MoveCellPayload) => {
    dispatch({ type: "move-cell", payload: info });
  }, []);

  const handleCellMoved = useCallback(
    (info: MoveCellPayload) => {
      dispatch({ type: "move-cell", payload: info });
      onCellMove(info);
    },
    [onCellMove]
  );

  const handleCellResizing = useCallback((info: ResizeCellPayload) => {
    dispatch({ type: "resize-cell", payload: info });
  }, []);

  const handleCellResized = useCallback(
    (info: ResizeCellPayload) => {
      dispatch({ type: "resize-cell", payload: info });
      onCellResize(info);
    },
    [onCellResize]
  );

  return (
    // Todo(steve): canvas size
    <svg width={1000} height={800} ref={rootRef} className="root" tabIndex={-1}>
      <defs>
        <MarkerComponent id={markerEnd} type="arrow" strokeColor="gray" />
      </defs>
      <g className="cells" ref={cellsRef}>
        {cells.map((cell) => (
          <CellComponent
            key={`${cell.type}:${cell.type === "edge" ? `${cell.source}~${cell.target}` : cell.id}`}
            cell={cell}
            cells={cells}
            defaultNodeBricks={defaultNodeBricks}
            markerEnd={markerEnd}
            active={sameTarget(activeTarget, cell)}
            onCellMoving={handleCellMoving}
            onCellMoved={handleCellMoved}
            onCellResizing={handleCellResizing}
            onCellResized={handleCellResized}
            onSwitchActiveTarget={onSwitchActiveTarget}
            onCellContextMenu={onCellContextMenu}
          />
        ))}
      </g>
      <ConnectLineComponent
        connectLineState={connectLineState}
        markerEnd={markerEnd}
        onConnect={handleConnect}
      />
    </svg>
  );
}

function uuidV4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
