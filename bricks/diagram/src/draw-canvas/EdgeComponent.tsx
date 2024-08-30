import React, { useMemo, useRef } from "react";
import classNames from "classnames";
import { omitBy } from "lodash";
import type {
  Cell,
  ComputedEdgeLineConf,
  EdgeCell,
  EdgeView,
} from "./interfaces";
import { getDirectLinePoints } from "../diagram/lines/getDirectLinePoints";
import type { NodeRect } from "../diagram/interfaces";
import { findNode } from "./processors/findNode";
import { isEdgeCell } from "./processors/asserts";
import { DEFAULT_LINE_INTERACT_ANIMATE_DURATION } from "./constants";
import { curveLine } from "../diagram/lines/curveLine";
import { nodeViewToNodeRect } from "../shared/canvas/processors/nodeViewToNodeRect";
import { getSmartLinePoints } from "../shared/canvas/processors/getSmartLinePoints";
import { findNodeOrAreaDecorator } from "./processors/findNodeOrAreaDecorator";

export interface EdgeComponentProps {
  edge: EdgeCell;
  cells: Cell[];
  lineConfMap: WeakMap<EdgeCell, ComputedEdgeLineConf>;
}

export function EdgeComponent({
  edge,
  cells,
  lineConfMap,
}: EdgeComponentProps): JSX.Element | null {
  const pathRef = useRef<SVGPathElement>(null);
  const sourceNode = useMemo(
    () => findNodeOrAreaDecorator(cells, edge.source),
    [cells, edge.source]
  );
  const targetNode = useMemo(
    () => findNodeOrAreaDecorator(cells, edge.target),
    [cells, edge.target]
  );
  const lineConf = useMemo(
    () => ({
      ...lineConfMap.get(edge)!,
      ...omitBy(
        edge.view,
        (value, key) => value === undefined || key === "$markerUrl"
      ),
    }),
    [edge, lineConfMap]
  );

  const parallelGap = useMemo(() => {
    const hasOppositeEdge = cells.some(
      (cell) =>
        isEdgeCell(cell) &&
        cell.source === edge.target &&
        cell.target === edge.source &&
        !(edge.view?.exitPosition && edge.view.entryPosition)
    );
    return hasOppositeEdge ? lineConf.parallelGap : 0;
  }, [cells, edge, lineConf.parallelGap]);

  const padding = 5;

  const line = useMemo(() => {
    const points =
      sourceNode &&
      targetNode &&
      sourceNode.view.x != null &&
      targetNode.view.x != null
        ? edge.view?.exitPosition && edge.view.entryPosition
          ? getSmartLinePoints(
              sourceNode.view,
              targetNode.view,
              edge.view as Required<
                Pick<EdgeView, "exitPosition" | "entryPosition">
              >
            )
          : getDirectLinePoints(
              nodeViewToNodeRect(sourceNode.view, padding),
              nodeViewToNodeRect(targetNode.view, padding),
              parallelGap
            )
        : null;
    const fixedLineType = lineConf.type === "auto" ? "polyline" : lineConf.type;
    return curveLine(
      points,
      fixedLineType === "curve" ? lineConf.curveType : "curveLinear",
      0,
      1
    );
  }, [edge.view, lineConf, parallelGap, sourceNode, targetNode]);

  if (!line) {
    // This happens when source or target is not found,
    // or when source or target has not been positioned yet.
    return null;
  }

  return (
    <>
      <path
        // This `path` is made for expanding interaction area of graph lines.
        d={line}
        fill="none"
        stroke="transparent"
        strokeWidth={lineConf.interactStrokeWidth}
      />
      <path
        ref={pathRef}
        className={classNames("line", {
          dashed: lineConf.dashed,
          [`${lineConf.dashed ? "dashed" : "solid"}-animation`]:
            lineConf.animate.useAnimate,
        })}
        style={
          {
            "--time": `${lineConf.animate.duration ?? DEFAULT_LINE_INTERACT_ANIMATE_DURATION}s`,
            "--solid-length": pathRef.current?.getTotalLength?.(),
          } as React.CSSProperties
        }
        d={line}
        fill="none"
        stroke={lineConf.strokeColor}
        strokeWidth={lineConf.strokeWidth}
        markerStart={lineConf.showStartArrow ? lineConf.$markerUrl : ""}
        markerEnd={lineConf.showEndArrow ? lineConf.$markerUrl : ""}
      />
      <path className="line-active-bg" d={line} fill="none" />
    </>
  );
}
