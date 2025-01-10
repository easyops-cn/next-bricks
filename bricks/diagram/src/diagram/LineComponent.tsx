import React, { type JSX } from "react";
import classNames from "classnames";
import type { LineTarget, RenderedLine, LineMaskRects } from "./interfaces";

export interface LineComponentProps {
  line: RenderedLine;
  linePaths: Map<string, SVGPathElement | null>;
  lineMaskRects: LineMaskRects;
  maskPrefix: string;
  markerPrefix: string;
  activeLineMarkerPrefix: string;
  active?: boolean;
  activeRelated?: boolean;
  onLineClick?(line: LineTarget): void;
  onLineDoubleClick?(line: LineTarget): void;
}

export function LineComponent({
  line: { line, edge, d, markers },
  linePaths,
  lineMaskRects,
  maskPrefix,
  markerPrefix,
  activeLineMarkerPrefix,
  active,
  activeRelated,
  onLineClick,
  onLineDoubleClick,
}: LineComponentProps): JSX.Element {
  const mask = lineMaskRects.has(line.$id)
    ? `url(#${maskPrefix}${line.$id})`
    : undefined;

  const { strokeColor, strokeWidth, interactStrokeWidth } = {
    ...line,
    ...(active
      ? line.overrides?.active
      : activeRelated
        ? line.overrides?.activeRelated
        : null),
  };

  const expectVariant = active
    ? "active"
    : activeRelated
      ? "active-related"
      : "default";

  let markerStart: string | undefined;
  let markerEnd: string | undefined;

  for (const marker of markers) {
    if (marker.variant === expectVariant) {
      if (marker.placement === "start") {
        markerStart = `url(#${markerPrefix}${marker.index})`;
      } else {
        markerEnd = `url(#${markerPrefix}${marker.index})`;
      }
    }
  }

  return (
    (<g
      className={classNames("line", {
        interactable: line.interactable,
        active,
        "active-related": activeRelated,
      })}
      onClick={
        line.interactable
          ? () => {
              onLineClick?.({ id: line.$id, edge });
            }
          : undefined
      }
      onDoubleClick={
        line.interactable
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              onLineDoubleClick?.({ id: line.$id, edge });
            }
          : undefined
      }
      style={{ cursor: line.cursor }}
    >
      {line.interactable && (
        <path
          // This `path` is made for expanding interaction area of graph lines.
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth={interactStrokeWidth}
        />
      )}
      <path
        ref={element => {
          linePaths.set(line.$id, element);
        }}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        d={d}
        fill="none"
        markerStart={markerStart}
        markerEnd={markerEnd}
        mask={mask}
      />
      <path
        stroke="var(--palette-blue-3)"
        strokeWidth={strokeWidth}
        d={d}
        fill="none"
        className="active-bg"
        markerStart={`url(#${activeLineMarkerPrefix}start)`}
        markerEnd={`url(#${activeLineMarkerPrefix}end)`}
        mask={mask}
      />
    </g>)
  );
}
