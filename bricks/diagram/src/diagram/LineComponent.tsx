import React from "react";
import classNames from "classnames";
import type { LineTarget, LineTextClipPath, RenderedLine } from "./interfaces";

export interface LineComponentProps {
  line: RenderedLine;
  linePaths: Map<string, SVGPathElement | null>;
  clipPathList: LineTextClipPath[];
  markerPrefix: string;
  clipPathPrefix: string;
  activeLineMarkerPrefix: string;
  active?: boolean;
  activeRelated?: boolean;
  onLineClick?(line: LineTarget): void;
  onLineDoubleClick?(line: LineTarget): void;
}

export function LineComponent({
  line: {
    line,
    edge,
    d,
    markerIndex,
    activeMarkerIndex,
    activeRelatedMarkerIndex,
  },
  linePaths,
  clipPathList,
  markerPrefix,
  clipPathPrefix,
  activeLineMarkerPrefix,
  active,
  activeRelated,
  onLineClick,
  onLineDoubleClick,
}: LineComponentProps): JSX.Element {
  const clipPath = clipPathList.some((clip) => clip.lineId === line.$id)
    ? `url(#${clipPathPrefix}${line.$id})`
    : undefined;

  const { strokeColor, strokeWidth, interactStrokeWidth } = {
    ...line,
    ...(active
      ? line.overrides?.active
      : activeRelated
        ? line.overrides?.activeRelated
        : null),
  };

  const finalMarkerIndex = active
    ? activeMarkerIndex
    : activeRelated
      ? activeRelatedMarkerIndex
      : markerIndex;

  return (
    <g
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
        ref={(element) => linePaths.set(line.$id, element)}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        d={d}
        fill="none"
        markerEnd={
          finalMarkerIndex === undefined
            ? undefined
            : `url(#${markerPrefix}${finalMarkerIndex})`
        }
        clipPath={clipPath}
      />
      <path
        stroke="var(--palette-blue-3)"
        strokeWidth={strokeWidth}
        d={d}
        fill="none"
        className="active-bg"
        markerStart={`url(#${activeLineMarkerPrefix}start)`}
        markerEnd={`url(#${activeLineMarkerPrefix}end)`}
        clipPath={clipPath}
      />
    </g>
  );
}
