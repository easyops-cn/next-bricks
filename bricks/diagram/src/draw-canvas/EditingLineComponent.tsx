// istanbul ignore file: experimental
import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import type { ComputedLineConnecterConf } from "./interfaces";
import type { PositionTuple, TransformLiteral } from "../diagram/interfaces";
import { curveLine } from "../diagram/lines/curveLine";
import { useHoverStateContext } from "./HoverStateContext";
import { getEditingLinePoints } from "../shared/canvas/processors/getEditingLinePoints";

export interface EditingLineComponentProps {
  transform: TransformLiteral;
  options: ComputedLineConnecterConf;
}

export function EditingLineComponent({
  transform,
  options,
}: EditingLineComponentProps): JSX.Element {
  const [connectLineTo, setConnectLineTo] = useState<PositionTuple | null>(
    null
  );
  const { hoverState, lineEditorState, setLineEditorState } =
    useHoverStateContext();

  useEffect(() => {
    if (!lineEditorState) {
      return;
    }
    const onMouseMove = (e: MouseEvent) => {
      // const endPoint = lineEditorState.endPoints[lineEditorState.type === "entry" ? 1 : 0];
      // Set connect line to based on the mouse position and the transform
      setConnectLineTo([
        (e.clientX - transform.x - lineEditorState.offset[0]) / transform.k,
        (e.clientY - transform.y - lineEditorState.offset[1]) / transform.k,
      ]);
    };
    function onMouseUp(e: MouseEvent) {
      e.preventDefault();
      reset();
    }
    function reset() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setConnectLineTo(null);
      setLineEditorState(null);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return reset;
  }, [lineEditorState, transform, setLineEditorState]);

  const line = useMemo(() => {
    const fixedLineType = options.type === "auto" ? "polyline" : options.type;
    const points = getEditingLinePoints(
      lineEditorState,
      connectLineTo,
      hoverState
    );
    return curveLine(
      points,
      fixedLineType === "curve" ? options.curveType : "curveLinear",
      0,
      1
    );
  }, [connectLineTo, hoverState, lineEditorState, options]);

  return (
    <path
      className={classNames("editing-line", {
        editing: !!(lineEditorState && connectLineTo),
      })}
      d={line}
      fill="none"
      stroke={options.editingStrokeColor}
      markerStart={options.showStartArrow ? options.$editingMarkerUrl : ""}
      markerEnd={options.showEndArrow ? options.$editingMarkerUrl : ""}
    />
  );
}
