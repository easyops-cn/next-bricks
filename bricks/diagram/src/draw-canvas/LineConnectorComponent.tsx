// istanbul ignore file: experimental
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useHoverStateContext } from "./HoverStateContext";
import type { ActiveTarget, NodeCell } from "./interfaces";
import { targetIsActive } from "./processors/targetIsActive";
import type { NodePosition, TransformLiteral } from "../diagram/interfaces";
import { DEFAULT_NODE_PADDING_FOR_SMART_LINES } from "./constants";

const HELPER_IMAGE =
  "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1cHgiIGhlaWdodD0iNXB4IiB2ZXJzaW9uPSIxLjEiPjxwYXRoIGQ9Im0gMCAwIEwgNSA1IE0gMCA1IEwgNSAwIiBzdHJva2Utd2lkdGg9IjIiIHN0eWxlPSJzdHJva2Utb3BhY2l0eTowLjQiIHN0cm9rZT0iI2ZmZmZmZiIvPjxwYXRoIGQ9Im0gMCAwIEwgNSA1IE0gMCA1IEwgNSAwIiBzdHJva2U9IiMyOWI2ZjIiLz48L3N2Zz4=";
const HELPER_RADIUS = 5;
const HELPER_BG_RADIUS = 8;
const HALF_HELPER_RADIUS = HELPER_RADIUS / 2;

export interface LineConnectorComponentProps {
  activeTarget: ActiveTarget | null;
  transform: TransformLiteral;
  disabled?: boolean;
}

export function LineConnectorComponent({
  activeTarget,
  transform,
  disabled,
}: LineConnectorComponentProps): JSX.Element | null {
  const {
    unsetHoverStateTimeoutRef,
    hoverState,
    setHoverState,
    smartConnectLineState,
    lineEditorState,
  } = useHoverStateContext();

  const unsetTimeout = useCallback(() => {
    if (unsetHoverStateTimeoutRef.current !== null) {
      clearTimeout(unsetHoverStateTimeoutRef.current);
      unsetHoverStateTimeoutRef.current = null;
    }
  }, [unsetHoverStateTimeoutRef]);

  const unsetActivePointIndex = useCallback(() => {
    unsetTimeout();
    setHoverState((prev) =>
      prev?.activePointIndex === undefined
        ? prev
        : { ...hoverState!, activePointIndex: undefined }
    );
  }, [hoverState, setHoverState, unsetTimeout]);

  const unsetHoverState = useCallback(() => {
    unsetHoverStateTimeoutRef.current = setTimeout(() => {
      setHoverState(null);
    }) as unknown as number;
  }, [setHoverState, unsetHoverStateTimeoutRef]);

  const available =
    !disabled &&
    hoverState &&
    (!!smartConnectLineState ||
      (lineEditorState
        ? lineEditorState.type === "entry"
          ? hoverState.cell === lineEditorState.target
          : hoverState.cell === lineEditorState.source
        : !targetIsActive(hoverState.cell, activeTarget) &&
          !hasActiveEdge(activeTarget)));

  const transformedPoints = useMemo(
    () =>
      available
        ? hoverState.points.map((p) => ({
            x: p.x * transform.k + transform.x,
            y: p.y * transform.k + transform.y,
          }))
        : null,
    [available, hoverState?.points, transform]
  );

  const padding = DEFAULT_NODE_PADDING_FOR_SMART_LINES;
  const halfPadding = padding / 2;

  return (
    <g onMouseEnter={unsetActivePointIndex} onMouseLeave={unsetHoverState}>
      {available && (
        <>
          <g
            transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}
          >
            <rect
              x={hoverState.cell.view.x - halfPadding}
              y={hoverState.cell.view.y - halfPadding}
              width={hoverState.cell.view.width + padding}
              height={hoverState.cell.view.height + padding}
              fill="none"
              stroke="transparent"
              strokeWidth={(HELPER_BG_RADIUS * 2) / transform.k}
              pointerEvents="stroke"
            />
          </g>
          {hoverState?.activePointIndex !== undefined && (
            <circle
              cx={transformedPoints![hoverState.activePointIndex].x}
              cy={transformedPoints![hoverState.activePointIndex].y}
              r={HELPER_BG_RADIUS}
              fill="lightgreen"
              fillOpacity={0.5}
              pointerEvents="none"
            />
          )}
          {transformedPoints!.map((point, index) => (
            <ConnectPointComponent
              key={index}
              index={index}
              point={point}
              unsetActivePointIndex={unsetActivePointIndex}
              unsetTimeout={unsetTimeout}
            />
          ))}
        </>
      )}
    </g>
  );
}

