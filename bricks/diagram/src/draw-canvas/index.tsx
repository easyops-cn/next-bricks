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
import { select } from "d3-selection";
import { ZoomTransform, zoom } from "d3-zoom";
import classNames from "classnames";
import type { lockBodyScroll as _lockBodyScroll } from "@next-bricks/basic/data-providers/lock-body-scroll/lock-body-scroll";
import type {
  PositionTuple,
  RangeTuple,
  SizeTuple,
  TransformLiteral,
} from "../diagram/interfaces";
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
  EdgeLineConf,
} from "./interfaces";
import { rootReducer } from "./reducers";
import { MarkerComponent } from "../diagram/MarkerComponent";
import { isNodeCell } from "./processors/asserts";
import type { MoveCellPayload, ResizeCellPayload } from "./reducers/interfaces";
import { sameTarget } from "./processors/sameTarget";
import { handleKeyboard } from "./processors/handleKeyboard";
import { CellComponent } from "./CellComponent";
import styleText from "./styles.shadow.css";
import { ConnectLineComponent } from "./ConnectLineComponent";
import { initializeCells } from "./processors/initializeCells";
import { transformToCenter } from "./processors/transformToCenter";
import { updateCells } from "./processors/updateCells";

const DEFAULT_NODE_SIZE = 20;
const DEFAULT_AREA_WIDTH = 100;
const DEFAULT_AREA_HEIGHT = 60;
const DEFAULT_SCALE_RANGE_MIN = 0.5;
const DEFAULT_SCALE_RANGE_MAX = 2;

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);

const { defineElement, property, method, event } = createDecorators();

export interface EoDrawCanvasProps {
  cells: InitialCell[] | undefined;
  defaultNodeSize: SizeTuple;
  defaultNodeBricks?: NodeBrickConf[];
  defaultEdgeLines?: EdgeLineConf[];
  activeTarget?: ActiveTarget | null;
  zoomable?: boolean;
  scrollable?: boolean;
  pannable?: boolean;
  scaleRange?: RangeTuple;
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

export interface UpdateCellsContext {
  reason: "add-related-nodes";
  parent: NodeId;
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
  accessor defaultNodeSize: SizeTuple = [DEFAULT_NODE_SIZE, DEFAULT_NODE_SIZE];

  @property({ attribute: false })
  accessor defaultNodeBricks: NodeBrickConf[] | undefined;

  /**
   * 使用条件判断设置默认的边对应的连线。在 `if` 表达式中 `DATA` 为 `{ edge }`，例如：
   *
   * ```yaml
   * defaultEdgeLines:
   *   - if: <% DATA.edge.data?.virtual %>
   *     dashed: true
   * ```
   */
  @property({ attribute: false })
  accessor defaultEdgeLines: EdgeLineConf[] | undefined;

  @property({ attribute: false })
  accessor activeTarget: ActiveTarget | null | undefined;

  @property({ type: Boolean })
  accessor zoomable: boolean | undefined = true;

  @property({ type: Boolean })
  accessor scrollable: boolean | undefined = true;

  @property({ type: Boolean })
  accessor pannable: boolean | undefined = true;

  @property({ attribute: false })
  accessor scaleRange: RangeTuple | undefined;

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

  /**
   * 缩放变化后，从素材库拖拽元素进画布时，拖拽图像应设置对应的缩放比例。
   */
  @event({ type: "scale.change" })
  accessor #scaleChange!: EventEmitter<number>;

