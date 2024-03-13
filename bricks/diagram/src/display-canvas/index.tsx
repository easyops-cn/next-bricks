import React, { useCallback, useMemo, useReducer, useRef } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { uniqueId } from "lodash";
import classNames from "classnames";
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
import styleText from "../shared/canvas/styles.shadow.css";

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
  styleTexts: [styleText],
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
  onActiveTargetChange(target: ActiveTarget | null): void;
  onSwitchActiveTarget(target: ActiveTarget | null): void;
  onCellContextMenu(detail: CellContextMenuDetail): void;
}

function EoDisplayCanvasComponent({
  cells: initialCells,
  defaultNodeSize,
  defaultNodeBricks,
  defaultEdgeLines,
  activeTarget: _activeTarget,
  // fadeUnrelatedCells,
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

  const [centered] = useAutoCenter({
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

  // Todo
  const unrelatedCells = useRef<Cell[]>([]).current;

  return (
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
              key={`${cell.type}:${cell.type === "edge" ? `${cell.source}~${cell.target}` : cell.id}`}
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
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
