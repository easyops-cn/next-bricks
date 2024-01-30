import { findIndex, uniqueId } from "lodash";
import { __secret_internals } from "@next-core/runtime";
import type {
  DiagramEdge,
  LineConf,
  LineMarker,
  LineMarkerConf,
  LineMarkerType,
  NormalizedLine,
  NormalizedLineMarker,
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
      curveType:
        computedLineConf?.type === "polyline"
          ? "curveLinear"
          : DEFAULT_LINE_CURVE_TYPE,
      interactStrokeWidth: DEFAULT_LINE_INTERACT_STROKE_WIDTH,
      type: "auto",
      ...computedLineConf,
      label,
      $id: id,
    };
    normalizedLinesMap.set(edge, id);

    const normalizedMarkers: NormalizedLineMarker[] = [];

    const lineMarkers: LineMarkerConf[] =
      line.markers ?? (line.arrow ? [{ placement: "end", type: "arrow" }] : []);
    for (const marker of lineMarkers) {
      const { placement: _placement, type: _type } = marker;
      const placement = _placement ?? "end";

      let type: LineMarkerType;
      let offsetUnit: number;

      switch (_type) {
        case "0..1":
        case "0..N":
          offsetUnit = 21;
          type = _type;
          break;
        default:
          offsetUnit = 1;
          type = "arrow";
      }
      const offset = offsetUnit * line.strokeWidth;

      const index = addMarker({ type, strokeColor: line.strokeColor }, markers);
      normalizedMarkers.push({
        index,
        placement,
        type,
        variant: "default",
        offset,
      });

      const activeStrokeColor =
        line.overrides?.active?.strokeColor ?? line.strokeColor;
      const activeMarkerIndex = addMarker(
        { type, strokeColor: activeStrokeColor },
        markers
      );
      normalizedMarkers.push({
        index: activeMarkerIndex,
        placement,
        type,
        variant: "active",
        offset,
      });
      const activeRelatedStrokeColor =
        line.overrides?.activeRelated?.strokeColor ?? line.strokeColor;
      const activeRelatedMarkerIndex = addMarker(
        { type, strokeColor: activeRelatedStrokeColor },
        markers
      );
      normalizedMarkers.push({
        index: activeRelatedMarkerIndex,
        placement,
        type,
        variant: "active-related",
        offset,
      });
    }

    normalizedLines.push({
      line,
      markers: normalizedMarkers,
      edge,
    });
  }
  return {
    normalizedLines,
    normalizedLinesMap,
    markers,
  };
}

function addMarker(marker: LineMarker, markers: LineMarker[]): number {
  let markerIndex = findIndex(markers, marker);
  if (markerIndex === -1) {
    markerIndex = markers.push(marker) - 1;
  }
  return markerIndex;
}