  #handleScaleChange = (scale: number) => {
    this.#scaleChange.emit(scale);
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
      const transform = this.#canvasRef.current!.getTransform();
      const newNode: NodeCell = {
        type: "node",
        id,
        view: {
          x:
            (position[0] - boundingClientRect.left - transform.x) / transform.k,
          y: (position[1] - boundingClientRect.top - transform.y) / transform.k,
          width: size?.[0] ?? this.defaultNodeSize[0],
          height: size?.[1] ?? this.defaultNodeSize[0],
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
      const transform = this.#canvasRef.current!.getTransform();
      const newDecorator: DecoratorCell = {
        type: "decorator",
        decorator,
        id: uuidV4(),
        view: {
          x:
            (position[0] - boundingClientRect.left - transform.x) / transform.k,
          y: (position[1] - boundingClientRect.top - transform.y) / transform.k,
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
    const width = firstNode.size?.[0] ?? this.defaultNodeSize?.[0];
    const height = firstNode.size?.[1] ?? this.defaultNodeSize?.[1];
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
          width: size?.[0] ?? this.defaultNodeSize?.[0],
          height: size?.[1] ?? this.defaultNodeSize?.[0],
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

  @method()
  async updateCells(
    cells: InitialCell[],
    ctx?: UpdateCellsContext
  ): Promise<{ updated: Cell[] }> {
    const { cells: newCells, updated } = updateCells({
      ...ctx,
      cells,
      defaultNodeSize: this.defaultNodeSize,
    });
    this.#canvasRef.current!.updateCells(newCells);
    return { updated };
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
        defaultEdgeLines={this.defaultEdgeLines}
        activeTarget={this.activeTarget}
        zoomable={this.zoomable}
        scrollable={this.scrollable}
        pannable={this.pannable}
        scaleRange={this.scaleRange}
        onActiveTargetChange={this.#handleActiveTargetChange}
        onSwitchActiveTarget={this.#handleSwitchActiveTarget}
        onCellMove={this.#handleCellMove}
        onCellResize={this.#handleCellResize}
        onCellDelete={this.#handleCellDelete}
        onCellContextMenu={this.#handleCellContextMenu}
        onScaleChange={this.#handleScaleChange}
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
  onScaleChange(scale: number): void;
}

export interface DrawCanvasRef {
  dropNode(node: NodeCell): void;
  dropDecorator(decorator: DecoratorCell): void;
  addNodes(nodes: NodeCell[]): void;
  addEdge(edge: EdgeCell): void;
  manuallyConnectNodes(source: NodeId): Promise<ConnectNodesDetail>;
  updateCells(cells: Cell[]): void;
  getTransform(): TransformLiteral;
}

function LegacyEoDrawCanvasComponent(
  {
    host,
    cells: initialCells,
    defaultNodeSize,
    defaultNodeBricks,
    defaultEdgeLines,
    activeTarget: _activeTarget,
    zoomable,
    scrollable,
    pannable,
    scaleRange: _scaleRange,
    onActiveTargetChange,
    onSwitchActiveTarget,
    onCellMove,
    onCellResize,
    onCellDelete,
    onCellContextMenu,
    onScaleChange,
  }: EoDrawCanvasComponentProps,
  ref: React.Ref<DrawCanvasRef>
) {
  const [{ cells }, dispatch] = useReducer(
    rootReducer,
    initialCells,
    (initialCells) => ({
      cells: initializeCells(initialCells, { defaultNodeSize }),
    })
  );

  const rootRef = useRef<SVGSVGElement>(null);
  const cellsRef = useRef<SVGGElement>(null);
  const manualConnectDeferredRef = useRef<Deferred<ConnectNodesDetail> | null>(
    null
  );

  const [grabbing, setGrabbing] = useState(false);
  const [transform, setTransform] = useState<TransformLiteral>({
    k: 1,
    x: 0,
    y: 0,
  });
  const [centered, setCentered] = useState(false);

  useEffect(() => {
    onScaleChange(transform.k);
  }, [onScaleChange, transform.k]);

  const [connectLineState, setConnectLineState] =
    useState<ConnectLineState | null>(null);

  const scaleRange = useMemo(
    () =>
      _scaleRange ??
      ([DEFAULT_SCALE_RANGE_MIN, DEFAULT_SCALE_RANGE_MAX] as RangeTuple),
    [_scaleRange]
  );

  const zoomer = useMemo(() => zoom<SVGSVGElement, unknown>(), []);

  // istanbul ignore next: d3-zoom currently hard to test
  useEffect(() => {
    let moved = false;
    zoomer
      .scaleExtent(zoomable ? scaleRange : [1, 1])
      .on("start", () => {
        moved = false;
        setGrabbing(true);
      })
      .on("zoom", (e: { transform: TransformLiteral }) => {
        moved = true;
        setTransform(e.transform);
      })
      .on("end", () => {
        setGrabbing(false);
        if (!moved) {
          onSwitchActiveTarget?.(null);
        }
      });
  }, [onSwitchActiveTarget, scaleRange, zoomable, zoomer]);

  // istanbul ignore next: d3-zoom currently hard to test
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const rootSelection = select(root);

    const unsetZoom = () => {
      rootSelection
        .on(".zoom", null)
        .on(".zoom.custom", null)
        .on("wheel", null);
    };

    if (!(zoomable || scrollable || pannable)) {
      unsetZoom();
      return;
    }

    if (zoomable || scrollable) {
      // Do not override default d3 zoom handler.
      // Only handles *panning*
      rootSelection.on(
        "wheel.zoom.custom",
        (e: WheelEvent & { wheelDeltaX: number; wheelDeltaY: number }) => {
          // Mac OS trackpad pinch event is emitted as a wheel.zoom and d3.event.ctrlKey set to true
          if (!e.ctrlKey) {
            // Stop immediate propagation for default d3 zoom handler
            e.stopImmediatePropagation();
            if (scrollable) {
              e.preventDefault();
              zoomer.translateBy(
                rootSelection,
                e.wheelDeltaX / 5,
                e.wheelDeltaY / 5
              );
            }
          }
          // zoomer.scaleBy(rootSelection, Math.pow(2, defaultWheelDelta(e)))
        }
      );
    }

    rootSelection
      .call(zoomer)
      .on("wheel", (e: WheelEvent) => e.preventDefault())
      .on("dblclick.zoom", null)
      .on("mousedown.zoom", null);

    if (!pannable) {
      rootSelection
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
    }

    return unsetZoom;
  }, [pannable, scrollable, zoomable, zoomer]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || centered) {
      return;
    }
    const { k, x, y } = transformToCenter(cells, {
      canvasWidth: root.clientWidth,
      canvasHeight: root.clientHeight,
      scaleRange: zoomable ? scaleRange : undefined,
    });
    // istanbul ignore next
    if (process.env.NODE_ENV !== "test") {
      // jsdom doesn't support svg baseVal yet.
      // https://github.com/jsdom/jsdom/issues/2531
      zoomer.transform(select(root), new ZoomTransform(k, x, y));
    }
    setCentered(true);
  }, [cells, centered, scaleRange, zoomable, zoomer]);

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
      updateCells(cells) {
        dispatch({ type: "update-cells", payload: cells });
      },
      getTransform() {
        return transform;
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
    [cells, transform]
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
    <svg
      width="100%"
      height="100%"
      ref={rootRef}
      className={classNames("root", { grabbing, pannable })}
      tabIndex={-1}
    >
      <defs>
        <MarkerComponent id={markerEnd} type="arrow" strokeColor="gray" />
      </defs>
      <g
        transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}
      >
        <g className="cells" ref={cellsRef}>
          {cells.map((cell) => (
            <CellComponent
              key={`${cell.type}:${cell.type === "edge" ? `${cell.source}~${cell.target}` : cell.id}`}
              cell={cell}
              cells={cells}
              defaultNodeBricks={defaultNodeBricks}
              defaultEdgeLines={defaultEdgeLines}
              transform={transform}
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
          transform={transform}
          markerEnd={markerEnd}
          onConnect={handleConnect}
        />
      </g>
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
