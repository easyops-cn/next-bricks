import dagre from "@dagrejs/dagre";
import type {
  DiagramEdge,
  DiagramNode,
  RenderedEdge,
  RenderedNode,
  UnifiedGraph,
} from "../interfaces";

export function getDagreGraph(
  previousGraph: UnifiedGraph | null,
  nodes: DiagramNode[] | undefined,
  edges: DiagramEdge[] | undefined,
  dagreGraphOptions: dagre.GraphLabel
): UnifiedGraph {
  // Create a new directed graph
  const graph = new dagre.graphlib.Graph<RenderedNode>();

  // Set an object for the graph label
  graph.setGraph(dagreGraphOptions);

  // Default to assigning a new object as a label for each new edge.
  graph.setDefaultEdgeLabel(function () {
    return {};
  });

  for (const node of nodes ?? []) {
    const previousNode = previousGraph?.getNode(node.id);
    graph.setNode(
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
    graph.setEdge(edge.source, edge.target, { data: edge });
  }

  return {
    layout: "dagre",
    isEmpty() {
      return graph.nodeCount() === 0;
    },
    getNodes() {
      return graph.nodes().map((id) => {
        const node = graph.node(id);
        if (!node) {
          // eslint-disable-next-line no-console
          console.error("Diagram node not found: %s", id);
        }
        return node;
      });
    },
    getEdges() {
      return graph.edges().map((e) => graph.edge(e) as RenderedEdge);
    },
    applyLayout() {
      dagre.layout(graph);
    },
    getNode(id) {
      return graph.node(id);
    },
  };
}
