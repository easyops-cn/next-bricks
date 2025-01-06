// istanbul ignore file: experimental
import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import type {
  Cell,
  ComputedLineConnecterConf,
  EdgeCell,
  EditableLine,
} from "./interfaces";
import type {
  LineMarkerConf,
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
import { getMarkers } from "../shared/canvas/useLineMarkers";

export interface EditingLineComponentProps {
  cells: Cell[];
  editableLineMap: WeakMap<EdgeCell, EditableLine>;
  transform: TransformLiteral;
  options: ComputedLineConnecterConf;
}

export function EditingLineComponent({
  cells,
  editableLineMap,
  transform,
  options,
}: EditingLineComponentProps): JSX.Element {
  const [connectLineTo, setConnectLineTo] = useState<PositionTuple | null>(
    null
  );
  const {
    activeEditableEdge,
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
    if (!activeEditableEdge || !lineEditorState) {
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
        // console.log(cells.filter(isEdgeCell));

        // Snap to other points
        const { control } = lineEditorState;
        const linePoints = editableLineMap.get(activeEditableEdge)!.points;
        const axis = control.direction === "ns" ? "y" : "x";
        const original = control[axis];
        const otherPoints = linePoints.filter(
          (_, i) =>
            i === 0 ||
            i === linePoints.length - 1 ||
            (i !== control.index && i !== control.index + 1)
        );
        const snapDistance = 5;

        // Snap to control points of other lines
        for (const cell of cells) {
          if (cell.type !== "edge" || cell === activeEditableEdge) {
            continue;
          }
          const editableLine = editableLineMap.get(cell);
          if (editableLine) {
            otherPoints.push(...editableLine.points.slice(1, -1));
          }
        }

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
          const { source, target } = editableLineMap.get(activeEditableEdge!)!;
          const { view } = activeEditableEdge!;
          onChangeEdgeView?.(source, target, {
            ...view,
            vertices: getNewLineVertices(
              activeEditableEdge!,
              lineEditorState,
              editableLineMap,
              newConnectTo
            ),
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
  }, [
    activeEditableEdge,
    editableLineMap,
    lineEditorState,
    transform,
    setLineEditorState,
    onChangeEdgeView,
    cells,
  ]);

  useEffect(() => {
    if (!activeEditableEdge) {
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
  }, [activeEditableEdge]);

  const line = useMemo(() => {
    const points = getEditingLinePoints(
      activeEditableEdge,
      lineEditorState,
      editableLineMap,
      connectLineTo,
      hoverState
    );
    return curveLine(
      points,
      activeEditableEdge?.view?.type === "curve"
        ? activeEditableEdge.view.curveType
        : "curveLinear",
      0,
      1
    );
  }, [
    connectLineTo,
    hoverState,
    activeEditableEdge,
    lineEditorState,
    editableLineMap,
  ]);
  let markerStart: string | undefined;
  let markerEnd: string | undefined;
  const lineMarkers: LineMarkerConf[] = getMarkers(options);
  for (const marker of lineMarkers) {
    if (marker.placement === "start") {
      markerStart = options.$editingStartMarkerUrl;
    } else {
      markerEnd = options.$editingEndMarkerUrl;
    }
  }

  return (
    <path
      className={classNames("editing-line", {
        editing: !!(lineEditorState && connectLineTo),
      })}
      d={line}
      fill="none"
      stroke={options.editingStrokeColor}
      markerStart={markerStart}
      markerEnd={markerEnd}
    />
  );
}
