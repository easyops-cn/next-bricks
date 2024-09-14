import { pull } from "lodash";
import type { NodePosition } from "../../../diagram/interfaces";
import { getConnectPointsOfRectangleWithDirection } from "../shapes/Rectangle";
import type {
  BiDirection,
  EdgeView,
  NodeView,
} from "../../../draw-canvas/interfaces";
import { getPolyLinePoints } from "../../../diagram/lines/getPolyLinePoints";
import { nodeViewToNodeRect } from "./nodeViewToNodeRect";
import {
  DEFAULT_NODE_PADDING_FOR_LINES,
  DEFAULT_NODE_PADDING_FOR_SMART_LINES,
} from "../../../draw-canvas/constants";
import { getDirectLinePoints } from "../../../diagram/lines/getDirectLinePoints";
import { isStraightType } from "../../../draw-canvas/processors/asserts";

const DEFAULT_DIRECTIONS = ["right", "top", "left", "bottom"] as const;

export function getSmartLinePoints(
  sourceView: NodeView,
  targetView: NodeView,
  edgeView: EdgeView | undefined,
  parallelGap?: number
): NodePosition[] | null {
  const {
    type,
    vertices,
    exitPosition: originalExit,
    entryPosition: originalEntry,
  } = edgeView ?? {};

  if (isStraightType(type)) {
    return getDirectLinePoints(
      nodeViewToNodeRect(
        sourceView,
        originalExit
          ? DEFAULT_NODE_PADDING_FOR_SMART_LINES
          : DEFAULT_NODE_PADDING_FOR_LINES
      ),
      nodeViewToNodeRect(
        targetView,
        originalEntry
          ? DEFAULT_NODE_PADDING_FOR_SMART_LINES
          : DEFAULT_NODE_PADDING_FOR_LINES
      ),
      parallelGap,
      edgeView
    );
  }

  if (vertices?.length) {
    const firstVertex = vertices[0];
    const lastVertex = vertices[vertices.length - 1];

    let exitPoint: NodePosition;
    let entryPoint: NodePosition;
    let exitDirection: BiDirection | undefined;
    let entryDirection: BiDirection | undefined;

    // Auto decide the exit and entry position.
    if (originalExit) {
      exitPoint = getAbsolutePosition(sourceView, originalExit);
    } else {
      let possibleFirstNextPoint: NodePosition | undefined;
      if (vertices.length > 1) {
        // Decide exit point by the first two vertices.
        possibleFirstNextPoint = vertices[1];
      } else if (originalEntry) {
        // Decide exit point by the entry position.
        possibleFirstNextPoint = getAbsolutePosition(targetView, originalEntry);
      }
      if (possibleFirstNextPoint) {
        exitPoint = getDefaultAbsolutePosition(
          firstVertex,
          sourceView,
          firstVertex.y === possibleFirstNextPoint.y
        );
      } else {
        // No other vertices nor the entry position, decide exit point by the
        // relative position between the last vertex and the target node.
        const prefer =
          lastVertex.y < targetView.y ||
          lastVertex.y > targetView.y + targetView.height
            ? "ns"
            : "ew";
        ({ point: exitPoint, direction: exitDirection } =
          fitEndpointAndDirection(sourceView, targetView, vertices, prefer));
      }
    }

    if (originalEntry) {
      entryPoint = getAbsolutePosition(targetView, originalEntry);
    } else {
      let possibleLastPreviousPoint: NodePosition | undefined;
      if (vertices.length > 1) {
        // Decide entry point by the last two vertices.
        possibleLastPreviousPoint = vertices[vertices.length - 2];
      } else if (originalExit) {
        // Decide entry point by the exit position.
        possibleLastPreviousPoint = getAbsolutePosition(
          sourceView,
          originalExit
        );
      }
      if (possibleLastPreviousPoint) {
        entryPoint = getDefaultAbsolutePosition(
          lastVertex,
          targetView,
          lastVertex.y === possibleLastPreviousPoint.y
        );
      } else {
        // No other vertices nor the exit position, decide entry point by the
        // relative position between the first vertex and the source node.
        const prefer =
          firstVertex.x < sourceView.x ||
          firstVertex.x > sourceView.x + sourceView.width
            ? "ew"
            : "ns";
        ({ point: entryPoint, direction: entryDirection } =
          fitEndpointAndDirection(
            targetView,
            sourceView,
            vertices.slice().reverse(),
            prefer
          ));
      }
    }

    const { x: sourceX, y: sourceY } = exitPoint;
    const { x: targetX, y: targetY } = entryPoint;

    const newLinePoints = [exitPoint, ...vertices, entryPoint];

    const newVertices = [...vertices];

    // If the first vertex is not on any axis of the source exit point,
    // add a vertex to connect them.
    if (firstVertex && firstVertex.x !== sourceX && firstVertex.y !== sourceY) {
      newVertices.unshift(
        exitDirection === "ns"
          ? { x: sourceX, y: firstVertex.y }
          : exitDirection === "ew"
            ? { x: firstVertex.x, y: sourceY }
            : firstVertex.x === newLinePoints[2].x
              ? { x: sourceX, y: firstVertex.y }
              : { x: firstVertex.x, y: sourceY }
      );
    }

    // If the last vertex is not on any axis of the target entry point,
    // add a vertex to connect them.
    if (lastVertex && lastVertex.x !== targetX && lastVertex.y !== targetY) {
      newVertices.push(
        entryDirection === "ns"
          ? { x: targetX, y: lastVertex.y }
          : entryDirection === "ew"
            ? { x: lastVertex.x, y: targetY }
            : lastVertex.x === newLinePoints[newLinePoints.length - 3].x
              ? { x: targetX, y: lastVertex.y }
              : { x: lastVertex.x, y: targetY }
      );
    }

    return [
      exitPoint,
      ...simplifyVertices(exitPoint, newVertices, entryPoint),
      entryPoint,
    ];
  }

  const exitPosition =
    originalExit ?? getDefaultPosition(targetView, sourceView);
  const entryPosition =
    originalEntry ?? getDefaultPosition(sourceView, targetView);

  const { x: sourceX, y: sourceY } = getAbsolutePosition(
    sourceView,
    exitPosition
  );
  const { x: targetX, y: targetY } = getAbsolutePosition(
    targetView,
    entryPosition
  );

  const connectPoints = getConnectPointsOfRectangleWithDirection();
  const originalSourceDirections =
    connectPoints.find((p) => p.x === exitPosition.x && p.y === exitPosition.y)
      ?.d ?? DEFAULT_DIRECTIONS;
  const originalTargetDirections =
    connectPoints.find(
      (p) => p.x === entryPosition.x && p.y === entryPosition.y
    )?.d ?? DEFAULT_DIRECTIONS;
  const sourceDirections = [...originalSourceDirections];
  const targetDirections = [...originalTargetDirections];

  if (sourceX < targetX) {
    pull(sourceDirections, "left");
    pull(targetDirections, "right");
  } else {
    pull(sourceDirections, "right");
    pull(targetDirections, "left");
  }

  if (sourceY < targetY) {
    pull(sourceDirections, "top");
    pull(targetDirections, "bottom");
  } else {
    pull(sourceDirections, "bottom");
    pull(targetDirections, "top");
  }

  const sourceDirection = sourceDirections[0] ?? originalSourceDirections[0];
  const targetDirection = targetDirections[0] ?? originalTargetDirections[0];

  const sourcePosition =
    sourceDirection === "left" || sourceDirection === "right"
      ? exitPosition.y
      : exitPosition.x;
  const targetPosition =
    targetDirection === "left" || targetDirection === "right"
      ? entryPosition.y
      : entryPosition.x;

  return getPolyLinePoints(
    nodeViewToNodeRect(sourceView, DEFAULT_NODE_PADDING_FOR_SMART_LINES),
    nodeViewToNodeRect(targetView, DEFAULT_NODE_PADDING_FOR_SMART_LINES),
    sourceDirection,
    targetDirection,
    sourcePosition,
    targetPosition
  );
}

