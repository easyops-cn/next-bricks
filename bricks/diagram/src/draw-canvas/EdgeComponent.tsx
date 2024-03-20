import React, { useMemo } from "react";
import classNames from "classnames";
import type {
  Cell,
  ComputedEdgeLineConf,
  EdgeCell,
  NodeView,
} from "./interfaces";
import { getDirectLinePoints } from "../diagram/lines/getDirectLinePoints";
import type { NodeRect } from "../diagram/interfaces";
import { findNode } from "./processors/findNode";
import { isEdgeCell } from "./processors/asserts";

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
  const sourceNode = useMemo(
    () => findNode(cells, edge.source),
    [cells, edge.source]
  );
  const targetNode = useMemo(
    () => findNode(cells, edge.target),
    [cells, edge.target]
  );
  const lineConf = useMemo(() => lineConfMap.get(edge)!, [edge, lineConfMap]);

  const parallelGap = useMemo(() => {
    const hasOppositeEdge = cells.some(
      (cell) =>
        isEdgeCell(cell) &&
        cell.source === edge.target &&
        cell.target === edge.source
    );
    return hasOppositeEdge ? lineConf.parallelGap : 0;
  }, [cells, edge, lineConf.parallelGap]);

  const padding = 5;

  const line = useMemo(
    () =>
      sourceNode &&
      targetNode &&
      sourceNode.view.x != null &&
      targetNode.view.x != null
        ? getDirectLinePoints(
            nodeViewToNodeRect(sourceNode.view, padding),
            nodeViewToNodeRect(targetNode.view, padding),
            parallelGap
          )
        : null,
    [parallelGap, sourceNode, targetNode]
  );

  if (!line) {
    // This happens when source or target is not found,
    // or when source or target has not been positioned yet.
    return null;
  }

  const d = `M${line[0].x} ${line[0].y}L${line[1].x} ${line[1].y}`;

  return (
    <>
      <path
        // This `path` is made for expanding interaction area of graph lines.
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={lineConf.interactStrokeWidth}
      />
      <path
        className={classNames("line", { dashed: lineConf.dashed })}
        d={d}
        fill="none"
        stroke={lineConf.strokeColor}
        strokeWidth={lineConf.strokeWidth}
        markerEnd={lineConf.markerEnd}
      />
      <path className="line-active-bg" d={d} fill="none" />
    </>
  );
}

function nodeViewToNodeRect(view: NodeView, padding: number): NodeRect {
  return {
    x: view.x + view.width / 2,
    y: view.y + view.height / 2,
    width: view.width + padding,
    height: view.height + padding,
  };
}
