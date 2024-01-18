import dagre from "@dagrejs/dagre";
import { pick } from "lodash";
import type {
  DiagramEdge,
  DiagramNode,
  LayoutOptionsDagre,
  RenderedEdge,
  RenderedNode,
  UnifiedGraph,
} from "../interfaces";
import { adjustNodesSize } from "./adjustNodesSize";
import { adjustNodesPosition } from "./adjustNodesPosition";
import { extractPartialRectTuple } from "./extractPartialRectTuple";

export function getDagreGraph(
  previousGraph: UnifiedGraph | null,
  nodes: DiagramNode[] | undefined,
  edges: DiagramEdge[] | undefined,
  dagreLayoutOptions: LayoutOptionsDagre | undefined
): UnifiedGraph {
  const { nodePadding, ...dagreGraphOptions } = {
    nodePadding: 0,
    rankdir: "TB",
    ranksep: 50,
    edgesep: 10,
    nodesep: 50,
    // align: undefined,
    ...pick(dagreLayoutOptions, [
      "nodePadding",
      "rankdir",
      "ranksep",
      "edgesep",
      "nodesep",
      "align",
    ]),
  };
  const nodePaddings = extractPartialRectTuple(nodePadding);

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
    getNode(id) {
      return graph.node(id);
    },
    applyLayout({
      nodesRefRepository,
      lineLabelsRefRepository,
      normalizedLinesMap,
    }) {
      const renderedNodes: RenderedNode[] = [];
      for (const id of graph.nodes()) {
        const node = graph.node(id);
        if (node) {
          renderedNodes.push(node);
        } else {
          // eslint-disable-next-line no-console
          console.error("Diagram node not found: %s", id);
        }
      }

      if (renderedNodes.length === 0) {
        return null;
      }

      adjustNodesSize(renderedNodes, nodesRefRepository, nodePaddings);

      const renderedEdges = graph
        .edges()
        .map((e) => graph.edge(e) as RenderedEdge);
      for (const edge of renderedEdges) {
        const lineId = normalizedLinesMap.get(edge.data);
        if (lineId) {
          for (const placement of ["center", "start", "end"] as const) {
            const element = lineLabelsRefRepository.get(
              `${lineId}-${placement}`
            );
            if (element) {
              const { offsetWidth, offsetHeight } = element;
              if (placement === "center") {
                edge.labelpos = "c";
                edge.width = offsetWidth;
                edge.height = offsetHeight;
              }
              edge.labelSize ??= {};
              edge.labelSize[placement] = [offsetWidth, offsetHeight];
            }
          }
        }
      }
      dagre.layout(graph);

      adjustNodesPosition(renderedNodes, nodesRefRepository, nodePaddings);

      return {
        nodes: renderedNodes,
        edges: renderedEdges,
      };
    },
  };
}