interface ConnectPointComponentProps {
  index: number;
  point: NodePosition;
  unsetTimeout: () => void;
  unsetActivePointIndex: () => void;
}

function ConnectPointComponent({
  index,
  point,
  unsetTimeout,
  unsetActivePointIndex,
}: ConnectPointComponentProps): JSX.Element {
  const {
    rootRef,
    smartConnectLineState,
    hoverState,
    setHoverState,
    setSmartConnectLineState,
    onConnect,
    lineEditorState,
    setLineEditorState,
    onChangeEdgeEndpoints,
  } = useHoverStateContext();
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = ref.current;
    const handleMouseEnter = (e: MouseEvent) => {
      // There is a chance that mouseenter will not be triggered when the element is shown aync.
      // So we also listen to the mousemove event, but only once.
      if (e.type === "mousemove") {
        g?.removeEventListener(e.type, handleMouseEnter);
      }
      unsetTimeout();
      setHoverState((prev) =>
        prev && prev.activePointIndex !== index
          ? { ...hoverState!, activePointIndex: index }
          : prev
      );
    };
    g?.addEventListener("mouseenter", handleMouseEnter);
    g?.addEventListener("mousemove", handleMouseEnter);
    return () => {
      g?.removeEventListener("mouseenter", handleMouseEnter);
      g?.removeEventListener("mousemove", handleMouseEnter);
    };
  }, [hoverState, index, setHoverState, unsetTimeout]);

  useEffect(() => {
    if (lineEditorState) {
      return;
    }
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = rootRef.current!.getBoundingClientRect();
      const originalPoint = hoverState!.points[index];
      // console.log("connect", originalPoint, rect);
      setSmartConnectLineState({
        source: hoverState!.cell as NodeCell,
        from: [originalPoint.x, originalPoint.y],
        offset: [rect.left, rect.top],
        exitPosition: hoverState!.relativePoints[index],
      });
    };
    const g = ref.current;
    g?.addEventListener("mousedown", handleMouseDown);
    return () => {
      g?.removeEventListener("mousedown", handleMouseDown);
    };
  }, [hoverState, index, lineEditorState, rootRef, setSmartConnectLineState]);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (smartConnectLineState) {
        if (smartConnectLineState.source !== hoverState?.cell) {
          onConnect?.(
            smartConnectLineState.source,
            hoverState!.cell,
            smartConnectLineState.exitPosition,
            hoverState!.relativePoints[hoverState!.activePointIndex!]
          );
        }
        setSmartConnectLineState(null);
      } else if (lineEditorState) {
        const position =
          hoverState!.relativePoints[hoverState!.activePointIndex!];
        if (lineEditorState.type === "entry") {
          onChangeEdgeEndpoints?.(
            lineEditorState.source,
            lineEditorState.target,
            lineEditorState.exitPosition,
            position
          );
        } else {
          onChangeEdgeEndpoints?.(
            lineEditorState.source,
            lineEditorState.target,
            position,
            lineEditorState.entryPosition
          );
        }
        setLineEditorState(null);
      }
    };
    const g = ref.current;
    g?.addEventListener("mouseup", handleMouseUp);
    return () => {
      g?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    smartConnectLineState,
    hoverState,
    onConnect,
    setSmartConnectLineState,
    lineEditorState,
    onChangeEdgeEndpoints,
    setLineEditorState,
  ]);

  return (
    <g ref={ref} onMouseLeave={unsetActivePointIndex}>
      <circle
        cx={point.x}
        cy={point.y}
        r={HELPER_BG_RADIUS}
        fill="transparent"
      />
      <image
        x={point.x - HALF_HELPER_RADIUS}
        y={point.y - HALF_HELPER_RADIUS}
        width={HELPER_RADIUS}
        height={HELPER_RADIUS}
        xlinkHref={HELPER_IMAGE}
        preserveAspectRatio="none"
      />
    </g>
  );
}

function hasActiveEdge(activeTarget: ActiveTarget | null) {
  return (
    activeTarget &&
    (activeTarget.type === "edge" ||
      (activeTarget.type === "multi" &&
        activeTarget.targets.some((target) => target.type === "edge")))
  );
}
