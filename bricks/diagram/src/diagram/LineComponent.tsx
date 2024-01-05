import React from "react";
import classNames from "classnames";
import type { LineTarget, LineTextClipPath, RenderedLine } from "./interfaces";

export interface LineComponentProps {
  line: RenderedLine;
  linePaths: Map<string, SVGPathElement | null>;
  clipPathList: LineTextClipPath[];
  markerPrefix: string;
  clipPathPrefix: string;
  onLineDoubleClick?(line: LineTarget): void;
}

export function LineComponent({
  line: { line, d, markerIndex, edge },
  linePaths,
  clipPathList,
  markerPrefix,
  clipPathPrefix,
  onLineDoubleClick,
}: LineComponentProps): JSX.Element {
  return (
    <g
      className={classNames("line", {
        interactable: line.interactable,
        // active: activeEdge && (edge.source === activeEdge.source && edge.target === activeEdge.target),
      })}
      onDoubleClick={
        line.interactable
          ? (e) => (
              e.preventDefault(),
              e.stopPropagation(),
              onLineDoubleClick?.({ id: line.$id, edge })
            )
          : undefined
      }
      style={{ cursor: line.cursor }}
    >
      {/* <path
        stroke="rgba(0,95,204,0.5)"
        strokeWidth={line.strokeWidth+11}
        strokeLinecap="square"
        d={d}
        fill="none"
        className="active-bg"
      />
      <path
        stroke="white"
        strokeWidth={line.strokeWidth+9}
        strokeLinecap="square"
        d={d}
        fill="none"
        className="active-bg"
      /> */}
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
        clipPath={
          clipPathList.some((clip) => clip.id === line.$id)
            ? `url(#${clipPathPrefix}${line.$id})`
            : undefined
        }
      />
      {line.interactable && (
        <path
          // This `path` is made for expanding interaction area of graph lines.
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth={line.interactStrokeWidth}
        />
      )}
    </g>
  );
}
