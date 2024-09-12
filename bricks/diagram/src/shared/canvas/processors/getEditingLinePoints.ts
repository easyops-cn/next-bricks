import type { NodePosition, PositionTuple } from "../../../diagram/interfaces";
import type { HoverState } from "../../../draw-canvas/HoverStateContext";
import type {
  LineEditorState,
  LineEditorStateOfControl,
} from "../../../draw-canvas/interfaces";
import { getSmartLinePoints } from "./getSmartLinePoints";

export function getEditingLinePoints(
  lineEditorState: LineEditorState | null,
  connectLineTo: PositionTuple | null,
  hoverState: HoverState | null
): NodePosition[] | null {
  if (
    !lineEditorState ||
    !(
      connectLineTo ||
      (lineEditorState.type !== "control" &&
        hoverState?.activePointIndex !== undefined)
    )
  ) {
    return null;
  }

  const {
    type,
    source,
    target,
    edge: { view },
  } = lineEditorState;
  const { exitPosition, entryPosition, vertices } = view ?? {};

  if (type === "control") {
    const newVertices = getNewLineVertices(lineEditorState, connectLineTo!);

    return getSmartLinePoints(source.view, target.view, {
      exitPosition,
      entryPosition,
      vertices: newVertices,
    });
  }

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
            vertices,
          }
        : {
            exitPosition: position,
            entryPosition,
            vertices,
          }
    );
  }

  const [x1, y1] = connectLineTo!;

  if (type === "entry") {
    return getSmartLinePoints(
      source.view,
      { x: x1, y: y1, width: 0, height: 0 },
      { exitPosition, vertices }
    );
  }

  return getSmartLinePoints(
    { x: x1, y: y1, width: 0, height: 0 },
    target.view,
    { entryPosition, vertices }
  );
}

export function getNewLineVertices(
  lineEditorState: LineEditorStateOfControl,
  connectLineTo: PositionTuple
) {
  const { control, linePoints } = lineEditorState;
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

  // Simplify the vertices, ignore all vertices that its previous and next points are on the same axis
  // E.g, ignore two vertices of index 1 and index 3 for the following line.
  //  0---1---2
  //          |
  //          3
  //          |
  //          4
  const simplifiedVertices: NodePosition[] = [];
  let prev = exitPoint;
  let prevDirection: "ns" | "ew" | undefined;
  let index = 0;
  while (index < newVertices.length) {
    const vertex = newVertices[index];
    const isHorizontal = vertex.x !== prev.x;
    const isVertical = vertex.y !== prev.y;
    if (isHorizontal || isVertical) {
      const direction = isHorizontal ? "ew" : "ns";
      if (direction !== prevDirection) {
        const next =
          index === newVertices.length - 1
            ? entryPoint
            : newVertices[index + 1];
        const isHorizontalNext = next.x !== vertex.x;
        const isVerticalNext = next.y !== vertex.y;
        if (isHorizontalNext || isVerticalNext) {
          const nextDirection = isHorizontalNext ? "ew" : "ns";
          if (direction !== nextDirection) {
            prevDirection = direction;
            simplifiedVertices.push(vertex);
            prev = vertex;
          }
        }
      }
    }
    index++;
  }

  return simplifiedVertices;
}
