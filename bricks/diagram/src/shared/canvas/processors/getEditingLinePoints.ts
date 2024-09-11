import type { NodePosition, PositionTuple } from "../../../diagram/interfaces";
import type { HoverState } from "../../../draw-canvas/HoverStateContext";
import type { LineEditorState } from "../../../draw-canvas/interfaces";
import { getSmartLinePoints } from "./getSmartLinePoints";

export function getEditingLinePoints(
  lineEditorState: LineEditorState | null,
  connectLineTo: PositionTuple | null,
  hoverState: HoverState | null
): NodePosition[] | null {
  if (
    !lineEditorState ||
    !(connectLineTo || hoverState?.activePointIndex !== undefined)
  ) {
    return null;
  }

  const { type, source, target, exitPosition, entryPosition } = lineEditorState;

  if (hoverState?.activePointIndex !== undefined) {
    const position = hoverState.relativePoints[hoverState.activePointIndex];
    // Assert `hoverState.cell` is `target`
    return getSmartLinePoints(
      source.view,
      target.view,
      type === "entry"
        ? {
            exitPosition,
            entryPosition: position,
          }
        : {
            exitPosition: position,
            entryPosition,
          }
    );
  }

  const [x1, y1] = connectLineTo!;

  if (type === "entry") {
    return getSmartLinePoints(
      source.view,
      { x: x1, y: y1, width: 0, height: 0 },
      { exitPosition }
    );
  }

  return getSmartLinePoints(
    { x: x1, y: y1, width: 0, height: 0 },
    target.view,
    { entryPosition }
  );
}
