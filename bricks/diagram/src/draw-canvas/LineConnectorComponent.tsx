// istanbul ignore file: experimental
import React, { useCallback, useEffect, useRef, type JSX } from "react";
import { useHoverStateContext } from "./HoverStateContext";
import type {
  ActiveTarget,
  Cell,
  EdgeCell,
  EditableLine,
  NodeCell,
} from "./interfaces";
import { targetIsActive } from "./processors/targetIsActive";
import type { NodePosition } from "../diagram/interfaces";
import { DEFAULT_NODE_PADDING_FOR_SMART_LINES } from "./constants";

const HELPER_IMAGE =
  "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1cHgiIGhlaWdodD0iNXB4IiB2ZXJzaW9uPSIxLjEiPjxwYXRoIGQ9Im0gMCAwIEwgNSA1IE0gMCA1IEwgNSAwIiBzdHJva2Utd2lkdGg9IjIiIHN0eWxlPSJzdHJva2Utb3BhY2l0eTowLjQiIHN0cm9rZT0iI2ZmZmZmZiIvPjxwYXRoIGQ9Im0gMCAwIEwgNSA1IE0gMCA1IEwgNSAwIiBzdHJva2U9IiMyOWI2ZjIiLz48L3N2Zz4=";
const HELPER_RADIUS = 5;
const HELPER_BG_RADIUS = 8;
const HALF_HELPER_RADIUS = HELPER_RADIUS / 2;

export interface LineConnectorComponentProps {
  activeTarget: ActiveTarget | null;
  editableLineMap: WeakMap<EdgeCell, EditableLine>;
  scale: number;
  disabled?: boolean;
}

export function LineConnectorComponent({
  activeTarget,
  editableLineMap,
  scale,
  disabled,
}: LineConnectorComponentProps): JSX.Element | null {
  const {
    unsetHoverStateTimeoutRef,
    hoverState,
    setHoverState,
    smartConnectLineState,
    activeEditableEdge,
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

  let source: Cell | undefined;
  let target: Cell | undefined;

  const available =
    !disabled &&
    hoverState &&
    (!!smartConnectLineState ||
      (activeEditableEdge &&
      lineEditorState &&
      (({ source, target } = editableLineMap.get(activeEditableEdge)!), true)
        ? lineEditorState.type === "entry"
          ? hoverState.cell === target
          : lineEditorState.type === "exit" && hoverState.cell === source
        : !targetIsActive(hoverState.cell, activeTarget) &&
          !hasActiveEdge(activeTarget)));

  const padding = DEFAULT_NODE_PADDING_FOR_SMART_LINES;
  const halfPadding = padding / 2;

  return (
    <g onMouseEnter={unsetActivePointIndex} onMouseLeave={unsetHoverState}>
      {available && (
        <>
          <rect
            x={hoverState.cell.view.x - halfPadding}
            y={hoverState.cell.view.y - halfPadding}
            width={hoverState.cell.view.width + padding}
            height={hoverState.cell.view.height + padding}
            fill="none"
            stroke="transparent"
            strokeWidth={(HELPER_BG_RADIUS * 2) / scale}
            pointerEvents="stroke"
          />
          {hoverState.activePointIndex !== undefined && (
            <circle
              cx={hoverState.points[hoverState.activePointIndex].x}
              cy={hoverState.points[hoverState.activePointIndex].y}
              r={HELPER_BG_RADIUS / scale}
              fill="lightgreen"
              fillOpacity={0.5}
              pointerEvents="none"
            />
          )}
          {hoverState.points.map((point, index) => (
            <ConnectPointComponent
              key={index}
              editableLineMap={editableLineMap}
              index={index}
              point={point}
              scale={scale}
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
  editableLineMap: WeakMap<EdgeCell, EditableLine>;
  index: number;
  point: NodePosition;
  scale: number;
  unsetTimeout: () => void;
  unsetActivePointIndex: () => void;
}

function ConnectPointComponent({
  editableLineMap,
  index,
  point,
  scale,
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
    activeEditableEdge,
    lineEditorState,
    setLineEditorState,
    onChangeEdgeView,
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
      } else if (activeEditableEdge && lineEditorState) {
        const position =
          hoverState!.relativePoints[hoverState!.activePointIndex!];
        const { type } = lineEditorState;
        const { source, target } = editableLineMap.get(activeEditableEdge!)!;
        const { view } = activeEditableEdge!;
        if (type === "entry") {
          onChangeEdgeView?.(source, target, {
            ...view,
            entryPosition: position,
          });
        } else {
          onChangeEdgeView?.(source, target, {
            ...view,
            exitPosition: position,
          });
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
    activeEditableEdge,
    lineEditorState,
    editableLineMap,
    onChangeEdgeView,
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
        x={point.x - HALF_HELPER_RADIUS / scale}
        y={point.y - HALF_HELPER_RADIUS / scale}
        width={HELPER_RADIUS / scale}
        height={HELPER_RADIUS / scale}
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
