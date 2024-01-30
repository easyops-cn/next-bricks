import React from "react";
import type { RenderedLineLabel, SimpleRect } from "./interfaces";

export interface LineMaskComponentProps {
  maskPrefix: string;
  lineId: string;
  rects: SimpleRect[];
  renderedLineLabels: RenderedLineLabel[];
}

export function LineMaskComponent({
  lineId,
  rects,
  maskPrefix,
  renderedLineLabels,
}: LineMaskComponentProps): JSX.Element | null {
  const lineText = renderedLineLabels.find(
    (item) => item.lineId === lineId && item.placement === "center"
  );
  // istanbul ignore next
  if (!lineText) {
    return null;
  }
  const { lineRect } = lineText;
  const bgRect = getRectWithPadding(lineRect, 1000);
  return (
    <mask
      id={`${maskPrefix}${lineId}`}
      x={bgRect.left}
      y={bgRect.top}
      width={bgRect.width}
      height={bgRect.height}
    >
      <rect
        x={bgRect.left}
        y={bgRect.top}
        width={bgRect.width}
        height={bgRect.height}
        // Everything under a white pixel will be visible
        fill="white"
      />
      {rects.map((rect, index) => (
        <rect
          key={index}
          x={rect.left}
          y={rect.top}
          width={rect.width}
          height={rect.height}
          // Everything under a black pixel will be invisible
          fill="black"
        />
      ))}
    </mask>
  );
}

function getRectWithPadding(rect: SimpleRect, padding: number): SimpleRect {
  return {
    left: rect.left - padding,
    top: rect.top - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}
