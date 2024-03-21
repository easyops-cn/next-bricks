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
import classNames from "classnames";
import { select } from "d3-selection";
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
  DecoratorTextChangeDetail,
  NodeView,
  LayoutType,
  LayoutOptions,
} from "./interfaces";
import { rootReducer } from "./reducers";
import { MarkerComponent } from "../diagram/MarkerComponent";
import { isNodeCell } from "./processors/asserts";
import type { MoveCellPayload, ResizeCellPayload } from "./reducers/interfaces";
import { sameTarget } from "./processors/sameTarget";
import { handleKeyboard } from "./processors/handleKeyboard";
import { CellComponent } from "./CellComponent";
import { ConnectLineComponent } from "./ConnectLineComponent";
import { initializeCells } from "./processors/initializeCells";
import { updateCells } from "./processors/updateCells";
import { getUnrelatedCells } from "./processors/getUnrelatedCells";
import {
  DEFAULT_NODE_SIZE,
  DEFAULT_AREA_WIDTH,
  DEFAULT_AREA_HEIGHT,
} from "./constants";
import { useZoom } from "../shared/canvas/useZoom";
import { useActiveTarget } from "../shared/canvas/useActiveTarget";
import { ZoomBarComponent } from "../shared/canvas/ZoomBarComponent";
import { useLayout } from "../shared/canvas/useLayout";
import { useReady } from "../shared/canvas/useReady";
import { useLineMarkers } from "../shared/canvas/useLineMarkers";
import styleText from "../shared/canvas/styles.shadow.css";
import zoomBarStyleText from "../shared/canvas/ZoomBarComponent.shadow.css";

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);

const { defineElement, property, method, event } = createDecorators();

export interface EoDrawCanvasProps {
  cells: InitialCell[] | undefined;
  layout: LayoutType;
  layoutOptions?: LayoutOptions;
  defaultNodeSize: SizeTuple;
  defaultNodeBricks?: NodeBrickConf[];
  defaultEdgeLines?: EdgeLineConf[];
  activeTarget?: ActiveTarget | null;
  fadeUnrelatedCells?: boolean;
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
  text?: string;
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

export interface AddNodesContext {
  defaultNodeSize: SizeTuple;
  canvasWidth: number;
  canvasHeight: number;
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
  styleTexts: [styleText, zoomBarStyleText],
})
class EoDrawCanvas extends ReactNextElement implements EoDrawCanvasProps {
  /**
   * 仅当初始化时使用，渲染后重新设置 `cells` 将无效。
   */
  @property({ attribute: false })
  accessor cells: InitialCell[] | undefined;

  @property({ type: String })
  accessor layout: LayoutType;

  @property({ attribute: false })
  accessor layoutOptions: LayoutOptions | undefined;

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

  /**
   * 当 `activeTarget` 不为 `null` 时，隐藏其他跟该 `activeTarget` 无关的元素。
   */
  @property({ type: Boolean })
  accessor fadeUnrelatedCells: boolean | undefined;

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

  @event({ type: "decorator.text.change" })
  accessor #decoratorTextChange!: EventEmitter<DecoratorTextChangeDetail>;

  #handleDecoratorTextChange = (detail: DecoratorTextChangeDetail) => {
    this.#decoratorTextChange.emit(detail);
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
      const newNode = {
        type: "node",
        id,
        view: {
          ...(this.layout === "force" || this.layout === "dagre"
            ? null
            : {
                x:
                  (position[0] - boundingClientRect.left - transform.x) /
                  transform.k,
                y:
                  (position[1] - boundingClientRect.top - transform.y) /
                  transform.k,
              }),
          width: size?.[0] ?? this.defaultNodeSize[0],
          height: size?.[1] ?? this.defaultNodeSize[0],
        },
        data,
        useBrick,
      } as NodeCell;
      this.#canvasRef.current?.dropNode(newNode);
      return newNode;
    }
    return null;
  }

  @method()
  async dropDecorator({
    position,
    decorator,
    text,
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
          text,
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
    const newNodes = nodes.map<NodeCell>(({ size, useBrick, id, data }) => ({
      type: "node",
      id,
      data,
      view: {
        width: size?.[0] ?? this.defaultNodeSize[0],
        height: size?.[1] ?? this.defaultNodeSize[0],
      } as NodeView,
      useBrick,
    }));
    return this.#canvasRef.current!.addNodes(newNodes, {
      defaultNodeSize: this.defaultNodeSize,
      canvasWidth: this.clientWidth,
      canvasHeight: this.clientHeight,
    });
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
    const { updated } = this.#canvasRef.current!.updateCells(cells, {
      ...ctx,
      defaultNodeSize: this.defaultNodeSize,
      canvasWidth: this.clientWidth,
      canvasHeight: this.clientHeight,
    });
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
        layout={this.layout}
        layoutOptions={this.layoutOptions}
        cells={this.cells}
        defaultNodeSize={this.defaultNodeSize}
        defaultNodeBricks={this.defaultNodeBricks}
        defaultEdgeLines={this.defaultEdgeLines}
        activeTarget={this.activeTarget}
        fadeUnrelatedCells={this.fadeUnrelatedCells}
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
        onDecoratorTextChange={this.#handleDecoratorTextChange}
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
  onDecoratorTextChange(detail: DecoratorTextChangeDetail): void;
  onScaleChange(scale: number): void;
}

