import { useMemo } from "react";
import {
  __secret_internals,
  checkIfByTransform,
  checkIfOfComputed,
} from "@next-core/runtime";
import { findIndex, isUndefined, omitBy } from "lodash";
import type {
  Cell,
  ComputedEdgeLineConf,
  ComputedLineConnecterConf,
  EdgeCell,
  EdgeLineConf,
  LineConnecterConf,
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
import { LineMarkerConf } from "../../diagram/interfaces";

export interface UseLineMarkersOptions {
  cells: Cell[];
  defaultEdgeLines: EdgeLineConf[] | undefined;
  markerPrefix: string;
  lineConnector?: LineConnecterConf | boolean;
}

export function useLineMarkers({
  cells,
  defaultEdgeLines,
  markerPrefix,
  lineConnector,
}: UseLineMarkersOptions): {
  lineConfMap: WeakMap<EdgeCell, ComputedEdgeLineConf>;
  lineConnectorConf: ComputedLineConnecterConf | null;
  markers: LineMarker[];
} {
  return useMemo(() => {
    // Always put the default stroke marker at the first position,
    // since the connecting line will use it.
    const markers: LineMarker[] = [
      {
        strokeColor: DEFAULT_LINE_STROKE_COLOR,
        markerType: "arrow",
      },
    ];

    let lineConnectorConf: ComputedLineConnecterConf | null = null;
    if (lineConnector) {
      lineConnectorConf = {
        ...getDefaultLineConf(),
        editingStrokeColor: "var(--palette-blue-5)",
        ...omitBy(lineConnector === true ? {} : lineConnector, isUndefined),
      } as ComputedLineConnecterConf;
      const lineMarkers: LineMarkerConf[] = getMarkers(lineConnectorConf);
      for (const marker of lineMarkers) {
        const { placement, type: _type } = marker;
        const type = _type ?? "arrow";
        const markerIndex = addMarker(
          {
            strokeColor: lineConnectorConf.strokeColor,
            markerType: type,
          },
          markers
        );
        const editingMarkerIndex = addMarker(
          {
            strokeColor: lineConnectorConf.editingStrokeColor,
            markerType: type,
          },
          markers
        );
        if (placement === "start") {
          lineConnectorConf.$markerStartUrl = `url(#${markerPrefix}${markerIndex})`;
          lineConnectorConf.$editingStartMarkerUrl = `url(#${markerPrefix}${editingMarkerIndex})`;
        } else {
          lineConnectorConf.$markerEndUrl = `url(#${markerPrefix}${markerIndex})`;
          lineConnectorConf.$editingEndMarkerUrl = `url(#${markerPrefix}${editingMarkerIndex})`;
        }
      }
    }

    const map = new WeakMap<EdgeCell, ComputedEdgeLineConf>();
    for (const cell of cells) {
      if (isEdgeCell(cell)) {
        const computedLineConf =
          (Array.isArray(defaultEdgeLines)
            ? __secret_internals.legacyDoTransform(
                { edge: cell },
                defaultEdgeLines.find((item) =>
                  checkIfByTransform(item, { edge: cell })
                )
              )
            : (
                __secret_internals.legacyDoTransform(
                  { edge: cell },
                  defaultEdgeLines
                ) as EdgeLineConf[]
              )?.find((item) => checkIfOfComputed(item))) ?? {};
        const lineConf = {
          ...getDefaultLineConf(),
          ...omitBy(computedLineConf, isUndefined),
          ...omitBy(cell.view, isUndefined),
        } as ComputedEdgeLineConf;
        if (lineConf.parallelGap === undefined) {
          lineConf.parallelGap = lineConf.interactStrokeWidth;
        }

        const lineMarkers: LineMarkerConf[] = getMarkers(lineConf);

        for (const marker of lineMarkers) {
          const { placement, type: _type } = marker;
          const type = _type ?? "arrow";
          const markerIndex = addMarker(
            {
              strokeColor: lineConf.strokeColor,
              markerType: type,
            },
            markers
          );
          if (placement === "start") {
            lineConf.$markerStartUrl = `url(#${markerPrefix}${markerIndex})`;
          } else {
            lineConf.$markerEndUrl = `url(#${markerPrefix}${markerIndex})`;
          }

          const activeStrokeColor = lineConf.overrides?.active?.strokeColor;
          if (activeStrokeColor && activeStrokeColor !== lineConf.strokeColor) {
            const activeMarkerIndex = addMarker(
              {
                strokeColor: activeStrokeColor,
                markerType: type,
              },
              markers
            );
            if (placement === "start") {
              lineConf.$activeMarkerStartUrl = `url(#${markerPrefix}${activeMarkerIndex})`;
            } else {
              lineConf.$activeMarkerEndUrl = `url(#${markerPrefix}${activeMarkerIndex})`;
            }
          }

          const activeRelatedStrokeColor =
            lineConf.overrides?.activeRelated?.strokeColor;
          if (
            activeRelatedStrokeColor &&
            activeRelatedStrokeColor !== lineConf.strokeColor
          ) {
            const activeRelatedMarkerIndex = addMarker(
              {
                strokeColor: activeRelatedStrokeColor,
                markerType: type,
              },
              markers
            );
            if (placement === "start") {
              lineConf.$activeRelatedMarkerStartUrl = `url(#${markerPrefix}${activeRelatedMarkerIndex})`;
            } else {
              lineConf.$activeRelatedMarkerEndUrl = `url(#${markerPrefix}${activeRelatedMarkerIndex})`;
            }
          }
        }
        map.set(cell, lineConf);
      }
    }
    return { lineConfMap: map, lineConnectorConf, markers };
  }, [cells, defaultEdgeLines, lineConnector, markerPrefix]);
}
export function getMarkers(lineConf: ComputedEdgeLineConf): LineMarkerConf[] {
  let lineMarkers: LineMarkerConf[] = [];
  if (lineConf.markers) {
    lineMarkers = lineConf.markers;
  } else {
    if (lineConf.showStartArrow) {
      lineMarkers.push({
        type: "arrow",
        placement: "start",
      });
    }
    if (lineConf.showEndArrow) {
      lineMarkers.push({
        type: "arrow",
        placement: "end",
      });
    }
  }
  return lineMarkers;
}
function addMarker(marker: LineMarker, markers: LineMarker[]): number {
  let markerIndex = findIndex(markers, marker);
  if (markerIndex === -1) {
    markerIndex = markers.push(marker) - 1;
  }
  return markerIndex;
}

function getDefaultLineConf(): EdgeLineConf {
  return {
    type: "straight",
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
  };
}
