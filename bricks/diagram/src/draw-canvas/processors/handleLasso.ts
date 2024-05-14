import type { PositionTuple, TransformLiteral } from "../../diagram/interfaces";
import type { NodeView } from "../interfaces";

export interface HandleLassoOptions {
  transform: TransformLiteral;
  offset: PositionTuple;
  onLassoing(rect: NodeView): void;
  onLassoed(rect: NodeView): void;
}

export function handleLasso(
  event: MouseEvent,
  { transform, offset, onLassoing, onLassoed }: HandleLassoOptions
) {
  if (event.ctrlKey || event.button) {
    return;
  }

  event.stopPropagation();

  const from: PositionTuple = [event.clientX, event.clientY];
  const x0 = (event.clientX - offset[0] - transform.x) / transform.k;
  const y0 = (event.clientY - offset[1] - transform.y) / transform.k;

  function getMovement(e: MouseEvent): PositionTuple {
    return [
      (e.clientX - from[0]) / transform.k,
      (e.clientY - from[1]) / transform.k,
    ];
  }

  let moved = false;

  const handleMove = (e: MouseEvent, finished?: boolean) => {
    // Respect the scale
    const movement = getMovement(e);
    if (!moved) {
      moved = movement[0] ** 2 + movement[1] ** 2 >= 9;
    }
    if (moved) {
      let [width, height] = movement;
      let x = x0;
      let y = y0;
      if (width < 0) {
        x = x0 + width;
        width = -width;
      }
      if (height < 0) {
        y = y0 + height;
        height = -height;
      }
      (finished ? onLassoed : onLassoing)({
        x,
        y,
        width,
        height,
      });
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    handleMove(e);
  };
  const onMouseUp = (e: MouseEvent) => {
    handleMove(e, true);
    moved = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}
