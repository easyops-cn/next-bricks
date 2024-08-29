// istanbul ignore file: experimental
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useHoverStateContext } from "./HoverStateContext";
import type { ActiveTarget, ConnectLineState, NodeCell } from "./interfaces";
import { targetIsActive } from "./processors/targetIsActive";
import type { NodePosition, TransformLiteral } from "../diagram/interfaces";

const HELPER_IMAGE =
  "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1cHgiIGhlaWdodD0iNXB4IiB2ZXJzaW9uPSIxLjEiPjxwYXRoIGQ9Im0gMCAwIEwgNSA1IE0gMCA1IEwgNSAwIiBzdHJva2Utd2lkdGg9IjIiIHN0eWxlPSJzdHJva2Utb3BhY2l0eTowLjQiIHN0cm9rZT0iI2ZmZmZmZiIvPjxwYXRoIGQ9Im0gMCAwIEwgNSA1IE0gMCA1IEwgNSAwIiBzdHJva2U9IiMyOWI2ZjIiLz48L3N2Zz4=";
const HELPER_RADIUS = 5;
const HELPER_BG_RADIUS = 8;

export interface LineConnectorComponentProps {
  activeTarget: ActiveTarget | null;
  transform: TransformLiteral;
  smartConnectLineState: ConnectLineState | null;
}

export function LineConnectorComponent({
  activeTarget,
  transform,
  smartConnectLineState,
}: LineConnectorComponentProps): JSX.Element | null {
  const { unsetHoverStateTimeoutRef, hoverState, setHoverState } =
    useHoverStateContext();

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
    hoverState &&
    (!!smartConnectLineState || !targetIsActive(hoverState.cell, activeTarget));

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

  return (
    <g onMouseEnter={unsetActivePointIndex} onMouseLeave={unsetHoverState}>
      {available && (
        <>
          <rect
            x={hoverState.cell.view.x}
            y={hoverState.cell.view.y}
            width={hoverState.cell.view.width}
            height={hoverState.cell.view.height}
            fill="none"
            stroke="transparent"
            strokeWidth={HELPER_BG_RADIUS * 2}
            pointerEvents="stroke"
          />
          <rect
            x={hoverState.cell.view.x}
            y={hoverState.cell.view.y}
            width={hoverState.cell.view.width}
            height={hoverState.cell.view.height}
            fill="none"
            stroke="transparent"
          />
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
              unsetTimeout={unsetTimeout}
              unsetActivePointIndex={unsetActivePointIndex}
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
  } = useHoverStateContext();
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const handleMouseEnter = () => {
      unsetTimeout();
      setHoverState({ ...hoverState!, activePointIndex: index });
    };
    const g = ref.current;
    g?.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      g?.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [hoverState, index, setHoverState, unsetTimeout]);

  useEffect(() => {
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
  }, [hoverState, index, rootRef, setSmartConnectLineState]);

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
      }
    };
    const g = ref.current;
    g?.addEventListener("mouseup", handleMouseUp);
    return () => {
      g?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [smartConnectLineState, hoverState, onConnect, setSmartConnectLineState]);

  useEffect(() => {
    const g = ref.current;
    g?.addEventListener("mouseleave", unsetActivePointIndex);
    return () => {
      g?.removeEventListener("mouseleave", unsetActivePointIndex);
    };
  }, [unsetActivePointIndex]);

  return (
    <g ref={ref}>
      <circle
        cx={point.x}
        cy={point.y}
        r={HELPER_BG_RADIUS}
        fill="transparent"
      />
      <image
        x={point.x - HELPER_RADIUS / 2}
        y={point.y - HELPER_RADIUS / 2}
        width={HELPER_RADIUS}
        height={HELPER_RADIUS}
        xlinkHref={HELPER_IMAGE}
        preserveAspectRatio="none"
      />
    </g>
  );
}