export function simplifyVertices(
  exitPoint: NodePosition,
  vertices: NodePosition[],
  entryPoint: NodePosition
): NodePosition[] {
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
  while (index < vertices.length) {
    const vertex = vertices[index];
    const isHorizontal = vertex.x !== prev.x;
    const isVertical = vertex.y !== prev.y;
    if (isHorizontal || isVertical) {
      const direction = isHorizontal ? "ew" : "ns";
      if (direction !== prevDirection) {
        const next =
          index === vertices.length - 1 ? entryPoint : vertices[index + 1];
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

function getDefaultPosition(
  sourceView: NodeView,
  targetView: NodeView
): NodePosition {
  if (targetView.y + targetView.height < sourceView.y) {
    return { x: 0.5, y: 1 };
  }
  if (targetView.y > sourceView.y + sourceView.height) {
    return { x: 0.5, y: 0 };
  }
  return targetView.x < sourceView.x ? { x: 1, y: 0.5 } : { x: 0, y: 0.5 };
}

function getAbsolutePosition(view: NodeView, position: NodePosition) {
  const halfPadding = DEFAULT_NODE_PADDING_FOR_SMART_LINES / 2;
  return {
    x:
      view.x -
      halfPadding +
      position.x * (view.width + DEFAULT_NODE_PADDING_FOR_SMART_LINES),
    y:
      view.y -
      halfPadding +
      position.y * (view.height + DEFAULT_NODE_PADDING_FOR_SMART_LINES),
  };
}

function getDefaultAbsolutePosition(
  sourceView: NodePosition,
  targetView: NodeView,
  flip?: boolean
): NodePosition {
  let xAxis: "x" | "y";
  let yAxis: "x" | "y";
  let xSize: "width" | "height";
  let ySize: "width" | "height";
  if (flip) {
    xAxis = "y";
    yAxis = "x";
    xSize = "height";
    ySize = "width";
  } else {
    xAxis = "x";
    yAxis = "y";
    xSize = "width";
    ySize = "height";
  }
  let position: NodePosition | undefined;
  if (targetView[yAxis] + targetView[ySize] < sourceView[yAxis]) {
    position = { [xAxis]: 0.5, [yAxis]: 1 } as unknown as NodePosition;
  }
  if (targetView[yAxis] > sourceView[yAxis]) {
    position = { [xAxis]: 0.5, [yAxis]: 0 } as unknown as NodePosition;
  }
  if (position) {
    return getAbsolutePosition(targetView, position);
  }

  const xPosition = targetView[xAxis] < sourceView[xAxis] ? 1 : 0;

  return {
    [xAxis]:
      targetView[xAxis] -
      DEFAULT_NODE_PADDING_FOR_SMART_LINES / 2 +
      xPosition * (targetView[xSize] + DEFAULT_NODE_PADDING_FOR_SMART_LINES),
    [yAxis]: sourceView[yAxis],
  } as unknown as NodePosition;
}

function fitEndpointAndDirection(
  view: NodeView,
  oppositeView: NodeView,
  vertices: NodePosition[],
  prefer: BiDirection
): { point: NodePosition; direction: BiDirection } {
  let point: NodePosition;
  let direction: BiDirection;

  let xAxis: "x" | "y";
  let yAxis: "x" | "y";
  let xSize: "width" | "height";
  let ySize: "width" | "height";
  let nsDirection: BiDirection;
  let ewDirection: BiDirection;
  if (prefer === "ns") {
    xAxis = "x";
    yAxis = "y";
    xSize = "width";
    ySize = "height";
    nsDirection = "ns";
    ewDirection = "ew";
  } else {
    xAxis = "y";
    yAxis = "x";
    xSize = "height";
    ySize = "width";
    nsDirection = "ew";
    ewDirection = "ns";
  }
  const vertex = vertices[0];

  if (
    vertex[xAxis] >= view[xAxis] &&
    vertex[xAxis] <= view[xAxis] + view[xSize]
  ) {
    if (vertex[yAxis] > view[yAxis] + view[ySize]) {
      point = {
        [xAxis]: vertex[xAxis],
        [yAxis]: view[yAxis] + view[ySize],
      } as unknown as NodePosition;
      direction = nsDirection;
    } else if (vertex[yAxis] < view[yAxis]) {
      point = {
        [xAxis]: vertex[xAxis],
        [yAxis]: view[yAxis],
      } as unknown as NodePosition;
      direction = nsDirection;
    } else {
      const nextVertex = vertices[1] ?? oppositeView;
      point = {
        [xAxis]: vertex[xAxis],
        [yAxis]:
          nextVertex[yAxis] < vertex[yAxis]
            ? vertex[yAxis]
            : view[yAxis] + view[ySize],
      } as unknown as NodePosition;
      direction = nsDirection;
    }
  } else {
    if (vertex[yAxis] < view[yAxis]) {
      point = {
        [xAxis]: view[xAxis] + view[xSize] / 2,
        [yAxis]: view[yAxis],
      } as unknown as NodePosition;
      direction = nsDirection;
    } else if (vertex[yAxis] > view[yAxis] + view[ySize]) {
      point = {
        [xAxis]: view[xAxis] + view[xSize] / 2,
        [yAxis]: view[yAxis] + view[ySize],
      } as unknown as NodePosition;
      direction = nsDirection;
    } else if (vertex[xAxis] < view[xAxis]) {
      point = {
        [xAxis]: view[xAxis],
        [yAxis]: vertex[yAxis],
      } as unknown as NodePosition;
      direction = ewDirection;
    } else {
      point = {
        [xAxis]: view[xAxis] + view[xSize],
        [yAxis]: vertex[yAxis],
      } as unknown as NodePosition;
      direction = ewDirection;
    }
  }
  return { point, direction: direction };
}
