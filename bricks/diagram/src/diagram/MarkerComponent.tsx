import React from "react";

export interface MarkerComponentProps {
  id: string;
  strokeColor?: string;
}

export function MarkerComponent({
  id,
  strokeColor,
}: MarkerComponentProps): JSX.Element {
  return (
    <marker
      id={id}
      viewBox="0 0 6 6"
      refX={3}
      refY={3}
      markerWidth={6}
      markerHeight={6}
      orient="auto"
    >
      <path
        d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
        stroke={strokeColor}
        strokeWidth={1}
        fill={strokeColor}
      />
    </marker>
  );
}
