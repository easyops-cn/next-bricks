import { useMemo } from "react";
import { __secret_internals, checkIfByTransform } from "@next-core/runtime";
import { findIndex, isUndefined, omitBy } from "lodash";
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
  DEFAULT_LINE_INTERACT_SHOW_START_ARROW,
  DEFAULT_LINE_INTERACT_SHOW_END_ARROW,
  DEFAULT_LINE_INTERACT_ANIMATE_DURATION,
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
        const computedLineConf =
          __secret_internals.legacyDoTransform(
            { edge: cell },
            defaultEdgeLines?.find((item) =>
              checkIfByTransform(item, { edge: cell })
            )
          ) ?? {};
        const lineConf = {
          dashed: false,
          strokeColor: DEFAULT_LINE_STROKE_COLOR,
          strokeWidth: DEFAULT_LINE_STROKE_WIDTH,
          interactStrokeWidth: DEFAULT_LINE_INTERACT_STROKE_WIDTH,
          showStartArrow: DEFAULT_LINE_INTERACT_SHOW_START_ARROW,
          showEndArrow: DEFAULT_LINE_INTERACT_SHOW_END_ARROW,
          animate: {
            useAnimate: false,
            duration: DEFAULT_LINE_INTERACT_ANIMATE_DURATION,
          },
          ...omitBy(computedLineConf, isUndefined),
        } as ComputedEdgeLineConf;
        if (lineConf.parallelGap === undefined) {
          lineConf.parallelGap = lineConf.interactStrokeWidth;
        }
        const markerEndIndex = addMarker(
          { strokeColor: lineConf.strokeColor },
          markers
        );
        lineConf.markerArrow = `url(#${markerPrefix}${markerEndIndex})`;
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
