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
  EdgeCell,
  EditableLine,
} from "./interfaces";
import { DEFAULT_LINE_INTERACT_ANIMATE_DURATION } from "./constants";
import { curveLine } from "../diagram/lines/curveLine";
import { getMarkers } from "../shared/canvas/useLineMarkers";
import type {
  LineMarkerConf,
  PositionTuple,
  SimpleRect,
  SizeTuple,
} from "../diagram/interfaces";
import { LineLabelComponent } from "./LineLabelComponent";
import { cellToTarget } from "./processors/cellToTarget";

export interface EdgeComponentProps {
  edge: EdgeCell;
  lineConfMap: WeakMap<EdgeCell, ComputedEdgeLineConf>;
  editableLineMap: WeakMap<EdgeCell, EditableLine>;
  readOnly?: boolean;
  onSwitchActiveTarget?(activeTarget: ActiveTarget | null): void;
}

export function EdgeComponent({
  edge,
  lineConfMap,
  editableLineMap,
  readOnly,
  onSwitchActiveTarget,
}: EdgeComponentProps): JSX.Element | null {
  const pathRef = useRef<SVGPathElement | null>(null);
  const lineConf = lineConfMap.get(edge)!;
  const { points: linePoints } = editableLineMap.get(edge) ?? {};

  const line = useMemo(() => {
    const fixedLineType = lineConf.type;
    return curveLine(
      linePoints,
      fixedLineType === "curve" ? lineConf.curveType : "curveLinear",
      0,
      1
    );
  }, [lineConf, linePoints]);

  const lineMaskPrefix = useMemo(() => uniqueId("line-mask-"), []);

  const [labelPosition, setLabelPosition] = useState<PositionTuple | null>(
    null
  );
  const [labelSize, setLabelSize] = useState<SizeTuple | null>(null);
  const [lineRect, setLineRect] = useState<Pick<
    SVGRect,
    "x" | "y" | "width" | "height"
  > | null>(null);

  const updateLabelPosition = useCallback(() => {
    const path = pathRef.current;
    // istanbul ignore next
    if (path && (lineConf.label || lineConf.text)) {
      if (process.env.NODE_ENV === "test") {
        setLabelPosition([30, 40]);
        setLineRect({ x: 10, y: 20, width: 300, height: 400 });
        return;
      }
      const pathLength = path.getTotalLength();
      const pathPoint = path.getPointAtLength(pathLength / 2);
      setLabelPosition([pathPoint.x, pathPoint.y]);
      const rect = path.getBBox();
      setLineRect({
        x: rect.x - 1000,
        y: rect.y - 1000,
        width: rect.width + 2000,
        height: rect.height + 2000,
      });
    }
  }, [lineConf]);

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

  const mask = useMemo<SimpleRect | null>(() => {
    if (!labelPosition || !labelSize) {
      return null;
    }
    const padding = 3;
    return {
      left: labelPosition[0] - labelSize[0] / 2 - padding,
      top: labelPosition[1] - labelSize[1] / 2 - padding,
      width: labelSize[0] + padding * 2,
      height: labelSize[1] + padding * 2,
    };
  }, [labelPosition, labelSize]);

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
      <LineLabelComponent
        edge={edge}
        position={labelPosition}
        label={lineConf.label}
        text={lineConf.text}
        onClick={onLabelClick}
        onRendered={handleLabelRendered}
      />
    </>
  );
}
