import dagre from "@dagrejs/dagre";
import type { RefRepository, RenderedEdge, RenderedNode } from "../interfaces";

export interface RenderedDiagram {
  nodes: RenderedNode[];
  edges: RenderedEdge[];
}

export function getRenderedDiagram({
  graph,
  nodesRefRepository,
  nodePadding,
}: {
  graph: dagre.graphlib.Graph<RenderedNode> | null;
  nodesRefRepository: RefRepository | null;
  nodePadding: number;
}): RenderedDiagram | null {
  if (!graph || !nodesRefRepository || graph.nodeCount() === 0) {
    return null;
  }

  for (const id of graph.nodes()) {
    const node = graph.node(id);
    if (!node) {
      // eslint-disable-next-line no-console
      console.error("Diagram node not found: %s", id);
      continue;
    }
    const element = nodesRefRepository.get(id);
    node.width = (element?.offsetWidth ?? 10) + nodePadding * 2;
    node.height = (element?.offsetHeight ?? 10) + nodePadding * 2;
  }

  dagre.layout(graph);

  // const positions = new Map<DiagramNodeId, NodePosition>();
  const renderedNodes: RenderedNode[] = [];

  for (const v of graph.nodes()) {
    const node = graph.node(v);
    if (!node) {
      continue;
    }
    renderedNodes.push(node);
    const x = node.x - node.width / 2 + nodePadding;
    const y = node.y - node.height / 2 + nodePadding;
    // positions.set(v, { x, y });

    const nodeContainer = nodesRefRepository.get(v)?.parentElement;
    if (nodeContainer) {
      nodeContainer.style.left = `${x}px`;
      nodeContainer.style.top = `${y}px`;
      nodeContainer.style.visibility = "visible";
    }
  }

  return {
    nodes: renderedNodes,
    edges: graph.edges().map((e) => graph.edge(e) as RenderedEdge),
  };
}
