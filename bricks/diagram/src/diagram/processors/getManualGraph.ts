// istanbul ignore file: experimental
import { pick } from "lodash";
import type {
  DiagramEdge,
  DiagramNode,
  BaseLayoutOptions,
  RenderedNode,
  UnifiedGraph,
} from "../interfaces";
import { extractPartialRectTuple } from "./extractPartialRectTuple";
import { adjustNodesSize } from "./adjustNodesSize";
import { adjustNodesPosition } from "./adjustNodesPosition";
import { getRenderedEdges } from "./getRenderedEdges";

export function getManualGraph(
  previousGraph: UnifiedGraph | null,
  nodes: DiagramNode[] | undefined,
  edges: DiagramEdge[] | undefined,
  layoutOptions: BaseLayoutOptions | undefined
): UnifiedGraph {
  const { nodePadding } = {
    nodePadding: 0,
    ...pick(layoutOptions, ["nodePadding"]),
  };
  const nodePaddings = extractPartialRectTuple(nodePadding);

  const renderedNodes: RenderedNode[] = [];
  for (const node of nodes ?? []) {
    const previousNode = previousGraph?.getNode(node.id);
    if (previousNode?.data === node) {
      renderedNodes.push(previousNode);
      previousNode.x0 = previousNode.x;
      previousNode.y0 = previousNode.y;
    } else {
      renderedNodes.push({
        id: node.id,
        data: node,
      } as RenderedNode);
    }
  }

  function getNode(id: string) {
    return renderedNodes.find((node) => node.data.id === id);
  }

  let movedNode: RenderedNode | undefined;

  return {
    layout: "manual",
    getNode,
    applyLayout({
      manualLayoutStatus,
      nodesRefRepository,
      lineLabelsRefRepository,
      normalizedLinesMap,
      nodeMovement,
    }) {
      if (renderedNodes.length === 0) {
        return null;
      }

      adjustNodesSize(renderedNodes, nodesRefRepository, nodePaddings);

      if (nodeMovement) {
        movedNode = renderedNodes.find((node) => node.id === nodeMovement.id);
        if (movedNode) {
          movedNode.x = (movedNode.x0 ?? 0) + nodeMovement.move[0];
          movedNode.y = (movedNode.y0 ?? 0) + nodeMovement.move[1];
        }
      }

      if (manualLayoutStatus === "finished" && movedNode) {
        // Set x0/y0 after finished manual layout
        movedNode.x0 = movedNode.x;
        movedNode.y0 = movedNode.y;
      }

      adjustNodesPosition(renderedNodes, nodesRefRepository, nodePaddings);

      const renderedEdges = getRenderedEdges(edges, {
        normalizedLinesMap,
        lineLabelsRefRepository,
      });

      return { nodes: renderedNodes, edges: renderedEdges };
    },
  };
}
