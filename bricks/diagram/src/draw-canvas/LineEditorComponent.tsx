// istanbul ignore file: experimental
import React, { useEffect, useRef } from "react";
import type { TransformLiteral } from "../diagram/interfaces";
import { useHoverStateContext } from "./HoverStateContext";

const POINT_HELPER_IMAGE =
  "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMnB4IiBoZWlnaHQ9IjIycHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iNyIgc3Ryb2tlPSIjZmZmIiBmaWxsPSIjMDFiZDIyIi8+PHBhdGggZD0ibSA4IDggTCAxNCAxNE0gOCAxNCBMIDE0IDgiIHN0cm9rZT0iI2ZmZiIvPjwvc3ZnPg==";
const POINT_HELPER_BG_SIZE = 22;

export interface LineEditorComponentProps {
  transform: TransformLiteral;
}

export function LineEditorComponent({
  transform,
}: LineEditorComponentProps): JSX.Element | null {
  const { rootRef, activeEditableLine, setLineEditorState } =
    useHoverStateContext();
  const exitRef = useRef<SVGImageElement>(null);
  const entryRef = useRef<SVGImageElement>(null);

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

  if (!activeEditableLine) {
    return null;
  }

  const commonProps: React.SVGAttributes<SVGImageElement> = {
    width: POINT_HELPER_BG_SIZE / transform.k,
    height: POINT_HELPER_BG_SIZE / transform.k,
    xlinkHref: POINT_HELPER_IMAGE,
    preserveAspectRatio: "none",
    style: { cursor: "pointer" },
    pointerEvents: "fill",
  };
  const exitPoint = activeEditableLine.endPoints[0];
  const entryPoint = activeEditableLine.endPoints[1];
  const offset = POINT_HELPER_BG_SIZE / transform.k / 2;

  return (
    <>
      <image
        ref={exitRef}
        {...commonProps}
        x={exitPoint.x - offset}
        y={exitPoint.y - offset}
      />
      <image
        ref={entryRef}
        {...commonProps}
        x={entryPoint.x - offset}
        y={entryPoint.y - offset}
      />
    </>
  );
}
