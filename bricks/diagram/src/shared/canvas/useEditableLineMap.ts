import { useMemo } from "react";
import type {
  Cell,
  ComputedEdgeLineConf,
  EdgeCell,
  EditableLine,
} from "../../draw-canvas/interfaces";
import {
  isEdgeCell,
  isStraightType,
} from "../../draw-canvas/processors/asserts";
import { findNodeOrAreaDecorator } from "../../draw-canvas/processors/findNodeOrAreaDecorator";
import { getSmartLinePoints } from "./processors/getSmartLinePoints";

export function useEditableLineMap({
  cells,
  lineConfMap,
}: {
  cells: Cell[];
  lineConfMap: WeakMap<EdgeCell, ComputedEdgeLineConf>;
}) {
  return useMemo(() => {
    const map = new WeakMap<EdgeCell, EditableLine>();

    for (const edge of cells) {
      if (isEdgeCell(edge)) {
        const lineConf = lineConfMap.get(edge)!;

        const sourceNode = findNodeOrAreaDecorator(cells, edge.source);
        const targetNode = findNodeOrAreaDecorator(cells, edge.target);

        const hasOppositeEdge =
          isStraightType(edge.view?.type) &&
          cells.some(
            (cell) =>
              isEdgeCell(cell) &&
              cell.source === edge.target &&
              cell.target === edge.source &&
              isStraightType(cell.view?.type)
          );
        const parallelGap = hasOppositeEdge ? lineConf.parallelGap : 0;

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

        if (points) {
          map.set(edge, {
            edge,
            points,
            source: sourceNode!,
            target: targetNode!,
            parallelGap,
          });
        }
      }
    }
    return map;
  }, [cells, lineConfMap]);
}
