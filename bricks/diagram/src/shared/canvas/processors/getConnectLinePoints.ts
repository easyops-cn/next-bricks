import type { NodePosition, PositionTuple } from "../../../diagram/interfaces";
import type { HoverState } from "../../../draw-canvas/HoverStateContext";
import type { SmartConnectLineState } from "../../../draw-canvas/interfaces";
import { getSmartLinePoints } from "./getSmartLinePoints";

export function getConnectLinePoints(
  smartConnectLineState: SmartConnectLineState | null,
  connectLineTo: PositionTuple | null,
  hoverState: HoverState | null
): NodePosition[] | null {
  if (
    !smartConnectLineState ||
    !(connectLineTo || hoverState?.activePointIndex !== undefined)
  ) {
    return null;
  }

  const sourceView = smartConnectLineState.source.view;
  if (hoverState?.activePointIndex !== undefined) {
    return getSmartLinePoints(sourceView, hoverState.cell.view, {
      exitPosition: smartConnectLineState.exitPosition,
      entryPosition: hoverState.relativePoints[hoverState.activePointIndex!],
    });
  }

  const [x1, y1] = connectLineTo!;

  return getSmartLinePoints(
    sourceView,
    { x: x1, y: y1, width: 0, height: 0 },
    {
      exitPosition: smartConnectLineState.exitPosition,
    }
  );
}
