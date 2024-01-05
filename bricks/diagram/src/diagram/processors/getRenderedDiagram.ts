import dagre from "@dagrejs/dagre";
import type {
  PartialRectTuple,
  RefRepository,
  RenderedEdge,
  RenderedNode,
} from "../interfaces";
import { extractPartialRectTuple } from "./extractPartialRectTuple";

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
  nodePadding: PartialRectTuple;
}): RenderedDiagram | null {
  if (!graph || !nodesRefRepository || graph.nodeCount() === 0) {
    return null;
  }

  const paddings = extractPartialRectTuple(nodePadding);

  for (const id of graph.nodes()) {
    const node = graph.node(id);
    if (!node) {
      // eslint-disable-next-line no-console
      console.error("Diagram node not found: %s", id);
      continue;
    }
    const element = nodesRefRepository.get(id);
    node.width = (element?.offsetWidth ?? 10) + paddings[1] + paddings[3];
    node.height = (element?.offsetHeight ?? 10) + paddings[0] + paddings[2];
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
    const x = node.x - node.width / 2 + paddings[3];
    const y = node.y - node.height / 2 + paddings[0];
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
