import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { uniqueId } from "lodash";
import ResizeObserver from "resize-observer-polyfill";
import type {
  ActiveTarget,
  ComputedEdgeLineConf,
  Direction,
  EdgeCell,
  EditableLine,
  PositionAndAngle,
} from "./interfaces";
import { DEFAULT_LINE_INTERACT_ANIMATE_DURATION } from "./constants";
import { curveLine } from "../diagram/lines/curveLine";
import { getMarkers } from "../shared/canvas/useLineMarkers";
import type {
  LineMarkerConf,
  NodePosition,
  PositionTuple,
  SizeTuple,
} from "../diagram/interfaces";
import { cellToTarget } from "./processors/cellToTarget";
import { getLabelMaskAndOffset } from "./processors/getLabelMaskAndOffset";

export interface EdgeComponentProps {
  edge: EdgeCell;
  lineConfMap: WeakMap<EdgeCell, ComputedEdgeLineConf>;
  editableLineMap: WeakMap<EdgeCell, EditableLine>;
  readOnly?: boolean;
  setLineLabelMap: React.Dispatch<React.SetStateAction<LineLabelMap>>;
  onSwitchActiveTarget?(activeTarget: ActiveTarget | null): void;
}

export type LineLabelMap = Map<EdgeCell, {
  position: PositionAndAngle;
  offset: PositionTuple;
}>;

