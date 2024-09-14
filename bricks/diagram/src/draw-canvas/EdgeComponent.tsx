import React, { useEffect, useMemo, useRef } from "react";
import classNames from "classnames";
import type { Cell, ComputedEdgeLineConf, EdgeCell } from "./interfaces";
import { isEdgeCell, isStraightType } from "./processors/asserts";
import { DEFAULT_LINE_INTERACT_ANIMATE_DURATION } from "./constants";
import { curveLine } from "../diagram/lines/curveLine";
import { getSmartLinePoints } from "../shared/canvas/processors/getSmartLinePoints";
import { findNodeOrAreaDecorator } from "./processors/findNodeOrAreaDecorator";
import { useHoverStateContext } from "./HoverStateContext";

export interface EdgeComponentProps {
  edge: EdgeCell;
  cells: Cell[];
  lineConfMap: WeakMap<EdgeCell, ComputedEdgeLineConf>;
  active?: boolean;
}

export function EdgeComponent({
  edge,
  cells,
  lineConfMap,
  active,
}: EdgeComponentProps): JSX.Element | null {
  const { setActiveEditableLine } = useHoverStateContext();
  const pathRef = useRef<SVGPathElement>(null);
  const sourceNode = useMemo(
    () => findNodeOrAreaDecorator(cells, edge.source),
    [cells, edge.source]
  );
  const targetNode = useMemo(
    () => findNodeOrAreaDecorator(cells, edge.target),
    [cells, edge.target]
  );
  const lineConf = useMemo(() => lineConfMap.get(edge)!, [edge, lineConfMap]);

  const parallelGap = useMemo(() => {
    const hasOppositeEdge =
      isStraightType(edge.view?.type) &&
      cells.some(
        (cell) =>
          isEdgeCell(cell) &&
          cell.source === edge.target &&
          cell.target === edge.source &&
          isStraightType(cell.view?.type)
      );
    return hasOppositeEdge ? lineConf.parallelGap : 0;
  }, [cells, edge.source, edge.target, edge.view, lineConf.parallelGap]);

  const linePoints = useMemo(() => {
    const points =
      sourceNode &&
      targetNode &&
      sourceNode.view.x != null &&
      targetNode.view.x != null
        ? getSmartLinePoints(
            sourceNode.view,
            targetNode.view,
            edge.view,
            parallelGap
          )
        : null;
    return points;
  }, [edge.view, parallelGap, sourceNode, targetNode]);

  const line = useMemo(() => {
    const fixedLineType = lineConf.type;
    return curveLine(
      linePoints,
      fixedLineType === "curve" ? lineConf.curveType : "curveLinear",
      0,
      1
    );
  }, [lineConf, linePoints]);

  useEffect(() => {
    setActiveEditableLine((prev) =>
      active
        ? linePoints && sourceNode && targetNode
          ? {
              edge,
              source: sourceNode,
              target: targetNode,
              linePoints,
              lineType: lineConf.type,
              lineCurveType: lineConf.curveType,
              parallelGap,
            }
          : null
        : prev?.edge &&
            prev.edge.source === edge.source &&
            prev.edge.target === edge.target
          ? null
          : prev
    );
  }, [
    active,
    edge,
    lineConf.curveType,
    lineConf.type,
    linePoints,
    setActiveEditableLine,
    sourceNode,
    targetNode,
    parallelGap,
  ]);

  if (!line || !linePoints) {
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
