import { useMemo } from "react";
import { checkIfByTransform } from "@next-core/runtime";
import { findIndex } from "lodash";
import type {
  Cell,
  ComputedEdgeLineConf,
  EdgeCell,
  EdgeLineConf,
  LineMarker,
} from "../../draw-canvas/interfaces";
import { isEdgeCell } from "../../draw-canvas/processors/asserts";
import {
  DEFAULT_LINE_STROKE_COLOR,
  DEFAULT_LINE_STROKE_WIDTH,
  DEFAULT_LINE_INTERACT_STROKE_WIDTH,
} from "../../draw-canvas/constants";

export interface UseLineMarkersOptions {
  cells: Cell[];
  defaultEdgeLines: EdgeLineConf[] | undefined;
  markerPrefix: string;
}

export function useLineMarkers({
  cells,
  defaultEdgeLines,
  markerPrefix,
}: UseLineMarkersOptions): [
  lineConfMap: WeakMap<EdgeCell, ComputedEdgeLineConf>,
  markers: LineMarker[],
] {
  return useMemo(() => {
    // Always put the default stroke marker at the first position,
    // since the connecting line will use it.
    const markers: LineMarker[] = [{ strokeColor: DEFAULT_LINE_STROKE_COLOR }];
    const map = new WeakMap<EdgeCell, ComputedEdgeLineConf>();
    for (const cell of cells) {
      if (isEdgeCell(cell)) {
        const lineConf = {
          dashed: false,
          strokeColor: DEFAULT_LINE_STROKE_COLOR,
          strokeWidth: DEFAULT_LINE_STROKE_WIDTH,
          interactStrokeWidth: DEFAULT_LINE_INTERACT_STROKE_WIDTH,
          ...defaultEdgeLines?.find((item) =>
            checkIfByTransform(item, { edge: cell })
          ),
        } as ComputedEdgeLineConf;
        const markerEndIndex = addMarker(
          { strokeColor: lineConf.strokeColor },
          markers
        );
        lineConf.markerEnd = `url(#${markerPrefix}${markerEndIndex})`;
        map.set(cell, lineConf);
      }
    }
    return [map, markers];
  }, [cells, defaultEdgeLines, markerPrefix]);
}

function addMarker(marker: LineMarker, markers: LineMarker[]): number {
  let markerIndex = findIndex(markers, marker);
  if (markerIndex === -1) {
    markerIndex = markers.push(marker) - 1;
  }
  return markerIndex;
}
