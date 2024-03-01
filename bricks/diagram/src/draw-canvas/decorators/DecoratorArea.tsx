import React, { useEffect } from "react";
import classNames from "classnames";
import type { BasicDecoratorProps } from "../interfaces";
import { handleMouseDown } from "../processors/handleMouseDown";

export function DecoratorArea({
  cell,
  active,
  onCellResizing,
  onCellResized,
  onSwitchActiveTarget,
}: BasicDecoratorProps): JSX.Element {
  const resizeHandleRef = React.useRef<SVGGElement>(null);

  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    const onMouseDown = (event: MouseEvent) => {
      handleMouseDown(event, {
        action: "resize",
        cell,
        onCellResizing,
        onCellResized,
        onSwitchActiveTarget,
      });
    };
    resizeHandle?.addEventListener("mousedown", onMouseDown);
    return () => {
      resizeHandle?.removeEventListener("mousedown", onMouseDown);
    };
  }, [cell, onCellResized, onCellResizing, onSwitchActiveTarget]);

  return (
    <g className={classNames("decorator-area", { active })}>
      <rect
        // x={cell.view.x}
        // y={cell.view.y}
        width={cell.view.width}
        height={cell.view.height}
        className="area"
      />
      <g
        ref={resizeHandleRef}
        className="resize-handle"
        transform={`translate(${cell.view.width - 20} ${cell.view.height - 20})`}
      >
        <rect width={20} height={20} />
        <path d="M10 18L18 10 M15 18L18 15" />
      </g>
    </g>
  );
}