export interface DrawCanvasRef {
  dropNode(node: NodeCell): void;
  dropDecorator(decorator: DecoratorCell): void;
  addNodes(nodes: NodeCell[], ctx: AddNodesContext): NodeCell[];
  addEdge(edge: EdgeCell): void;
  manuallyConnectNodes(source: NodeId): Promise<ConnectNodesDetail>;
  updateCells(
    cells: InitialCell[],
    ctx: Partial<UpdateCellsContext> & {
      defaultNodeSize: SizeTuple;
      canvasWidth: number;
      canvasHeight: number;
    }
  ): {
    cells: Cell[];
    updated: Cell[];
  };
  getTransform(): TransformLiteral;
}

function LegacyEoDrawCanvasComponent(
  {
    host,
    layout,
    layoutOptions,
    cells: initialCells,
    defaultNodeSize,
    defaultNodeBricks,
    defaultEdgeLines,
    activeTarget: _activeTarget,
    fadeUnrelatedCells,
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
    onDecoratorTextChange,
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
  const [editingTexts, setEditingTexts] = useState<string[]>([]);
  const { grabbing, transform, zoomer, scaleRange } = useZoom({
    rootRef,
    zoomable,
    scrollable,
    pannable,
    scaleRange: _scaleRange,
    onSwitchActiveTarget,
  });

  useEffect(() => {
    onScaleChange(transform.k);
  }, [onScaleChange, transform.k]);

  const [connectLineState, setConnectLineState] =
    useState<ConnectLineState | null>(null);

  const { centered, setCentered } = useLayout({
    layout,
    layoutOptions,
    rootRef,
    cells,
    zoomable,
    zoomer,
    scaleRange,
    dispatch,
  });

  useImperativeHandle(
    ref,
    () => ({
      dropNode(node) {
        // Do not apply auto centering when dropping a node.
        setCentered(true);
        dispatch({ type: "drop-node", payload: node });
      },
      dropDecorator(decorator) {
        // Do not apply auto centering when dropping a decorator.
        setCentered(true);
        dispatch({ type: "drop-decorator", payload: decorator });
      },
      addNodes(
        nodes,
        { defaultNodeSize, canvasWidth, canvasHeight }: AddNodesContext
      ) {
        const index =
          cells.findLastIndex(
            (cell) => !(cell.type === "decorator" && cell.decorator === "text")
          ) + 1;
        const newCells = [
          ...cells.slice(0, index),
          ...nodes,
          ...cells.slice(index),
        ];
        const {
          cells: allCells,
          updated,
          shouldReCenter,
        } = updateCells({
          cells: newCells,
          layout,
          previousCells: cells,
          defaultNodeSize,
          canvasWidth,
          canvasHeight,
          scaleRange,
          transform,
        });
        if (shouldReCenter) {
          setCentered(false);
        }
        dispatch({ type: "update-cells", payload: allCells });
        return updated.filter((node) =>
          nodes.includes(node as NodeCell)
        ) as NodeCell[];
      },
      addEdge(edge) {
        dispatch({ type: "add-edge", payload: edge });
      },
      updateCells(newCells, ctx) {
        const { shouldReCenter, ...result } = updateCells({
          ...ctx,
          layout,
          previousCells: cells,
          cells: newCells,
          scaleRange,
          transform,
        });
        if (shouldReCenter) {
          setCentered(false);
        }
        dispatch({ type: "update-cells", payload: result.cells });
        return result;
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
    [cells, layout, scaleRange, setCentered, transform]
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

  const activeTarget = useActiveTarget({
    cellsRef,
    activeTarget: _activeTarget,
    onActiveTargetChange,
  });

  const [unrelatedCells, setUnrelatedCells] = useState<Cell[]>([]);
  useEffect(() => {
    const nextUnrelated = fadeUnrelatedCells
      ? getUnrelatedCells(cells, connectLineState, activeTarget)
      : [];
    // Do not update the state when prev and next are both empty.
    setUnrelatedCells((prev) =>
      prev.length === 0 && nextUnrelated.length === 0 ? prev : nextUnrelated
    );
  }, [activeTarget, cells, connectLineState, fadeUnrelatedCells]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || editingTexts.length > 0) {
      return;
    }
    const onKeydown = (event: KeyboardEvent) => {
      const action = handleKeyboard(event, {
        cells,
        activeTarget,
      });

      if (action?.action === "delete-cell") {
        onCellDelete(action.cell);
      }
    };
    root.addEventListener("keydown", onKeydown);
    return () => {
      root.removeEventListener("keydown", onKeydown);
    };
  }, [activeTarget, cells, editingTexts.length, onCellDelete]);

  const defPrefix = useMemo(() => `${uniqueId("diagram-")}-`, []);
  const markerPrefix = `${defPrefix}line-arrow-`;

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

  const handleDecoratorTextEditing = useCallback(
    ({ id, editing }: { id: string; editing: boolean }) => {
      if (editing) {
        setEditingTexts((texts) =>
          texts.includes(id) ? texts : [...texts, id]
        );
      } else {
        setEditingTexts((texts) => texts.filter((text) => text !== id));
      }
    },
    []
  );

  const handleNodeBrickResize = useCallback(
    (id: string, size: SizeTuple | null) => {
      dispatch({ type: "update-node-size", payload: { id, size } });
    },
    []
  );

  const handleZoomSlide = useCallback(
    (value: number) => {
      // istanbul ignore next
      if (process.env.NODE_ENV !== "test") {
        zoomer.scaleTo(select(rootRef.current!), value / 100);
      }
    },
    [zoomer]
  );

  const reCenter = useCallback(() => {
    setCentered(false);
  }, [setCentered]);
  const [lineConfMap, markers] = useLineMarkers({
    cells,
    defaultEdgeLines,
    markerPrefix,
  });

  const ready = useReady({ cells, layout, centered });

  return (
    <>
      <svg
        width="100%"
        height="100%"
        ref={rootRef}
        className={classNames("root", { grabbing, pannable, ready })}
        tabIndex={-1}
      >
        <defs>
          {markers.map((marker, index) => (
            <MarkerComponent
              key={index}
              id={`${markerPrefix}${index}`}
              type="arrow"
              strokeColor={marker.strokeColor}
            />
          ))}
        </defs>
        <g
          transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}
        >
          <g className="cells" ref={cellsRef}>
            {cells.map((cell) => (
              <CellComponent
                key={`${cell.type}:${cell.type === "edge" ? `${cell.source}~${cell.target}` : cell.id}`}
                layout={layout}
                cell={cell}
                cells={cells}
                defaultNodeBricks={defaultNodeBricks}
                transform={transform}
                lineConfMap={lineConfMap}
                active={sameTarget(activeTarget, cell)}
                unrelatedCells={unrelatedCells}
                onCellMoving={handleCellMoving}
                onCellMoved={handleCellMoved}
                onCellResizing={handleCellResizing}
                onCellResized={handleCellResized}
                onSwitchActiveTarget={onSwitchActiveTarget}
                onCellContextMenu={onCellContextMenu}
                onDecoratorTextChange={onDecoratorTextChange}
                onDecoratorTextEditing={handleDecoratorTextEditing}
                onNodeBrickResize={handleNodeBrickResize}
              />
            ))}
          </g>
          <ConnectLineComponent
            connectLineState={connectLineState}
            transform={transform}
            markerEnd={`${markerPrefix}0`}
            onConnect={handleConnect}
          />
        </g>
      </svg>
      <ZoomBarComponent
        shadowRoot={host.shadowRoot!}
        scale={transform.k}
        scaleRange={scaleRange}
        onZoomChange={handleZoomSlide}
        onReCenter={reCenter}
      />
    </>
  );
}

function uuidV4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
