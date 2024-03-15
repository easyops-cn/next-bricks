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
} from "../draw-canvas/interfaces";
import { MarkerComponent } from "../diagram/MarkerComponent";
import { sameTarget } from "../draw-canvas/processors/sameTarget";
import { CellComponent } from "../draw-canvas/CellComponent";
import { initializeCells } from "../draw-canvas/processors/initializeCells";
import { DEFAULT_NODE_SIZE } from "../draw-canvas/constants";
import { useZoom } from "../shared/canvas/useZoom";
import { useAutoCenter } from "../shared/canvas/useAutoCenter";
import { useActiveTarget } from "../shared/canvas/useActiveTarget";
import { rootReducer } from "../draw-canvas/reducers";
import { getUnrelatedCells } from "../draw-canvas/processors/getUnrelatedCells";
import { isEdgeCell, isNodeCell } from "../draw-canvas/processors/asserts";
import { ZoomBarComponent } from "../shared/canvas/ZoomBarComponent";
import styleText from "../shared/canvas/styles.shadow.css";
import zoomBarStyleText from "../shared/canvas/ZoomBarComponent.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface EoDisplayCanvasProps {
  cells: InitialCell[] | undefined;
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

/**
 * 用于展示查看的画布。
 */
export
@defineElement("eo-display-canvas", {
  styleTexts: [styleText, zoomBarStyleText],
})
class EoDisplayCanvas extends ReactNextElement implements EoDisplayCanvasProps {
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

  render() {
    return (
      <EoDisplayCanvasComponent
        shadowRoot={this.shadowRoot!}
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
        onCellContextMenu={this.#handleCellContextMenu}
      />
    );
  }
}

export interface EoDisplayCanvasComponentProps extends EoDisplayCanvasProps {
  shadowRoot: ShadowRoot;
  onActiveTargetChange(target: ActiveTarget | null): void;
  onSwitchActiveTarget(target: ActiveTarget | null): void;
  onCellContextMenu(detail: CellContextMenuDetail): void;
}

function EoDisplayCanvasComponent({
  shadowRoot,
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
  onCellContextMenu,
}: EoDisplayCanvasComponentProps) {
  const [{ cells }, dispatch] = useReducer(
    rootReducer,
    initialCells,
    (initialCells) => ({
      cells: initializeCells(initialCells, { defaultNodeSize }),
    })
  );

  const rootRef = useRef<SVGSVGElement>(null);
  const cellsRef = useRef<SVGGElement>(null);

  const { grabbing, transform, zoomer, scaleRange } = useZoom({
    rootRef,
    zoomable,
    scrollable,
    pannable,
    scaleRange: _scaleRange,
    onSwitchActiveTarget,
  });

  const [centered, setCentered] = useAutoCenter({
    rootRef,
    cells,
    zoomable,
    zoomer,
    scaleRange,
  });

  const activeTarget = useActiveTarget({
    cellsRef,
    activeTarget: _activeTarget,
    onActiveTargetChange,
  });

  const defPrefix = useMemo(() => `${uniqueId("diagram-")}-`, []);
  const markerPrefix = `${defPrefix}line-arrow-`;
  const markerEnd = `${markerPrefix}1`;

  const handleNodeBrickResize = useCallback(
    (id: string, size: SizeTuple | null) => {
      dispatch({ type: "update-node-size", payload: { id, size } });
    },
    []
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

  const reCenter = useCallback(() => {
    setCentered(false);
  }, [setCentered]);

  return (
    <>
      <svg
        width="100%"
        height="100%"
        ref={rootRef}
        className={classNames("root", { grabbing, pannable, ready: centered })}
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
                key={`${cell.type}:${isEdgeCell(cell) ? `${cell.source}~${cell.target}` : cell.id}`}
                cell={cell}
                cells={cells}
                defaultNodeBricks={defaultNodeBricks}
                defaultEdgeLines={defaultEdgeLines}
                transform={transform}
                markerEnd={markerEnd}
                active={sameTarget(activeTarget, cell)}
                readOnly
                unrelatedCells={unrelatedCells}
                onSwitchActiveTarget={onSwitchActiveTarget}
                onCellContextMenu={onCellContextMenu}
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
      <ZoomBarComponent
        shadowRoot={shadowRoot}
        scale={transform.k}
        scaleRange={scaleRange}
        onZoomChange={handleZoomSlide}
        onReCenter={reCenter}
      />
    </>
  );
}
