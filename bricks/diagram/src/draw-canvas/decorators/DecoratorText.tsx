import React from "react";
import classNames from "classnames";
import type { BasicDecoratorProps } from "../interfaces";

export function DecoratorText({
  cell,
  active,
}: BasicDecoratorProps): JSX.Element {
  return (
    <text
      // x={cell.view.x}
      // y={cell.view.y}
      className={classNames("decorator-text", { active })}
    >
      {cell.view.text || "未命名"}
    </text>
  );
}
