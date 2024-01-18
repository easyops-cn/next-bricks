import React from "react";
import classNames from "classnames";
import type {
  DiagramEdge,
  LineTarget,
  LineTextClipPath,
  RenderedLine,
} from "./interfaces";

export interface LineComponentProps {
  line: RenderedLine;
  linePaths: Map<string, SVGPathElement | null>;
  clipPathList: LineTextClipPath[];
  markerPrefix: string;
  clipPathPrefix: string;
  activeLineMarkerPrefix: string;
  activeEdge: DiagramEdge | null;
  onLineClick?(line: LineTarget): void;
  onLineDoubleClick?(line: LineTarget): void;
}

export function LineComponent({
  line: { line, d, markerIndex, edge },
  linePaths,
  clipPathList,
  markerPrefix,
  clipPathPrefix,
  activeLineMarkerPrefix,
  activeEdge,
  onLineClick,
  onLineDoubleClick,
}: LineComponentProps): JSX.Element {
  const clipPath = clipPathList.some((clip) => clip.lineId === line.$id)
    ? `url(#${clipPathPrefix}${line.$id})`
    : undefined;
  return (
    <g
      className={classNames("line", {
        interactable: line.interactable,
        active:
          activeEdge &&
          edge.source === activeEdge.source &&
          edge.target === activeEdge.target,
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
          strokeWidth={line.interactStrokeWidth}
        />
      )}
      <path
        ref={(element) => linePaths.set(line.$id, element)}
        stroke={line.strokeColor}
        strokeWidth={line.strokeWidth}
        d={d}
        fill="none"
        markerEnd={
          markerIndex === undefined
            ? undefined
            : `url(#${markerPrefix}${markerIndex})`
        }
        clipPath={clipPath}
      />
      <path
        stroke="var(--palette-blue-3)"
        strokeWidth={line.strokeWidth}
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
