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
  NodePosition,
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
  SmartConnectLineState,
  LineConnecterConf,
  Direction,
  EditableLineInfo,
  LineEditorState,
  EdgeView,
  LineSettings,
} from "./interfaces";
import { rootReducer } from "./reducers";
import { MarkerComponent } from "../diagram/MarkerComponent";
import {
  isContainerDecoratorCell,
  isEdgeCell,
  isEdgeSide,
  isNodeCell,
  isNodeOrAreaDecoratorCell,
  isTextDecoratorCell,
} from "./processors/asserts";
import type {
  EdgeViewChangePayload,
  LineTuple,
  MoveCellPayload,
  ResizeCellPayload,
} from "./reducers/interfaces";
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
  DEFAULT_DEGRADED_THRESHOLD,
  DEFAULT_NODE_PADDING_FOR_SMART_LINES,
} from "./constants";
import { useZoom } from "../shared/canvas/useZoom";
import { useActiveTarget } from "../shared/canvas/useActiveTarget";
import { ZoomBarComponent } from "../shared/canvas/ZoomBarComponent";
import { useLayout } from "../shared/canvas/useLayout";
import { useReady } from "../shared/canvas/useReady";
import { useLineMarkers } from "../shared/canvas/useLineMarkers";
import { getConnectPointsOfRectangle } from "../shared/canvas/shapes/Rectangle";
import { LineConnectorComponent } from "./LineConnectorComponent";
import { HoverStateContext, type HoverState } from "./HoverStateContext";
import { handleLasso } from "./processors/handleLasso";
import styleText from "../shared/canvas/styles.shadow.css";
import zoomBarStyleText from "../shared/canvas/ZoomBarComponent.shadow.css";
import { SmartConnectLineComponent } from "./SmartConnectLineComponent";
import { cellToTarget } from "./processors/cellToTarget";
import { handleNodeContainedChange } from "./processors/handleNodeContainedChange";
import { LineEditorComponent } from "./LineEditorComponent";
import { EditingLineComponent } from "./EditingLineComponent";

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
  degradedThreshold?: number;
  degradedNodeLabel?: string;
  activeTarget?: ActiveTarget | null;
  fadeUnrelatedCells?: boolean;
  zoomable?: boolean;
  scrollable?: boolean;
  pannable?: boolean;
  dragBehavior?: DragBehavior;
  ctrlDragBehavior?: CtrlDragBehavior;
  scaleRange?: RangeTuple;
  lineSettings?: LineSettings;
  lineConnector?: LineConnecterConf | boolean;
  allowEdgeToArea?: boolean;
}

export type DragBehavior = "none" | "lasso" | "grab";
export type CtrlDragBehavior = "none" | "grab";

export interface DropNodeInfo extends AddNodeInfo {
  /** [PointerEvent::clientX, PointerEvent::clientY] */
  position: PositionTuple;
}

export interface DropDecoratorInfo {
  decorator: DecoratorType;
  /** [PointerEvent::clientX, PointerEvent::clientY] */
  position: PositionTuple;
  text?: string;
  direction?: Direction;
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

  /**
   * @default [100,20]
   */
  @property({ attribute: false })
  accessor defaultNodeSize: SizeTuple = [DEFAULT_NODE_SIZE, DEFAULT_NODE_SIZE];

  @property({ attribute: false })
  accessor defaultNodeBricks: NodeBrickConf[] | undefined;

  /**
   * 当节点数量达到或超过 `degradedThreshold` 时，节点将被降级展示。
   *
   * @default 500
   */
  @property({ type: Number })
  accessor degradedThreshold: number | undefined;

  // Set `attribute` to `false` even if it accepts string value.
  // Because when passing like "<% DATA.node.data.name %>", it will be
  // evaluated as object temporarily.
  /**
   * 设置节点将降级展示时显示的名称。
   *
   * @default "<% DATA.node.id %>"
   */
  @property({ attribute: false })
  accessor degradedNodeLabel: string | undefined;

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

  @property({ type: Boolean })
  accessor allowEdgeToArea: boolean | undefined = false;

  /**
   * 按住鼠标拖动时的行为：
   *  - `none`：无
   *  - `lasso`：绘制选区
   *  - `grab`：拖动画布
   *
   * @default "none"
   */
  @property()
  accessor dragBehavior: DragBehavior | undefined;

