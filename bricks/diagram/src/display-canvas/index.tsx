import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { uniqueId } from "lodash";
import classNames from "classnames";
import { select } from "d3-selection";
import type { RangeTuple, SizeTuple } from "../diagram/interfaces";
import type {
  ActiveTarget,
  InitialCell,
  NodeBrickConf,
  CellContextMenuDetail,
  EdgeLineConf,
  Cell,
  LayoutType,
  LayoutOptions,
} from "../draw-canvas/interfaces";
import { MarkerComponent } from "../diagram/MarkerComponent";
import { sameTarget } from "../draw-canvas/processors/sameTarget";
import { CellComponent } from "../draw-canvas/CellComponent";
import { initializeCells } from "../draw-canvas/processors/initializeCells";
import {
  DEFAULT_DEGRADED_THRESHOLD,
  DEFAULT_NODE_SIZE,
} from "../draw-canvas/constants";
import { useZoom } from "../shared/canvas/useZoom";
import { useActiveTarget } from "../shared/canvas/useActiveTarget";
import { rootReducer } from "../draw-canvas/reducers";
import { getUnrelatedCells } from "../draw-canvas/processors/getUnrelatedCells";
import { isEdgeCell, isNodeCell } from "../draw-canvas/processors/asserts";
import { ZoomBarComponent } from "../shared/canvas/ZoomBarComponent";
import { useLayout } from "../shared/canvas/useLayout";
import { useReady } from "../shared/canvas/useReady";
import { useLineMarkers } from "../shared/canvas/useLineMarkers";
import { updateCells } from "../draw-canvas/processors/updateCells";
import styleText from "../shared/canvas/styles.shadow.css";
import zoomBarStyleText from "../shared/canvas/ZoomBarComponent.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface EoDisplayCanvasProps {
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
  scaleRange?: RangeTuple;
  hideZoomBar?: boolean;
}

/**
 * 用于展示查看的画布。
 */
export
@defineElement("eo-display-canvas", {
  styleTexts: [styleText, zoomBarStyleText],
})
class EoDisplayCanvas extends ReactNextElement implements EoDisplayCanvasProps {
  /**
   * 用于查看的画布可以更新 `cells` 属性。
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
   * 当节点数量达到或超过 `degradedThreshold` 时，节点将被降级展示。
   *
   * @default 500
   */
  @property({ type: Number })
  accessor degradedThreshold: number | undefined;

  // Set `attribute` to `false` event if it accepts string value.
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
   * 当鼠标悬浮到某节点上时，隐藏其他跟该节点无关的元素。
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

  /**
   * 隐藏右下角放大缩小的控制栏
   */
  @property({ type: Boolean })
  accessor hideZoomBar: boolean | undefined;

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

  @event({ type: "cell.contextmenu" })
  accessor #cellContextMenu!: EventEmitter<CellContextMenuDetail>;

