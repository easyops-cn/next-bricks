// istanbul ignore file: experimental
import type {
  DiagramEdge,
  Direction,
  NormalizedLine,
  RenderedEdge,
  RenderedLine,
  RenderedNode,
} from "../interfaces";
import { curveLine } from "../lines/curveLine";
import { getDirectLinePoints } from "../lines/getDirectLinePoints";
import { getPolyLinePoints } from "../lines/getPolyLinePoints";
import { doTwoNodesOverlap } from "./doTwoNodesOverlap";

export function getRenderedLines(
  renderedEdges: RenderedEdge[],
  renderedNodes: RenderedNode[],
  normalizedLines: NormalizedLine[]
): RenderedLine[] {
  const renderedEdgeMap = new WeakMap<DiagramEdge, RenderedEdge>();
  const renderedNodeMap = new Map<string, RenderedNode>();
  const relatedNodes = new Map<string, Set<RenderedNode>>();

  for (const renderedNode of renderedNodes) {
    renderedNodeMap.set(renderedNode.id, renderedNode);
  }

  for (const renderedEdge of renderedEdges) {
    const { data: edge } = renderedEdge;
    renderedEdgeMap.set(edge, renderedEdge);
  }

  let prepared = false;
  const prepareRelatedNodes = () => {
    if (prepared) {
      return;
    }
    prepared = true;

    const addRelatedNodes = (from: string, to: string) => {
      let relates = relatedNodes.get(from);
      if (!relates) {
        relatedNodes.set(from, (relates = new Set()));
      }
      const toNode = renderedNodeMap.get(to);
      if (toNode) {
        relates.add(toNode);
      }
    };

    for (const {
      data: { source, target },
    } of renderedEdges) {
      if (source !== target) {
        addRelatedNodes(source, target);
        addRelatedNodes(target, source);
      }
    }
  };

  return normalizedLines
    .map<RenderedLine | undefined>(({ line, edge, markers, ...rest }) => {
      const renderedEdge = renderedEdgeMap.get(edge);
      if (!renderedEdge) {
        return;
      }
      const startMarkerOffset =
        markers.find(
          (marker) =>
            marker.variant === "default" && marker.placement === "start"
        )?.offset ?? 0;
      const endMarkerOffset =
        markers.find(
          (marker) => marker.variant === "default" && marker.placement === "end"
        )?.offset ?? 0;
      let angle: number | undefined;

      let { points } = renderedEdge;
      // Only dagre graph will have pre-calculated line points
      if (!points) {
        const source = renderedNodeMap.get(edge.source);
        const target = renderedNodeMap.get(edge.target);

        if (source && target && source !== target) {
          if (line.type === "polyline") {
            if (
              !doTwoNodesOverlap(
                source,
                target,
                startMarkerOffset,
                endMarkerOffset
              )
            ) {
              prepareRelatedNodes();
              const sourceDirection = getDirection(
                source,
                target,
                startMarkerOffset
              );
              const targetDirection = getDirection(
                target,
                source,
                endMarkerOffset
              );
              const sourceRelates = getOrderedRelates(
                relatedNodes.get(edge.source) ?? [],
                source,
                sourceDirection,
                startMarkerOffset
              );
              const targetRelates = getOrderedRelates(
                relatedNodes.get(edge.target) ?? [],
                target,
                targetDirection,
                endMarkerOffset
              );

              const sourcePosition =
                (sourceRelates.indexOf(target) + 1) /
                (sourceRelates.length + 1);
              const targetPosition =
                (targetRelates.indexOf(source) + 1) /
                (targetRelates.length + 1);

              points = getPolyLinePoints(
                source,
                target,
                sourceDirection,
                targetDirection,
                sourcePosition,
                targetPosition
              );
            }
          } else {
            points = getDirectLinePoints(source, target);
          }

          if (points) {
            const start = points[0];
            const end = points[points.length - 1];
            angle = Math.atan2(end.y - start.y, end.x - start.x);
          }
        }
      }

      const d = curveLine(
        points,
        line.curveType,
        startMarkerOffset,
        endMarkerOffset
      );
      return {
        ...rest,
        markers,
        line,
        edge,
        d,
        angle,
        labelSize: renderedEdge.labelSize,
      };
    })
    .filter(Boolean) as RenderedLine[];
}

function getDirection(
  source: RenderedNode,
  target: RenderedNode,
  padding: number
): Direction {
  // Add a padding to the source node to avoid the markers being warped.
  const sourceAngle = Math.atan2(
    source.height + padding * 2,
    source.width + padding * 2
  );
  const { x: sx, y: sy } = source;
  const { x: tx, y: ty } = target;
  const angle = Math.atan2(ty - sy, tx - sx);
  const fixedAngle = angle < 0 ? Math.PI * 2 + angle : angle;
  const direction = Math.floor((fixedAngle / Math.PI) * 2);
  switch (direction) {
    case 0:
      return fixedAngle < sourceAngle ? "right" : "bottom";
    case 1:
      return fixedAngle < Math.PI - sourceAngle ? "bottom" : "left";
    case 2:
      return fixedAngle < Math.PI + sourceAngle ? "left" : "top";
    default:
      return fixedAngle < Math.PI * 2 - sourceAngle ? "top" : "right";
  }
}

function getOrderedRelates(
  relates: Iterable<RenderedNode>,
  from: RenderedNode,
  direction: Direction,
  padding: number
): RenderedNode[] {
  return [...relates]
    .filter((node) => getDirection(from, node, padding) === direction)
    .sort((a, b) => {
      const { x: ax, y: ay } = a;
      const { x: bx, y: by } = b;
      return direction === "top" || direction === "bottom" ? ax - bx : ay - by;
    });
}
