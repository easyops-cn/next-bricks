import React from "react";

export type GradientDirection = "left-to-right" | "top-to-bottom";

export interface DefineLinearGradientProps {
  startColor?: string;
  endColor?: string;
  gradientDirection?: GradientDirection;
}

export function DefineLinearGradient({ startColor, endColor, gradientDirection }: DefineLinearGradientProps) {
  if (!startColor || !endColor) {
    return null;
  }
  let gradientCoords: {
    x1?: string | number;
    y1?: string | number;
    x2?: string | number;
    y2?: string | number;
  };
  switch (gradientDirection) {
    case "left-to-right":
      gradientCoords = { x1: 0, y1: 0, x2: 1, y2: 0 };
      break;
    default:
      gradientCoords = { x1: 0, y1: 0, x2: 0, y2: 1 };
  }
  return (
    <div style={{ position: "absolute", width: 0, height: 0 }}>
      <svg width={0} height={0} aria-hidden={true} focusable={false}>
        <defs>
          <linearGradient id="linear-gradient" {...gradientCoords}>
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
