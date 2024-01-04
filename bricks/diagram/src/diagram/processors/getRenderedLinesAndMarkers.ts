import { findIndex, uniqueId } from "lodash";
import { __secret_internals } from "@next-core/runtime";
import type {
  LineConf,
  LineMarker,
  RenderedEdge,
  RenderedLine,
} from "../interfaces";
import { matchEdgeByFilter } from "./matchEdgeByFilter";
import {
  DEFAULT_LINE_CURVE_TYPE,
  DEFAULT_LINE_INTERACT_STROKE_WIDTH,
  DEFAULT_LINE_STROKE_COLOR,
  DEFAULT_LINE_STROKE_WIDTH,
} from "../constants";
import { curveLine } from "../lines/curveLine";

export function getRenderedLinesAndMarkers(
  renderedEdges: RenderedEdge[],
  lines: LineConf[] | undefined
) {
  const renderedLines: RenderedLine[] = [];
  const markers: LineMarker[] = [];
  for (const { data, points } of renderedEdges) {
    const { label, ...restLineConf } =
      lines?.find((line) => matchEdgeByFilter(data, line)) ?? {};

    const computedLineConf = __secret_internals.legacyDoTransform(
      { edge: data },
      restLineConf
    ) as LineConf | undefined;
    if (computedLineConf?.draw === false) {
      continue;
    }
    const line: RenderedLine["line"] = {
      strokeColor: DEFAULT_LINE_STROKE_COLOR,
      strokeWidth: DEFAULT_LINE_STROKE_WIDTH,
      curveType: DEFAULT_LINE_CURVE_TYPE,
      interactStrokeWidth: DEFAULT_LINE_INTERACT_STROKE_WIDTH,
      ...computedLineConf,
      label,
      $id: uniqueId("line-"),
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

    const d = curveLine(points, line.arrow ? -5 : 0, line.curveType);

    renderedLines.push({
      line,
      d,
      markerIndex,
      edge: data,
    });
  }
  return {
    renderedLines,
    markers,
  };
}
