// istanbul ignore file: experimental
import {
  forceSimulation,
  forceLink,
  forceCollide,
  forceManyBody,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import type {
  DiagramEdge,
  DiagramNode,
  RenderedNode,
  UnifiedGraph,
} from "../interfaces";
import { adjustNodesSize } from "./adjustNodesSize";
import { adjustNodesPosition } from "./adjustNodesPosition";

interface ForceNode extends SimulationNodeDatum {
  id: string;
  data: DiagramNode;
  width: number;
  height: number;
}

type ForceLink = SimulationLinkDatum<ForceNode>;

export function getForceGraph(
  previousGraph: UnifiedGraph | null,
  nodes: DiagramNode[] | undefined,
  edges: DiagramEdge[] | undefined
): UnifiedGraph {
  const renderedNodes: RenderedNode[] = [];
  for (const node of nodes ?? []) {
    const previousNode = previousGraph?.getNode(node.id);
    renderedNodes.push(
      previousNode?.data === node
        ? previousNode
        : ({
            id: node.id,
            data: node,
          } as RenderedNode)
    );
  }

  function getNode(id: string) {
    return renderedNodes.find((node) => node.data.id === id);
  }

  return {
    layout: "force",
    getNode,
    applyLayout({ nodesRefRepository, nodePaddings }) {
      if (renderedNodes.length === 0) {
        return null;
      }

      adjustNodesSize(renderedNodes, nodesRefRepository, nodePaddings);

      const simulation = forceSimulation<ForceNode>(renderedNodes)
        .force("x", forceX() /* .strength(0.1) */)
        .force("y", forceY() /* .strength(0.4) */)
        // .force("center", forceCenter(640, 648))
        .force(
          "link",
          forceLink<ForceNode, ForceLink>(
            edges?.map((edge) => ({ ...edge })) ?? []
          ).id((d) => d.id)
        )
        .force(
          "collide",
          forceCollide<ForceNode>()
            .radius(
              (d) => Math.sqrt((d.width + 10) ** 2 + (d.height + 10) ** 2) / 2
            )
            .strength(1)
        )
        .force("charge", forceManyBody().strength(30));

      simulation.stop();
      manuallyTickToTheEnd(simulation);

      adjustNodesPosition(renderedNodes, nodesRefRepository, nodePaddings);

      const renderedEdges =
        edges?.map((edge) => {
          const source = getNode(edge.source)!;
          const target = getNode(edge.target)!;

          // Ignore if two nodes overlap.
          const left = Math.min(
            source.x - source.width / 2,
            target.x - target.width / 2
          );
          const right = Math.max(
            source.x + source.width / 2,
            target.x + target.width / 2
          );
          const top = Math.min(
            source.y - source.height / 2,
            target.y - target.height / 2
          );
          const bottom = Math.max(
            source.y + source.height / 2,
            target.y + target.height / 2
          );
          if (
            right - left < source.width + target.width &&
            bottom - top < source.height + target.height
          ) {
            return { data: edge };
          }

          const dx = target.x - source.x;
          const dy = target.y - source.y;

          let x0: number, y0: number, x1: number, y1: number;
          const directionX = dx > 0 ? 1 : -1;
          if (dy !== 0) {
            const deltaRadio = Math.abs(dx / dy);
            const directionY = dy > 0 ? 1 : -1;
            const sourceRadio = source.width / source.height;
            if (deltaRadio < sourceRadio) {
              x0 = source.x + ((deltaRadio * source.height) / 2) * directionX;
              y0 = source.y + (source.height / 2) * directionY;
            } else {
              x0 = source.x + (source.width / 2) * directionX;
              y0 = source.y + (source.width / 2 / deltaRadio) * directionY;
            }
            const targetRadio = target.width / target.height;
            if (deltaRadio < targetRadio) {
              x1 = target.x - ((deltaRadio * target.height) / 2) * directionX;
              y1 = target.y - (target.height / 2) * directionY;
            } else {
              x1 = target.x - (target.width / 2) * directionX;
              y1 = target.y - (target.width / 2 / deltaRadio) * directionY;
            }
          } else {
            x0 = source.x + (source.width / 2) * directionX;
            x1 = target.x - (target.width / 2) * directionX;
            y0 = y1 = source.y;
          }

          return {
            data: edge,
            points: [
              { x: x0, y: y0 },
              { x: x1, y: y1 },
            ],
          };
        }) ?? [];

      return { nodes: renderedNodes, edges: renderedEdges };
    },
  };
}

function manuallyTickToTheEnd(
  simulation: Simulation<ForceNode, ForceLink>
): void {
  // Manually tick to the end.
  simulation.tick(
    Math.ceil(
      Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
    )
  );
}