  #handleCellContextMenu = (detail: CellContextMenuDetail) => {
    this.#cellContextMenu.emit(detail);
  };

  @event({ type: "cell.click" })
  accessor #cellClick!: EventEmitter<CellContextMenuDetail>;

  #handleCellClick = (detail: CellContextMenuDetail) => {
    this.#cellClick.emit(detail);
  };

  render() {
    return (
      <EoDisplayCanvasComponent
        shadowRoot={this.shadowRoot!}
        cells={this.cells}
        layout={this.layout}
        layoutOptions={this.layoutOptions}
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
        scaleRange={this.scaleRange}
        hideZoomBar={this.hideZoomBar}
        onActiveTargetChange={this.#handleActiveTargetChange}
        onSwitchActiveTarget={this.#handleSwitchActiveTarget}
        onCellContextMenu={this.#handleCellContextMenu}
        onCellClick={this.#handleCellClick}
      />
    );
  }
}

export interface EoDisplayCanvasComponentProps extends EoDisplayCanvasProps {
  shadowRoot: ShadowRoot;
  onActiveTargetChange(target: ActiveTarget | null): void;
  onSwitchActiveTarget(target: ActiveTarget | null): void;
  onCellContextMenu(detail: CellContextMenuDetail): void;
  onCellClick(detail: CellContextMenuDetail): void;
}

function EoDisplayCanvasComponent({
  shadowRoot,
  cells: initialCells,
  layout,
  layoutOptions,
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
  scaleRange: _scaleRange,
  hideZoomBar,
  onActiveTargetChange,
  onSwitchActiveTarget,
  onCellContextMenu,
  onCellClick,
}: EoDisplayCanvasComponentProps) {
  const [{ cells, layoutKey }, dispatch] = useReducer(
    rootReducer,
    initialCells,
    (initialCells) => ({
      cells: initializeCells(initialCells, { defaultNodeSize }),
      layoutKey: 1,
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

  const { grabbing, transform, zoomer, scaleRange } = useZoom({
    rootRef,
    zoomable,
    scrollable,
    pannable,
    draggable: true,
    scaleRange: _scaleRange,
    onSwitchActiveTarget,
  });

  const { centered, setCentered, getNextLayoutKey } = useLayout({
    layout,
    layoutOptions,
    rootRef,
    cells,
    zoomable,
    zoomer,
    scaleRange,
    layoutKey,
    dispatch,
  });

  const reCenter = useCallback(() => {
    setCentered(false);
  }, [setCentered]);

  const previousCellsRef = useRef(initialCells);

  useEffect(() => {
    if (initialCells !== previousCellsRef.current) {
      previousCellsRef.current = initialCells;
      const result = updateCells({
        canvasWidth: shadowRoot.host.clientWidth,
        canvasHeight: shadowRoot.host.clientHeight,
        defaultNodeSize,
        layout,
        previousCells: cells,
        cells: initialCells,
        scaleRange,
        transform,
      });
      dispatch({ type: "update-cells", payload: result.cells });
    }
  }, [
    cells,
    defaultNodeSize,
    initialCells,
    layout,
    scaleRange,
    shadowRoot,
    transform,
  ]);

  const activeTarget = useActiveTarget({
    rootRef,
    activeTarget: _activeTarget,
    onActiveTargetChange,
  });

  const defPrefix = useMemo(() => `${uniqueId("diagram-")}-`, []);
  const markerPrefix = `${defPrefix}line-arrow-`;

  const handleNodeBrickResize = useCallback(
    (id: string, size: SizeTuple | null) => {
      dispatch({
        type: "update-node-size",
        payload: { id, size },
        layoutKey: getNextLayoutKey(),
      });
    },
    [getNextLayoutKey]
  );

  const [hoverCell, setHoverCell] = useState<Cell | null>(null);
  const handleCellMouseEnter = useCallback((cell: Cell) => {
    setHoverCell(cell);
  }, []);
  const handleCellMouseLeave = useCallback((cell: Cell) => {
    setHoverCell((prev) => (prev === cell ? null : prev));
  }, []);

  const [unrelatedCells, setUnrelatedCells] = useState<Cell[]>([]);
  useEffect(() => {
    const nextUnrelated = fadeUnrelatedCells
      ? getUnrelatedCells(cells, null, hoverCell)
      : [];
    // Do not update the state when prev and next are both empty.
    setUnrelatedCells((prev) =>
      prev.length === 0 && nextUnrelated.length === 0 ? prev : nextUnrelated
    );
  }, [cells, fadeUnrelatedCells, hoverCell]);

  const handleZoomSlide = useCallback(
    (value: number) => {
      // istanbul ignore next
      if (process.env.NODE_ENV !== "test") {
        zoomer.scaleTo(select(rootRef.current!), value / 100);
      }
    },
    [zoomer]
  );

  const { lineConfMap, markers } = useLineMarkers({
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
          <g className="cells">
            {cells.map((cell) => (
              <CellComponent
                key={`${cell.type}:${isEdgeCell(cell) ? `${cell.source}~${cell.target}` : cell.id}`}
                layout={layout}
                cell={cell}
                cells={cells}
                degraded={degraded}
                degradedNodeLabel={degradedNodeLabel}
                defaultNodeBricks={defaultNodeBricks}
                lineConfMap={lineConfMap}
                transform={transform}
                activeTarget={activeTarget}
                readOnly
                unrelatedCells={unrelatedCells}
                onSwitchActiveTarget={onSwitchActiveTarget}
                onCellContextMenu={onCellContextMenu}
                onCellClick={onCellClick}
                onNodeBrickResize={handleNodeBrickResize}
                onCellMouseEnter={
                  fadeUnrelatedCells && isNodeCell(cell)
                    ? handleCellMouseEnter
                    : undefined
                }
                onCellMouseLeave={
                  fadeUnrelatedCells && isNodeCell(cell)
                    ? handleCellMouseLeave
                    : undefined
                }
              />
            ))}
          </g>
        </g>
      </svg>
      {!hideZoomBar && (
        <ZoomBarComponent
          shadowRoot={shadowRoot}
          scale={transform.k}
          scaleRange={scaleRange}
          onZoomChange={handleZoomSlide}
          onReCenter={reCenter}
        />
      )}
    </>
  );
}