export function EdgeComponent({
  edge,
  lineConfMap,
  editableLineMap,
  readOnly,
  setLineLabelMap,
  onSwitchActiveTarget,
}: EdgeComponentProps): JSX.Element | null {
  const pathRef = useRef<SVGPathElement | null>(null);
  const lineConf = lineConfMap.get(edge)!;
  const { points: linePoints } = editableLineMap.get(edge) ?? {};

  const line = useMemo(() => {
    return curveLine(
      linePoints,
      lineConf.type === "curve" ? lineConf.curveType : "curveLinear",
      0,
      1
    );
  }, [lineConf, linePoints]);

  const lineMaskPrefix = useMemo(() => uniqueId("line-mask-"), []);

  const [labelPosition, setLabelPosition] = useState<PositionAndAngle | null>(
    null
  );
  const [labelSize, setLabelSize] = useState<SizeTuple | null>(null);
  const [lineRect, setLineRect] = useState<Pick<
    SVGRect,
    "x" | "y" | "width" | "height"
  > | null>(null);

  const updateLabelPosition = useCallback(() => {
    const path = pathRef.current;
    const { label, text } = lineConf;
    // istanbul ignore next
    if (path && linePoints && (label || text)) {
      if (process.env.NODE_ENV === "test") {
        setLabelPosition([30, 40, "center", 0, 0]);
        setLineRect({ x: 10, y: 20, width: 300, height: 400 });
        return;
      }
      const placement = (label ? label.placement : text.placement) ?? "center";
      const pathLength = path.getTotalLength();
      const halfPathLength = pathLength / 2;
      const pathPoint = path.getPointAtLength(
        placement === "start"
          ? Math.min(0, halfPathLength)
          : placement === "end"
            ? Math.max(pathLength - 0, halfPathLength)
            : halfPathLength
      );

      let direction: Direction | "center" = "center";
      let angle = 0;
      if (placement === "start" || placement === "end") {
        let p0: NodePosition;
        let p1: NodePosition;
        if (placement === "start") {
          p0 = linePoints[0];
          p1 = linePoints[1];
        } else {
          p0 = linePoints[linePoints.length - 1];
          p1 = linePoints[linePoints.length - 2];
        }
        angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        direction =
          Math.abs(p0.x - p1.x) > Math.abs(p0.y - p1.y)
            ? p0.x > p1.x
              ? "left"
              : "right"
            : p0.y > p1.y
              ? "top"
              : "bottom";
      }

      const offset = (label ? label.offset : text.offset) ?? 0;
      setLabelPosition([pathPoint.x, pathPoint.y, direction, angle, offset]);
      const rect = path.getBBox();
      setLineRect({
        x: rect.x - 1000,
        y: rect.y - 1000,
        width: rect.width + 2000,
        height: rect.height + 2000,
      });
    }
  }, [lineConf, linePoints]);

  const pathRefCallback = useCallback(
    (element: SVGPathElement | null) => {
      pathRef.current = element;
      // istanbul ignore next
      if (element?.getTotalLength) {
        element.style.setProperty(
          "--solid-length",
          `${element.getTotalLength()}`
        );
      }
      updateLabelPosition();
    },
    [updateLabelPosition]
  );

  const [labelElement, setLabelElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!labelElement) {
      setLabelSize(null);
      return;
    }
    const observerCallback = () => {
      const { offsetWidth, offsetHeight } = labelElement;
      // Do not mask out when the label takes no space.
      // istanbul ignore next
      if (
        process.env.NODE_ENV !== "test" &&
        (offsetWidth === 0 || offsetHeight === 0)
      ) {
        setLabelSize(null);
        return;
      }
      setLabelSize([offsetWidth, offsetHeight]);
    };
    const resizeObserver = new ResizeObserver(observerCallback);
    resizeObserver.observe(labelElement);

    // `ResizeObserver` will not call the callback in test environment.
    // istanbul ignore next
    if (process.env.NODE_ENV === "test") {
      observerCallback();
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [labelElement]);

  const handleLabelRendered = useCallback((element: HTMLElement | null) => {
    setLabelElement(element);
  }, []);

  useEffect(
    () => {
      updateLabelPosition();
    },
    // Update label position when line points changed
    [updateLabelPosition, linePoints]
  );

  const onLabelClick = useCallback(() => {
    onSwitchActiveTarget?.(cellToTarget(edge));
  }, [edge, onSwitchActiveTarget]);

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (readOnly || !lineConf.callLabelOnDoubleClick) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      (
        labelElement?.firstElementChild as unknown as Record<string, () => void>
      )?.[lineConf.callLabelOnDoubleClick]?.();
    },
    [labelElement, lineConf, readOnly]
  );

  const [mask, labelOffset] = useMemo(
    () => getLabelMaskAndOffset(labelPosition, labelSize),
    [labelPosition, labelSize]
  );

  useEffect(() => {
    if (labelPosition && labelOffset) {
      setLineLabelMap((prev) => {
        const next = new Map(prev);
        next.set(edge, { position: labelPosition, offset: labelOffset });
        return next;
      });
    }

    return () => {
      setLineLabelMap((prev) => {
        if (prev.has(edge)) {
          const next = new Map(prev);
          next.delete(edge);
          return next;
        }
        return prev;
      })
    };
  }, [edge, labelOffset, labelPosition, setLineLabelMap]);

  if (!line || !linePoints) {
    // This happens when source or target is not found,
    // or when source or target has not been positioned yet.
    return null;
  }

  let markerStart: string | undefined;
  let markerEnd: string | undefined;
  const lineMarkers: LineMarkerConf[] = getMarkers(lineConf);
  for (const marker of lineMarkers) {
    if (marker.placement === "start") {
      markerStart = lineConf.$markerStartUrl;
    } else {
      markerEnd = lineConf.$markerEndUrl;
    }
  }

  const maskUrl = mask ? `url(#${lineMaskPrefix})` : undefined;

  return (
    <>
      {mask && lineRect && (
        <defs>
          <mask
            id={lineMaskPrefix}
            maskUnits="userSpaceOnUse"
            x={lineRect.x}
            y={lineRect.y}
            width={lineRect.width}
            height={lineRect.height}
          >
            <rect
              x={lineRect.x}
              y={lineRect.y}
              width={lineRect.width}
              height={lineRect.height}
              // Everything under a white pixel will be visible
              fill="white"
            />
            <rect
              x={mask.left}
              y={mask.top}
              width={mask.width}
              height={mask.height}
              // Everything under a black pixel will be invisible
              fill="black"
            />
          </mask>
        </defs>
      )}
      <g className="line-group" onDoubleClick={onDoubleClick}>
        <path
          // This `path` is made for expanding interaction area of graph lines.
          d={line}
          fill="none"
          stroke="transparent"
          strokeWidth={lineConf.interactStrokeWidth}
          mask={maskUrl}
        />
        <path
          ref={pathRefCallback}
          className={classNames("line", {
            dashed: lineConf.dashed,
            dotted: lineConf.dotted,
            [`${lineConf.dashed ? "dashed" : lineConf.dotted ? "dotted" : "solid"}-animation`]:
              lineConf.animate.useAnimate,
          })}
          mask={maskUrl}
          style={
            {
              "--time": `${lineConf.animate.duration ?? DEFAULT_LINE_INTERACT_ANIMATE_DURATION}s`,
            } as React.CSSProperties
          }
          d={line}
          fill="none"
          stroke={lineConf.strokeColor}
          strokeWidth={lineConf.strokeWidth}
          markerStart={markerStart}
          markerEnd={markerEnd}
        />
        <path className="line-active-bg" d={line} fill="none" mask={maskUrl} />
      </g>
      {/* <LineLabelComponent
        edge={edge}
        position={labelPosition}
        offset={labelOffset}
        label={lineConf.label}
        text={lineConf.text}
        onClick={onLabelClick}
        onRendered={handleLabelRendered}
      /> */}
    </>
  );
}
