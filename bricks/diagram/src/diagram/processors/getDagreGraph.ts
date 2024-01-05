import dagre from "@dagrejs/dagre";
import type { DiagramEdge, DiagramNode, RenderedNode } from "../interfaces";

export function getDagreGraph(
  previousGraph: dagre.graphlib.Graph<RenderedNode> | null,
  nodes: DiagramNode[] | undefined,
  edges: DiagramEdge[] | undefined,
  dagreGraphOptions: dagre.GraphLabel
) {
  // Create a new directed graph
  const newGraph = new dagre.graphlib.Graph<RenderedNode>();

  // Set an object for the graph label
  newGraph.setGraph(dagreGraphOptions);

  // Default to assigning a new object as a label for each new edge.
  newGraph.setDefaultEdgeLabel(function () {
    return {};
  });

  for (const node of nodes ?? []) {
    const previousNode = previousGraph?.node(node.id);
    newGraph.setNode(
      node.id,
      previousNode?.data === node
        ? previousNode
        : {
            id: node.id,
            data: node,
          }
    );
  }

  for (const edge of edges ?? []) {
    newGraph.setEdge(edge.source, edge.target, { data: edge });
  }

  return newGraph;
}
