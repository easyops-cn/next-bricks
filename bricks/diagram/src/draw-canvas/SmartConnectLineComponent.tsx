// istanbul ignore file: experimental
import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import type {
  ComputedLineConnecterConf,
  SmartConnectLineState,
} from "./interfaces";
import type { PositionTuple, TransformLiteral } from "../diagram/interfaces";
import { curveLine } from "../diagram/lines/curveLine";
import { useHoverStateContext } from "./HoverStateContext";
import { getConnectLinePoints } from "../shared/canvas/processors/getConnectLinePoints";

export interface SmartConnectLineComponentProps {
  smartConnectLineState: SmartConnectLineState | null;
  transform: TransformLiteral;
  options: ComputedLineConnecterConf;
}

export function SmartConnectLineComponent({
  smartConnectLineState,
  transform,
  options,
}: SmartConnectLineComponentProps): JSX.Element {
  const [connectLineTo, setConnectLineTo] = useState<PositionTuple | null>(
    null
  );
  const { hoverState, setSmartConnectLineState } = useHoverStateContext();

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
    const fixedLineType = options.type === "auto" ? "polyline" : options.type;
    const points = getConnectLinePoints(
      smartConnectLineState,
      connectLineTo,
      hoverState
    );
    return curveLine(
      points,
      fixedLineType === "curve" ? options.curveType : "curveLinear",
      0,
      1
    );
  }, [connectLineTo, hoverState, smartConnectLineState, options]);

  return (
    <path
      className={classNames("connect-line", {
        connecting: !!(smartConnectLineState && connectLineTo),
      })}
      d={line}
      fill="none"
      stroke={options.strokeColor}
      strokeWidth={options.strokeWidth}
      markerStart={options.showStartArrow ? options.$markerUrl : ""}
      markerEnd={options.showEndArrow ? options.$markerUrl : ""}
    />
  );
}
