import type {
  PartialRectTuple,
  RefRepository,
  RenderedDiagram,
  RenderedNode,
  UnifiedGraph,
} from "../interfaces";
import { extractPartialRectTuple } from "./extractPartialRectTuple";

export function getRenderedDiagram({
  graph,
  nodesRefRepository,
  nodePadding,
}: {
  graph: UnifiedGraph | null;
  nodesRefRepository: RefRepository | null;
  nodePadding: PartialRectTuple;
}): RenderedDiagram | null {
  if (!graph || !nodesRefRepository || graph.isEmpty()) {
    return null;
  }

  const paddings = extractPartialRectTuple(nodePadding);

  for (const node of graph.getNodes()) {
    if (!node) {
      continue;
    }
    const element = nodesRefRepository.get(node.id);
    node.width = (element?.offsetWidth ?? 10) + paddings[1] + paddings[3];
    node.height = (element?.offsetHeight ?? 10) + paddings[0] + paddings[2];
  }

  graph.applyLayout();

  // const positions = new Map<DiagramNodeId, NodePosition>();
  const renderedNodes: RenderedNode[] = [];

  for (const node of graph.getNodes()) {
    if (!node) {
      continue;
    }
    renderedNodes.push(node);
    const x = node.x - node.width / 2 + paddings[3];
    const y = node.y - node.height / 2 + paddings[0];
    // positions.set(v, { x, y });

    const nodeContainer = nodesRefRepository.get(node.id)?.parentElement;
    if (nodeContainer) {
      nodeContainer.style.left = `${x}px`;
      nodeContainer.style.top = `${y}px`;
      nodeContainer.style.visibility = "visible";
    }
  }

  return {
    nodes: renderedNodes,
    edges: graph.getEdges(),
  };
}
