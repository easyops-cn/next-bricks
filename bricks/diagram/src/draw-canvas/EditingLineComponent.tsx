// istanbul ignore file: experimental
import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import type { ComputedLineConnecterConf } from "./interfaces";
import type {
  NodePosition,
  PositionTuple,
  TransformLiteral,
} from "../diagram/interfaces";
import { curveLine } from "../diagram/lines/curveLine";
import { useHoverStateContext } from "./HoverStateContext";
import {
  getEditingLinePoints,
  getNewLineVertices,
} from "../shared/canvas/processors/getEditingLinePoints";

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
  const {
    activeEditableLine,
    hoverState,
    lineEditorState,
    setLineEditorState,
    onChangeEdgeView,
  } = useHoverStateContext();
  const movedRef = useRef(false);

  useEffect(() => {
    if (!lineEditorState) {
      setTimeout(() => {
        movedRef.current = false;
      }, 0);
    }
  }, [lineEditorState]);

  useEffect(() => {
    if (!lineEditorState) {
      return;
    }
    movedRef.current = false;
    const { type, offset, from } = lineEditorState;
    // Set connect line to based on the mouse position and the transform
    const getConnectTo = (e: MouseEvent): PositionTuple => {
      const position: NodePosition = {
        x: (e.clientX - transform.x - offset[0]) / transform.k,
        y: (e.clientY - transform.y - offset[1]) / transform.k,
      };
      let diff = Infinity;
      if (type === "control" && !e.altKey) {
        // Snap to other points
        const { linePoints, control } = lineEditorState;
        const axis = control.direction === "ns" ? "y" : "x";
        const original = control[axis];
        const otherPoints = linePoints.filter(
          (_, i) =>
            i === 0 ||
            i === linePoints.length - 1 ||
            (i !== control.index && i !== control.index + 1)
        );
        const snapDistance = 5;
        for (const point of otherPoints) {
          const newDiff = Math.abs(point[axis] - position[axis]);
          if (newDiff <= snapDistance && newDiff < diff) {
            position[axis] = point[axis];
            diff = newDiff;
            if (!movedRef.current && original !== position[axis]) {
              movedRef.current = true;
            }
          }
        }
      }
      if (diff === Infinity && !movedRef.current) {
        const movementX = (e.clientX - from[0]) / transform.k;
        const movementY = (e.clientY - from[1]) / transform.k;
        movedRef.current = movementX ** 2 + movementY ** 2 >= 9;
      }
      return [position.x, position.y];
    };
    const onMouseMove = (e: MouseEvent) => {
      const newConnectTo = getConnectTo(e);
      if (movedRef.current) {
        setConnectLineTo(newConnectTo);
      }
    };
    function onMouseUp(e: MouseEvent) {
      e.preventDefault();
      reset();
      if (lineEditorState?.type === "control") {
        const newConnectTo = getConnectTo(e);
        if (movedRef.current) {
          const {
            source,
            target,
            edge: { view },
          } = lineEditorState;
          onChangeEdgeView?.(source, target, {
            ...view,
            vertices: getNewLineVertices(lineEditorState, newConnectTo),
          });
        }
      }
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
  }, [lineEditorState, transform, setLineEditorState, onChangeEdgeView]);

  useEffect(() => {
    if (!activeEditableLine) {
      return;
    }
    const handleBodyClick = (e: MouseEvent) => {
      if (movedRef.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [activeEditableLine]);

  const line = useMemo(() => {
    const points = getEditingLinePoints(
      lineEditorState,
      connectLineTo,
      hoverState
    );
    return curveLine(
      points,
      lineEditorState?.edge.view?.type === "curve"
        ? lineEditorState.edge.view.curveType
        : "curveLinear",
      0,
      1
    );
  }, [connectLineTo, hoverState, lineEditorState]);

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
