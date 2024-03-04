import React from "react";
import type { BasicDecoratorProps } from "../interfaces";

export function DecoratorText({ cell }: BasicDecoratorProps): JSX.Element {
  return (
    <text
      // x={cell.view.x}
      // y={cell.view.y}
      className="decorator-text"
    >
      {cell.view.text || "未命名"}
    </text>
  );
}
