import { findIndex, uniqueId } from "lodash";
import { __secret_internals } from "@next-core/runtime";
import type {
  DiagramEdge,
  LineConf,
  LineMarker,
  NormalizedLine,
} from "../interfaces";
import { matchEdgeByFilter } from "./matchEdgeByFilter";
import {
  DEFAULT_LINE_CURVE_TYPE,
  DEFAULT_LINE_INTERACT_STROKE_WIDTH,
  DEFAULT_LINE_STROKE_COLOR,
  DEFAULT_LINE_STROKE_WIDTH,
} from "../constants";

export function normalizeLinesAndMarkers(
  edges: DiagramEdge[] | undefined,
  lines: LineConf[] | undefined
) {
  const normalizedLines: NormalizedLine[] = [];
  const normalizedLinesMap = new WeakMap<DiagramEdge, string>();
  const markers: LineMarker[] = [];
  for (const edge of edges ?? []) {
    const { label, ...restLineConf } =
      lines?.find((line) => matchEdgeByFilter(edge, line)) ?? {};

    const computedLineConf = __secret_internals.legacyDoTransform(
      { edge },
      restLineConf
    ) as LineConf | undefined;
    if (computedLineConf?.draw === false) {
      continue;
    }
    const id = uniqueId("line-");
    const line: NormalizedLine["line"] = {
      strokeColor: DEFAULT_LINE_STROKE_COLOR,
      strokeWidth: DEFAULT_LINE_STROKE_WIDTH,
      curveType: DEFAULT_LINE_CURVE_TYPE,
      interactStrokeWidth: DEFAULT_LINE_INTERACT_STROKE_WIDTH,
      ...computedLineConf,
      label,
      $id: id,
    };
    normalizedLinesMap.set(edge, id);

    let markerIndex: number | undefined;
    let activeMarkerIndex: number | undefined;
    let activeRelatedMarkerIndex: number | undefined;
    if (line.arrow) {
      markerIndex = addMarker(line.strokeColor, markers);

      const activeStrokeColor =
        line.overrides?.active?.strokeColor ?? line.strokeColor;
      activeMarkerIndex = addMarker(activeStrokeColor, markers);

      const activeRelatedStrokeColor =
        line.overrides?.activeRelated?.strokeColor ?? line.strokeColor;
      activeRelatedMarkerIndex = addMarker(activeRelatedStrokeColor, markers);
    }

    normalizedLines.push({
      line,
      markerIndex,
      activeMarkerIndex,
      activeRelatedMarkerIndex,
      edge,
    });
  }
  return {
    normalizedLines,
    normalizedLinesMap,
    markers,
  };
}

function addMarker(strokeColor: string, markers: LineMarker[]): number {
  const marker: LineMarker = { strokeColor };
  let markerIndex = findIndex(markers, marker);
  if (markerIndex === -1) {
    markerIndex = markers.push(marker) - 1;
  }
  return markerIndex;
}
