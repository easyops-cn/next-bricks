import { pick } from "lodash";
import type { NodePosition, PositionTuple } from "../../../diagram/interfaces";
import type { HoverState } from "../../../draw-canvas/HoverStateContext";
import type {
  EdgeCell,
  LineEditorState,
  LineEditorStateOfControl,
  EditableLine,
} from "../../../draw-canvas/interfaces";
import { getSmartLinePoints, simplifyVertices } from "./getSmartLinePoints";

export function getEditingLinePoints(
  activeEditableEdge: EdgeCell | null,
  lineEditorState: LineEditorState | null,
  editableLineMap: WeakMap<EdgeCell, EditableLine>,
  connectLineTo: PositionTuple | null,
  hoverState: HoverState | null
): NodePosition[] | null {
  if (
    !activeEditableEdge ||
    !lineEditorState ||
    !(
      connectLineTo ||
      (lineEditorState.type !== "control" &&
        hoverState?.activePointIndex !== undefined)
    )
  ) {
    return null;
  }

  const { type } = lineEditorState;
  const { source, target } = editableLineMap.get(activeEditableEdge)!;
  const { view } = activeEditableEdge;
  const { exitPosition, entryPosition, vertices } = view ?? {};

  const lineSettings = pick(view, ["type", "curveType"]);

  if (type === "control") {
    const newVertices = getNewLineVertices(
      activeEditableEdge,
      lineEditorState,
      editableLineMap,
      connectLineTo!
    );

    return getSmartLinePoints(source.view, target.view, {
      ...lineSettings,
      exitPosition,
      entryPosition,
      vertices: newVertices,
    });
  }

  if (hoverState?.activePointIndex !== undefined) {
    const position = hoverState.relativePoints[hoverState.activePointIndex];
    // Assert `hoverState.cell` is `target`
    return getSmartLinePoints(source.view, target.view, {
      ...lineSettings,
      ...(type === "entry"
        ? {
            exitPosition,
            entryPosition: position,
          }
        : {
            exitPosition: position,
            entryPosition,
          }),
      vertices,
    });
  }

  const [x1, y1] = connectLineTo!;

  if (type === "entry") {
    return getSmartLinePoints(
      source.view,
      { x: x1, y: y1, width: 0, height: 0 },
      { ...lineSettings, exitPosition, vertices }
    );
  }

  return getSmartLinePoints(
    { x: x1, y: y1, width: 0, height: 0 },
    target.view,
    { ...lineSettings, entryPosition, vertices }
  );
}

export function getNewLineVertices(
  activeEditableEdge: EdgeCell,
  lineEditorState: LineEditorStateOfControl,
  editableLineMap: WeakMap<EdgeCell, EditableLine>,
  connectLineTo: PositionTuple
) {
  const { control } = lineEditorState;
  const { points: linePoints } = editableLineMap.get(activeEditableEdge)!;
  const newVertices: NodePosition[] = [];
  const [x1, y1] = connectLineTo!;
  const exitPoint = linePoints[0];
  const entryPoint = linePoints[linePoints.length - 1];

  // If moving the first control, prepend a vertex to connect the control to the source
  if (control.index === 0) {
    newVertices.push(
      control.direction === "ns"
        ? { x: exitPoint.x, y: y1 }
        : { x: x1, y: exitPoint.y }
    );
  }

  // Adjust the related two controls, and leave other controls unchanged
  for (let i = 1; i < linePoints.length - 1; i++) {
    const vertex = linePoints[i];
    newVertices.push(
      i === control.index || i === control.index + 1
        ? control.direction === "ns"
          ? { x: vertex.x, y: y1 }
          : { x: x1, y: vertex.y }
        : vertex
    );
  }

  // If moving the last control, append a vertex to connect the control to the target
  if (control.index === linePoints.length - 2) {
    newVertices.push(
      control.direction === "ns"
        ? { x: entryPoint.x, y: y1 }
        : { x: x1, y: entryPoint.y }
    );
  }

  return simplifyVertices(exitPoint, newVertices, entryPoint);
}
