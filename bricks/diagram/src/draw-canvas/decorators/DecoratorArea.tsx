import React, { useEffect, type JSX } from "react";
import type { BasicDecoratorProps } from "../interfaces";
import { handleMouseDown } from "../processors/handleMouseDown";

export function DecoratorArea({
  cell,
  transform,
  readOnly,
  layoutOptions,
  activeTarget,
  cells,
  onCellResizing,
  onCellResized,
  onSwitchActiveTarget,
}: BasicDecoratorProps): JSX.Element {
  const resizeHandleRef = React.useRef<SVGGElement>(null);

  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    if (!resizeHandle || readOnly) {
      return;
    }
    const onMouseDown = (event: MouseEvent) => {
      handleMouseDown(event, {
        action: "resize",
        cell,
        scale: transform.k,
        layoutOptions,
        activeTarget,
        cells,
        onCellResizing,
        onCellResized,
        onSwitchActiveTarget,
      });
    };
    resizeHandle.addEventListener("mousedown", onMouseDown);
    return () => {
      resizeHandle.removeEventListener("mousedown", onMouseDown);
    };
  }, [
    activeTarget,
    cell,
    cells,
    layoutOptions,
    onCellResized,
    onCellResizing,
    onSwitchActiveTarget,
    readOnly,
    transform.k,
  ]);

  return (
    <g className="decorator-area">
      <rect
        width={cell.view.width}
        height={cell.view.height}
        className="area"
      />
      {!readOnly && (
        <g
          ref={resizeHandleRef}
          className="resize-handle"
          transform={`translate(${cell.view.width - 20} ${cell.view.height - 20})`}
        >
          <rect width={20} height={20} />
          <path d="M10 18L18 10 M15 18L18 15" />
        </g>
      )}
    </g>
  );
}