  /**
   * 按住 ctrl 键并按住鼠标拖动时的行为：
   *  - `none`：无
   *  - `grab`：拖动画布
   *
   * @default "none"
   */
  @property()
  accessor ctrlDragBehavior: CtrlDragBehavior | undefined;

  @property({ attribute: false })
  accessor scaleRange: RangeTuple | undefined;

  @property({ attribute: false })
  accessor lineSettings: LineSettings | undefined;

  @property({ attribute: false })
  accessor lineConnector: LineConnecterConf | boolean | undefined;

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

  @event({ type: "cells.move" })
  accessor #cellsMoveEvent!: EventEmitter<MoveCellPayload[]>;

  #handleCellsMove = (info: MoveCellPayload[]) => {
    this.#cellsMoveEvent.emit(info);
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

  @event({ type: "cells.delete" })
  accessor #cellsDelete!: EventEmitter<Cell[]>;

  #handleCellsDelete = (cells: Cell[]) => {
    this.#cellsDelete.emit(cells);
  };

  @event({ type: "cell.contextmenu" })
  accessor #cellContextMenu!: EventEmitter<CellContextMenuDetail>;

  #handleCellContextMenu = (detail: CellContextMenuDetail) => {
    this.#cellContextMenu.emit(detail);
  };

  /**
   * 通过画布绘图的方式添加边（手动调用 `addEdge` 方法不会触发该事件）。
   */
  @event({ type: "edge.add" })
  accessor #edgeAdd!: EventEmitter<ConnectNodesDetail>;

  #handleEdgeAdd = (edge: ConnectNodesDetail) => {
    this.#edgeAdd.emit(edge);
  };

  @event({ type: "edge.view.change" })
  accessor #edgeViewChange!: EventEmitter<EdgeViewChangePayload>;

  #handleEdgeViewChange = (detail: EdgeViewChangePayload) => {
    this.#edgeViewChange.emit(detail);
  };

  @event({ type: "decorator.text.change" })
  accessor #decoratorTextChange!: EventEmitter<DecoratorTextChangeDetail>;

  #handleDecoratorTextChange = (detail: DecoratorTextChangeDetail) => {
    this.#decoratorTextChange.emit(detail);
  };

  /**
   * node节点跟容器组关系改变事件，有containerCell是新增关系，否则删除关系
   */
  @event({ type: "node.container.change" })
  accessor #containerContainerChange!: EventEmitter<MoveCellPayload[]>;

  #handleContainerContainerChange = (detail: MoveCellPayload[]) => {
    this.#containerContainerChange.emit(detail);
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
    direction,
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
          direction,
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
      view: this.lineSettings,
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
    await this.#waitForCanvasRef();
    const { updated } = this.#canvasRef.current!.updateCells(cells, {
      ...ctx,
      defaultNodeSize: this.defaultNodeSize,
      canvasWidth: this.clientWidth,
      canvasHeight: this.clientHeight,
    });
    return { updated };
  }

  #waitForCanvasRef() {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (this.#canvasRef.current) {
          resolve();
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });
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
        degradedThreshold={this.degradedThreshold}
        degradedNodeLabel={this.degradedNodeLabel}
        activeTarget={this.activeTarget}
        fadeUnrelatedCells={this.fadeUnrelatedCells}
        zoomable={this.zoomable}
        scrollable={this.scrollable}
        pannable={this.pannable}
        dragBehavior={this.dragBehavior}
        ctrlDragBehavior={this.ctrlDragBehavior}
        scaleRange={this.scaleRange}
        lineSettings={this.lineSettings}
        lineConnector={this.lineConnector}
        allowEdgeToArea={this.allowEdgeToArea}
        onActiveTargetChange={this.#handleActiveTargetChange}
        onSwitchActiveTarget={this.#handleSwitchActiveTarget}
        onCellMove={this.#handleCellMove}
        onCellsMove={this.#handleCellsMove}
        onCellResize={this.#handleCellResize}
        onCellDelete={this.#handleCellDelete}
        onCellsDelete={this.#handleCellsDelete}
        onEdgeAdd={this.#handleEdgeAdd}
        onCellContextMenu={this.#handleCellContextMenu}
        onDecoratorTextChange={this.#handleDecoratorTextChange}
        onContainerContainerChange={this.#handleContainerContainerChange}
        onScaleChange={this.#handleScaleChange}
        onEdgeViewChange={this.#handleEdgeViewChange}
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
  onCellsMove(info: MoveCellPayload[]): void;
  onCellsDelete(cells: Cell[]): void;
  onCellContextMenu(detail: CellContextMenuDetail): void;
  onEdgeAdd(detail: ConnectNodesDetail): void;
  onEdgeViewChange(detail: EdgeViewChangePayload): void;
  onDecoratorTextChange(detail: DecoratorTextChangeDetail): void;
  onContainerContainerChange(detail: MoveCellPayload[]): void;
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
    degradedThreshold,
    degradedNodeLabel,
    activeTarget: _activeTarget,
    fadeUnrelatedCells,
    zoomable,
    scrollable,
    pannable,
    dragBehavior,
    ctrlDragBehavior,
    scaleRange: _scaleRange,
    lineSettings,
    lineConnector,
    allowEdgeToArea,
    onActiveTargetChange,
    onSwitchActiveTarget,
    onCellMove,
    onCellResize,
    onCellDelete,
    onCellsMove,
    onCellsDelete,
    onCellContextMenu,
    onEdgeAdd,
    onDecoratorTextChange,
    onScaleChange,
    onContainerContainerChange,
    onEdgeViewChange,
  }: EoDrawCanvasComponentProps,
  ref: React.Ref<DrawCanvasRef>
) {
  const [{ cells, layoutKey }, dispatch] = useReducer(
    rootReducer,
    initialCells,
    (initialCells) => ({
      cells: initializeCells(initialCells, { defaultNodeSize }),
      layoutKey: 0,
    })
  );

  // When nodes are greater or equal to threshold, the diagram will be degraded.
  // Thus all nodes will be displayed as simple svg elements instead of bricks.
  const degraded = useMemo(
    () =>
      cells.filter(isNodeCell).length >=
      (degradedThreshold ?? DEFAULT_DEGRADED_THRESHOLD),
    [cells, degradedThreshold]
  );

  const rootRef = useRef<SVGSVGElement>(null);
  const manualConnectDeferredRef = useRef<Deferred<ConnectNodesDetail> | null>(
    null
  );
  const [editingTexts, setEditingTexts] = useState<string[]>([]);
  const [activeContainers, setActiveContainers] = useState<string[]>([]);
  const { grabbing, transform, zoomer, scaleRange } = useZoom({
    rootRef,
    zoomable,
    scrollable,
    pannable,
    draggable: dragBehavior === "grab",
    ctrlDraggable: ctrlDragBehavior === "grab",
    scaleRange: _scaleRange,
    onSwitchActiveTarget,
  });

  useEffect(() => {
    onScaleChange(transform.k);
  }, [onScaleChange, transform.k]);

  const [lassoRect, setLassoRect] = useState<NodeView | null>(null);

  const [connectLineState, setConnectLineState] =
    useState<ConnectLineState | null>(null);

  const { centered, setCentered, getNextLayoutKey } = useLayout({
    layout,
    layoutOptions,
    rootRef,
    cells,
    zoomable,
    zoomer,
    scaleRange,
    layoutKey,
    allowEdgeToArea,
    dispatch,
  });

  useImperativeHandle(
    ref,
    () => ({
      dropNode(node) {
        // Do not apply auto centering when dropping a node in manual layout.
        if (layout !== "dagre" && layout !== "force") {
          setCentered(true);
        }
        dispatch({ type: "drop-node", payload: node });
      },
      dropDecorator(decorator) {
        // Do not apply auto centering when dropping a decorator in manual layout.
        if (layout !== "dagre" && layout !== "force") {
          setCentered(true);
        }
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
          allowEdgeToArea,
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
          allowEdgeToArea,
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
          (cell) => isEdgeSide(cell, allowEdgeToArea) && cell.id === sourceId
        ) as NodeCell | DecoratorCell | undefined;
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
    [cells, layout, scaleRange, setCentered, transform, allowEdgeToArea]
  );

  const handleConnect = useCallback(
    (state: ConnectLineState, to: PositionTuple) => {
      // Find the target node from top bo bottom,
      // detect whether the pointer is inside the target node.
      for (let i = cells.length - 1; i >= 0; i--) {
        const cell = cells[i];
        // Currently ignore connecting to self
        if (isEdgeSide(cell, allowEdgeToArea) && cell.id !== state.source.id) {
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
    [allowEdgeToArea, cells]
  );
  const [smartConnectLineState, setSmartConnectLineState] =
    useState<SmartConnectLineState | null>(null);

  useEffect(() => {
    lockBodyScroll(
      host,
      !!(connectLineState || !!smartConnectLineState || lassoRect)
    );
  }, [connectLineState, host, smartConnectLineState, lassoRect]);

  const activeTarget = useActiveTarget({
    rootRef,
    activeTarget: _activeTarget,
    onActiveTargetChange,
  });

  const [unrelatedCells, setUnrelatedCells] = useState<Cell[]>([]);
  useEffect(() => {
    const nextUnrelated = fadeUnrelatedCells
      ? getUnrelatedCells(
          cells,
          connectLineState,
          activeTarget,
          allowEdgeToArea
        )
      : [];
    // Do not update the state when prev and next are both empty.
    setUnrelatedCells((prev) =>
      prev.length === 0 && nextUnrelated.length === 0 ? prev : nextUnrelated
    );
  }, [
    activeTarget,
    cells,
    connectLineState,
    fadeUnrelatedCells,
    allowEdgeToArea,
  ]);

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

      switch (action?.action) {
        case "delete-cells":
          onCellsDelete(action.cells);
          if (action.cells.length === 1) {
            onCellDelete(action.cells[0]);
          }
          break;
      }
    };
    root.addEventListener("keydown", onKeydown);
    return () => {
      root.removeEventListener("keydown", onKeydown);
    };
  }, [activeTarget, cells, editingTexts.length, onCellDelete, onCellsDelete]);

  const defPrefix = useMemo(() => `${uniqueId("diagram-")}-`, []);
  const markerPrefix = `${defPrefix}line-arrow-`;

  const [guideLines, setGuideLines] = useState<LineTuple[]>([]);

  /* istanbul ignore next */
  const handleCellsMoving = useCallback(
    (info: MoveCellPayload[]) => {
      dispatch({ type: "move-cells", payload: info });
      const containedIds: string[] = [];
      handleNodeContainedChange(info, cells).forEach((c) => {
        if (c.containerCell?.id) containedIds.push(c.containerCell?.id);
      });
      setActiveContainers(containedIds);
      setGuideLines(info.flatMap((c) => c.guideLines ?? []));
    },
    [cells]
  );

  /* istanbul ignore next */
  const handleCellsMoved = useCallback(
    (info: MoveCellPayload[]) => {
      dispatch({ type: "move-cells", payload: info });
      onCellsMove(info);
      if (info.length === 1) {
        onCellMove(info[0]);
      }
      handleNodeContainedChange(info, cells, onContainerContainerChange);
      setActiveContainers([]);
      setGuideLines([]);
    },
    [onCellMove, onCellsMove, cells, onContainerContainerChange]
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
      const nextLayoutKey = getNextLayoutKey();
      dispatch({
        type: "update-node-size",
        payload: { id, size },
        layoutKey: nextLayoutKey,
      });
    },
    [getNextLayoutKey]
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
  const { lineConfMap, lineConnectorConf, markers } = useLineMarkers({
    cells,
    defaultEdgeLines,
    lineConnector,
    markerPrefix,
  });

  const ready = useReady({ cells, layout, centered });

  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const unsetHoverStateTimeoutRef = useRef<number | null>(null);

  const [activeEditableLine, setActiveEditableLine] =
    useState<EditableLineInfo | null>(null);
  const [lineEditorState, setLineEditorState] =
    useState<LineEditorState | null>(null);

  // istanbul ignore next
  const handleCellMouseEnter = useCallback(
    (cell: Cell) => {
      if (
        lineConnectorConf &&
        isEdgeSide(cell, allowEdgeToArea) &&
        (!lineEditorState || lineEditorState.type !== "control")
      ) {
        if (unsetHoverStateTimeoutRef.current !== null) {
          clearTimeout(unsetHoverStateTimeoutRef.current);
          unsetHoverStateTimeoutRef.current = null;
        }
        const relativePoints = getConnectPointsOfRectangle();
        setHoverState({
          cell,
          relativePoints,
          points: getConnectPoints(relativePoints, cell.view),
        });
      }
    },
    [allowEdgeToArea, lineConnectorConf, lineEditorState]
  );

  const handleCellMouseLeave = useCallback(
    (cell: Cell) => {
      if (lineConnectorConf && isNodeCell(cell)) {
        unsetHoverStateTimeoutRef.current = setTimeout(() => {
          setHoverState(null);
        }) as unknown as number;
      }
    },
    [lineConnectorConf]
  );

  // istanbul ignore next
  const handleSmartConnect = useCallback(
    (
      source: NodeCell | DecoratorCell,
      target: NodeCell | DecoratorCell,
      exitPosition: NodePosition,
      entryPosition: NodePosition | undefined
    ) => {
      const payload: EdgeViewChangePayload = {
        source: source.id,
        target: target.id,
        view: {
          ...lineSettings,
          exitPosition,
          entryPosition,
          vertices: null,
        },
      };
      const existedEdge = cells.find(
        (cell) =>
          cell.type === "edge" &&
          cell.source === source.id &&
          cell.target === target.id
      );
      if (existedEdge) {
        dispatch({
          type: "change-edge-view",
          payload,
        });
        onEdgeViewChange?.(payload);
      } else {
        const newEdge: EdgeCell = {
          type: "edge",
          ...payload,
        };
        dispatch({
          type: "add-edge",
          payload: newEdge,
        });
        onEdgeAdd({
          source,
          target,
          view: newEdge.view,
        });
      }
    },
    [cells, lineSettings, onEdgeAdd, onEdgeViewChange]
  );

  // istanbul ignore next
  const handleEdgeChangeView = useCallback(
    (
      source: NodeCell | DecoratorCell,
      target: NodeCell | DecoratorCell,
      view: EdgeView
    ) => {
      const payload: EdgeViewChangePayload = {
        source: source.id,
        target: target.id,
        view,
      };
      dispatch({
        type: "change-edge-view",
        payload,
      });
      onEdgeViewChange?.(payload);
    },
    [onEdgeViewChange]
  );

  // istanbul ignore next: experimental
  const hoverStateContextValue = useMemo(
    () => ({
      rootRef,
      smartConnectLineState,
      unsetHoverStateTimeoutRef,
      hoverState,
      activeEditableLine,
      lineEditorState,
      setLineEditorState,
      setActiveEditableLine,
      setHoverState,
      setSmartConnectLineState,
      onConnect: handleSmartConnect,
      onChangeEdgeView: handleEdgeChangeView,
    }),
    [
      activeEditableLine,
      handleEdgeChangeView,
      handleSmartConnect,
      hoverState,
      lineEditorState,
      smartConnectLineState,
    ]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || dragBehavior !== "lasso") {
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const onMouseDown = (event: MouseEvent) => {
      handleLasso(event, {
        transform,
        offset: [rootRect.left, rootRect.top],
        onLassoing(rect) {
          setLassoRect(rect);
        },
        onLassoed(rect) {
          setLassoRect(null);
          const lassoedCells: (NodeCell | DecoratorCell)[] = [];
          for (const cell of cells) {
            if (
              isContainerDecoratorCell(cell) ||
              isNodeOrAreaDecoratorCell(cell) ||
              isTextDecoratorCell(cell)
            ) {
              const x = cell.view.x;
              const y = cell.view.y;
              if (
                x >= rect.x &&
                x + cell.view.width <= rect.x + rect.width &&
                y >= rect.y &&
                y + cell.view.height <= rect.y + rect.height
              ) {
                lassoedCells.push(cell);
              }
            }
          }
          onSwitchActiveTarget?.(
            lassoedCells.length > 1
              ? { type: "multi", targets: lassoedCells.map(cellToTarget) }
              : lassoedCells.length === 1
                ? cellToTarget(lassoedCells[0])
                : null
          );
        },
      });
    };
    root.addEventListener("mousedown", onMouseDown);
    return () => {
      root.removeEventListener("mousedown", onMouseDown);
    };
  }, [transform, cells, dragBehavior, onSwitchActiveTarget]);

  return (
    <HoverStateContext.Provider value={hoverStateContextValue}>
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
          <g className={classNames("cells", { allowEdgeToArea })}>
            {cells.map((cell) => (
              <CellComponent
                key={`${cell.type}:${isEdgeCell(cell) ? `${cell.source}~${cell.target}` : cell.id}`}
                dragNodeToContainerActive={
                  isEdgeCell(cell) ? false : activeContainers.includes(cell.id)
                }
                layout={layout}
                layoutOptions={layoutOptions}
                cell={cell}
                cells={cells}
                degraded={degraded}
                degradedNodeLabel={degradedNodeLabel}
                defaultNodeBricks={defaultNodeBricks}
                transform={transform}
                lineConfMap={lineConfMap}
                activeTarget={activeTarget}
                unrelatedCells={unrelatedCells}
                allowEdgeToArea={allowEdgeToArea}
                onCellsMoving={handleCellsMoving}
                onCellsMoved={handleCellsMoved}
                onCellResizing={handleCellResizing}
                onCellResized={handleCellResized}
                onSwitchActiveTarget={onSwitchActiveTarget}
                onCellContextMenu={onCellContextMenu}
                onDecoratorTextChange={onDecoratorTextChange}
                onDecoratorTextEditing={handleDecoratorTextEditing}
                onNodeBrickResize={handleNodeBrickResize}
                onCellMouseEnter={handleCellMouseEnter}
                onCellMouseLeave={handleCellMouseLeave}
              />
            ))}
          </g>
          <g>
            <ConnectLineComponent
              connectLineState={connectLineState}
              transform={transform}
              markerEnd={`${markerPrefix}0`}
              onConnect={handleConnect}
            />
          </g>
          {lassoRect && (
            <rect
              x={lassoRect.x}
              y={lassoRect.y}
              width={lassoRect.width}
              height={lassoRect.height}
              fill="var(--palette-gray-5)"
              fillOpacity={0.3}
              stroke="var(--palette-gray-5)"
              strokeDasharray={2}
            />
          )}
          {lineConnectorConf && (
            <g>
              <SmartConnectLineComponent
                transform={transform}
                lineSettings={lineSettings}
                options={lineConnectorConf}
              />
              <EditingLineComponent
                transform={transform}
                options={lineConnectorConf}
              />
            </g>
          )}
          <g>
            {guideLines.map((line, index) => (
              <path
                key={index}
                d={`M${line[0].join(" ")} L${line[1].join(" ")}`}
                stroke="var(--palette-orange-5)"
                fill="none"
                strokeWidth={1 / transform.k}
              />
            ))}
          </g>
          <g>
            {lineConnectorConf && <LineEditorComponent scale={transform.k} />}
          </g>
          {lineConnectorConf && (
            <LineConnectorComponent
              activeTarget={activeTarget}
              scale={transform.k}
              disabled={!!connectLineState}
            />
          )}
        </g>
      </svg>
      <ZoomBarComponent
        shadowRoot={host.shadowRoot!}
        scale={transform.k}
        scaleRange={scaleRange}
        onZoomChange={handleZoomSlide}
        onReCenter={reCenter}
      />
    </HoverStateContext.Provider>
  );
}

export function uuidV4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getConnectPoints(
  relativePoints: ReadonlyArray<NodePosition>,
  view: NodeView,
  border = 1
) {
  const padding = DEFAULT_NODE_PADDING_FOR_SMART_LINES;
  const halfPadding = padding / 2;

  const viewWithBorderAndPadding: NodeView = {
    x: view.x + border / 2 - halfPadding,
    y: view.y + border / 2 - halfPadding,
    width: view.width - border + padding,
    height: view.height - border + padding,
  };

  return relativePoints.map((p) => ({
    x: viewWithBorderAndPadding.x + p.x * viewWithBorderAndPadding.width,
    y: viewWithBorderAndPadding.y + p.y * viewWithBorderAndPadding.height,
  }));
}
