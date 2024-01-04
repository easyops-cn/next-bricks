import { findIndex, uniqueId } from "lodash";
import type {
  LineConf,
  LineMarker,
  RenderedEdge,
  RenderedLine,
} from "../interfaces";
import { matchEdgeByFilter } from "./matchEdgeByFilter";
import {
  DEFAULT_LINE_CURVE_TYPE,
  DEFAULT_LINE_STROKE_COLOR,
  DEFAULT_LINE_STROKE_WIDTH,
} from "../constants";
import { __secret_internals } from "@next-core/runtime";

export function getRenderedLinesAndMarkers(
  renderedEdges: RenderedEdge[],
  lines: LineConf[] | undefined
) {
  const renderedLines: RenderedLine[] = [];
  const markers: LineMarker[] = [];
  for (const renderedEdge of renderedEdges) {
    const lineConf = lines?.find((line) =>
      matchEdgeByFilter(renderedEdge.data, line)
    );
    const computedLineConf = __secret_internals.legacyDoTransform(
      { edge: renderedEdge.data },
      lineConf
    ) as LineConf | undefined;
    if (computedLineConf?.draw === false) {
      continue;
    }
    const line: RenderedLine["line"] = {
      strokeColor: DEFAULT_LINE_STROKE_COLOR,
      strokeWidth: DEFAULT_LINE_STROKE_WIDTH,
      curveType: DEFAULT_LINE_CURVE_TYPE,
      ...computedLineConf,
      $ref: uniqueId("line-"),
    };

    let markerIndex: number | undefined;
    if (line.arrow) {
      const marker: LineMarker = {
        strokeColor: line.strokeColor,
      };
      markerIndex = findIndex(markers, marker);
      if (markerIndex === -1) {
        markerIndex = markers.push(marker) - 1;
      }
    }

    renderedLines.push({
      ...renderedEdge,
      line,
      markerIndex,
    });
  }
  return {
    renderedLines,
    markers,
  };
}
