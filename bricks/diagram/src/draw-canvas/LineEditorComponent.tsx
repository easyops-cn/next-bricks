// istanbul ignore file: experimental
import React, { useEffect, useMemo, useRef } from "react";
import type { NodePosition } from "../diagram/interfaces";
import { useHoverStateContext } from "./HoverStateContext";
import type { ControlPoint } from "./interfaces";
import { isStraightType } from "./processors/asserts";

const POINT_HELPER_IMAGE =
  "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMnB4IiBoZWlnaHQ9IjIycHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iNyIgc3Ryb2tlPSIjZmZmIiBmaWxsPSIjMjliNmYyIi8+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iMyIgc3Ryb2tlPSIjZmZmIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjwvc3ZnPg==";
const ANCHORED_POINT_HELPER_IMAGE =
  "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMnB4IiBoZWlnaHQ9IjIycHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iNyIgc3Ryb2tlPSIjZmZmIiBmaWxsPSIjMDFiZDIyIi8+PHBhdGggZD0ibSA4IDggTCAxNCAxNE0gOCAxNCBMIDE0IDgiIHN0cm9rZT0iI2ZmZiIvPjwvc3ZnPg==";
const VERTEX_HELPER_IMAGE =
  "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIvPjwvc3ZnPg==";
const POINT_HELPER_BG_SIZE = 22;

export interface LineEditorComponentProps {
  scale: number;
}

export function LineEditorComponent({
  scale,
}: LineEditorComponentProps): JSX.Element | null {
  const {
    rootRef,
    activeEditableLine,
    activeEditableLineIsAvailable,
    setLineEditorState,
  } = useHoverStateContext();
  const exitRef = useRef<SVGImageElement>(null);
  const entryRef = useRef<SVGImageElement>(null);
  const controlPointsRef = useRef<(SVGImageElement | null)[]>([]);

  useEffect(() => {
    const exit = exitRef.current;
    const entry = entryRef.current;
    if (!exit || !entry || !activeEditableLine) {
      return;
    }
    const handleMouseDownFactory = (type: "exit" | "entry") => {
      return (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = rootRef.current!.getBoundingClientRect();
        setLineEditorState({
          ...activeEditableLine,
          offset: [rect.left, rect.top],
          from: [e.clientX, e.clientY],
          type,
        });
      };
    };
    const handleStartMouseDown = handleMouseDownFactory("exit");
    const handleEndMouseDown = handleMouseDownFactory("entry");
    exit.addEventListener("mousedown", handleStartMouseDown);
    entry.addEventListener("mousedown", handleEndMouseDown);
    return () => {
      exit.removeEventListener("mousedown", handleStartMouseDown);
      entry.removeEventListener("mousedown", handleEndMouseDown);
    };
  }, [activeEditableLine, rootRef, setLineEditorState]);

  const controlPoints = useMemo(() => {
    return activeEditableLine &&
      !isStraightType(activeEditableLine.edge.view?.type)
      ? getControlPoints(activeEditableLine!.linePoints)
      : [];
  }, [activeEditableLine]);

  useEffect(() => {
    if (!activeEditableLine) {
      return;
    }
    const controlElements = controlPointsRef.current;
    const handleMouseDownFactory = (control: ControlPoint) => {
      return (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = rootRef.current!.getBoundingClientRect();
        setLineEditorState({
          ...activeEditableLine!,
          offset: [rect.left, rect.top],
          from: [e.clientX, e.clientY],
          type: "control",
          control,
        });
      };
    };
    const handlers = controlPoints.map((control) =>
      handleMouseDownFactory(control)
    );
    controlElements.forEach((el, i) => {
      el?.addEventListener("mousedown", handlers[i]);
    });
    return () => {
      controlElements.forEach((el, i) => {
        el?.removeEventListener("mousedown", handlers[i]);
      });
    };
  }, [activeEditableLine, controlPoints, rootRef, setLineEditorState]);

  const gRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const g = gRef.current;
    const onClick = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };
    g?.addEventListener("click", onClick);
    return () => {
      g?.removeEventListener("click", onClick);
    };
  }, []);

  if (!activeEditableLine || !activeEditableLineIsAvailable) {
    return null;
  }
  const {
    linePoints,
    edge: { view },
  } = activeEditableLine;
  const { exitPosition, entryPosition } = view ?? {};

  const commonProps: React.SVGAttributes<SVGImageElement> = {
    width: POINT_HELPER_BG_SIZE / scale,
    height: POINT_HELPER_BG_SIZE / scale,
    preserveAspectRatio: "none",
    cursor: "pointer",
    pointerEvents: "fill",
  };
  const exitPoint = linePoints[0];
  const entryPoint = linePoints[linePoints.length - 1];
  const offset = POINT_HELPER_BG_SIZE / scale / 2;

  return (
    <g ref={gRef}>
      <image
        ref={exitRef}
        {...commonProps}
        x={exitPoint.x - offset}
        y={exitPoint.y - offset}
        xlinkHref={
          exitPosition ? ANCHORED_POINT_HELPER_IMAGE : POINT_HELPER_IMAGE
        }
      />
      {controlPoints.map((point, i) => (
        <image
          key={i}
          ref={(el) => {
            controlPointsRef.current[i] = el;
          }}
          {...commonProps}
          x={point.x - offset}
          y={point.y - offset}
          xlinkHref={VERTEX_HELPER_IMAGE}
          cursor={point.direction === "ns" ? "row-resize" : "col-resize"}
        />
      ))}
      <image
        ref={entryRef}
        {...commonProps}
        x={entryPoint.x - offset}
        y={entryPoint.y - offset}
        xlinkHref={
          entryPosition ? ANCHORED_POINT_HELPER_IMAGE : POINT_HELPER_IMAGE
        }
      />
    </g>
  );
}

function getControlPoints(linePoints: NodePosition[]): ControlPoint[] {
  const controlPoints: ControlPoint[] = [];
  let prev = linePoints[0];
  let cursor = 1;
  while (cursor < linePoints.length) {
    const next = linePoints[cursor];
    const ns = prev.y === next.y;
    const ew = prev.x === next.x;
    if (!(ns && ew)) {
      const direction = ns ? "ns" : "ew";
      controlPoints.push({
        direction,
        index: cursor - 1,
        x: (prev.x + next.x) / 2,
        y: (prev.y + next.y) / 2,
      });
    }
    prev = next;
    cursor++;
  }

  return controlPoints;
}
