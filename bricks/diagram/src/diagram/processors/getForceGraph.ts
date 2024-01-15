import {
  forceSimulation,
  forceLink,
  forceCollide,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
  forceManyBody,
  // forceX,
  // forceY,
  // forceCenter,
} from "d3-force";
import type {
  DiagramEdge,
  DiagramNode,
  RenderedNode,
  UnifiedGraph,
} from "../interfaces";

interface ForceNode extends SimulationNodeDatum {
  id: string;
  data: DiagramNode;
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
    isEmpty() {
      return !nodes?.length;
    },
    getNodes() {
      return renderedNodes;
    },
    getNode,
    getEdges() {
      return (
        edges?.map((edge) => {
          const sourceNode = getNode(edge.source)!;
          const targetNode = getNode(edge.target)!;
          return {
            data: edge,
            points: [
              { x: sourceNode.x, y: sourceNode.y },
              { x: targetNode.x, y: targetNode.y },
            ],
          };
        }) ?? []
      );
    },
    applyLayout() {
      const simulation = forceSimulation<ForceNode>(renderedNodes)
        // .force("x", forceX().strength(0.1))
        // .force("y", forceY().strength(0.4))
        // .force("center", forceCenter(400, 500))
        .force(
          "link",
          forceLink<ForceNode, ForceLink>(
            edges?.map((edge) => ({ ...edge })) ?? []
          ).id((d) => d.id)
        )
        .force(
          "collide",
          forceCollide()
            // .radius((d) => radiusByIndex[d.index])
            .radius(() => 120)
            .strength(0.1)
        )
        .force("charge", forceManyBody().strength(30));

      simulation.stop();

      manuallyTickToTheEnd(simulation);
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
