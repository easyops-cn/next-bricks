import React, { useMemo } from "react";
import type { Cell, EdgeCell, NodeView } from "./interfaces";
import { getDirectLinePoints } from "../diagram/lines/getDirectLinePoints";
import type { NodeRect } from "../diagram/interfaces";
import { findNode } from "./processors/findNode";

export interface EdgeComponentProps {
  edge: EdgeCell;
  cells: Cell[];
  markerEnd: string;
}

export function EdgeComponent({
  edge,
  cells,
  markerEnd,
}: EdgeComponentProps): JSX.Element | null {
  const sourceNode = useMemo(
    () => findNode(cells, edge.source),
    [cells, edge.source]
  );
  const targetNode = useMemo(
    () => findNode(cells, edge.target),
    [cells, edge.target]
  );

  const padding = 5;

  const line = useMemo(
    () =>
      sourceNode && targetNode
        ? getDirectLinePoints(
            nodeViewToNodeRect(sourceNode.view, padding),
            nodeViewToNodeRect(targetNode.view, padding)
          )
        : null,
    [sourceNode, targetNode]
  );

  if (!line) {
    // This happens when source or target is not found
    return null;
  }

  return (
    <path
      className="line"
      d={`M${line[0].x} ${line[0].y}L${line[1].x} ${line[1].y}`}
      fill="none"
      stroke="gray"
      markerEnd={`url(#${markerEnd})`}
    />
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
