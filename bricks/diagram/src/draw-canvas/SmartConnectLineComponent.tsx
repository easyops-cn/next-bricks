// istanbul ignore file: experimental
import React, { useEffect, useMemo, useState, type JSX } from "react";
import classNames from "classnames";
import type { ComputedLineConnecterConf, LineSettings } from "./interfaces";
import type {
  LineMarkerConf,
  PositionTuple,
  TransformLiteral,
} from "../diagram/interfaces";
import { curveLine } from "../diagram/lines/curveLine";
import { useHoverStateContext } from "./HoverStateContext";
import { getConnectLinePoints } from "../shared/canvas/processors/getConnectLinePoints";
import { getMarkers } from "../shared/canvas/useLineMarkers";

export interface SmartConnectLineComponentProps {
  transform: TransformLiteral;
  lineSettings?: LineSettings;
  options: ComputedLineConnecterConf;
}

export function SmartConnectLineComponent({
  transform,
  lineSettings,
  options,
}: SmartConnectLineComponentProps): JSX.Element {
  const [connectLineTo, setConnectLineTo] = useState<PositionTuple | null>(
    null
  );
  const { hoverState, smartConnectLineState, setSmartConnectLineState } =
    useHoverStateContext();

  useEffect(() => {
    if (!smartConnectLineState) {
      return;
    }
    function onMouseMove(e: MouseEvent) {
      // Set connect line to based on the mouse position and the transform
      setConnectLineTo([
        (e.clientX - transform.x - smartConnectLineState!.offset[0]) /
          transform.k,
        (e.clientY - transform.y - smartConnectLineState!.offset[1]) /
          transform.k,
      ]);
    }
    function onMouseUp(e: MouseEvent) {
      e.preventDefault();
      reset();
    }
    function reset() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setConnectLineTo(null);
      setSmartConnectLineState(null);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return reset;
  }, [setSmartConnectLineState, smartConnectLineState, transform]);

  const line = useMemo(() => {
    const points = getConnectLinePoints(
      smartConnectLineState,
      connectLineTo,
      hoverState,
      lineSettings
    );
    return curveLine(
      points,
      lineSettings?.type === "curve" ? lineSettings.curveType : "curveLinear",
      0,
      1
    );
  }, [connectLineTo, hoverState, smartConnectLineState, lineSettings]);

  let markerStart: string | undefined;
  let markerEnd: string | undefined;
  const lineMarkers: LineMarkerConf[] = getMarkers(options);
  for (const marker of lineMarkers) {
    if (marker.placement === "start") {
      markerStart = options.$markerStartUrl;
    } else {
      markerEnd = options.$markerEndUrl;
    }
  }

  return (
    <path
      className={classNames("connect-line", {
        connecting: !!(smartConnectLineState && connectLineTo),
      })}
      d={line}
      fill="none"
      stroke={options.strokeColor}
      strokeWidth={options.strokeWidth}
      markerStart={markerStart}
      markerEnd={markerEnd}
    />
  );
}
