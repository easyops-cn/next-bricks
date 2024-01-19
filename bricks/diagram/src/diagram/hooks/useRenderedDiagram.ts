import { useEffect, useState } from "react";
import type {
  DiagramEdge,
  DiagramNode,
  LayoutOptions,
  LayoutOptionsDagre,
  LayoutOptionsForce,
  ManualLayoutStatus,
  NodeMovement,
  RefRepository,
  RenderedDiagram,
  UnifiedGraph,
  UserViewNodesMap,
} from "../interfaces";
import { getDagreGraph } from "../processors/getDagreGraph";
import { getForceGraph } from "../processors/getForceGraph";
import { getManualGraph } from "../processors/getManualGraph";

export function useRenderedDiagram({
  layout: originalLayout,
  nodes,
  edges,
  manualLayoutStatus,
  userViewReady,
  userViewNodesMap,
  nodeMovement,
  nodesRefRepository,
  lineLabelsRefRepository,
  normalizedLinesMap,
  nodesRenderId,
  lineLabelsRenderId,
  layoutOptions,
}: {
  layout: "dagre" | "force" | undefined;
  nodes: DiagramNode[] | undefined;
  edges: DiagramEdge[] | undefined;
  manualLayoutStatus: ManualLayoutStatus;
  userViewReady: boolean;
  userViewNodesMap: UserViewNodesMap | null;
  nodeMovement: NodeMovement | null;
  nodesRefRepository: RefRepository | null;
  lineLabelsRefRepository: RefRepository | null;
  normalizedLinesMap: WeakMap<DiagramEdge, string>;
  nodesRenderId: number;
  lineLabelsRenderId: number;
  layoutOptions?: LayoutOptions;
}) {
  const layout = manualLayoutStatus === "initial" ? originalLayout : "manual";
  const [graph, setGraph] = useState<UnifiedGraph | null>(null);

  const [renderedDiagram, setRenderedDiagram] = useState<RenderedDiagram>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (!userViewReady) {
      return;
    }
    setGraph((previousGraph) =>
      layout === "dagre"
        ? getDagreGraph(
            previousGraph,
            nodes,
            edges,
            layoutOptions as LayoutOptionsDagre
          )
        : layout === "force"
          ? getForceGraph(
              previousGraph,
              nodes,
              edges,
              userViewNodesMap,
              layoutOptions as LayoutOptionsForce
            )
          : layout === "manual"
            ? getManualGraph(previousGraph, nodes, edges, layoutOptions)
            : null
    );
  }, [edges, nodes, layout, layoutOptions, userViewReady, userViewNodesMap]);

  useEffect(() => {
    if (
      !nodesRefRepository ||
      !lineLabelsRefRepository ||
      layout !== graph?.layout
    ) {
      return;
    }
    const renderedDiagram = graph?.applyLayout({
      manualLayoutStatus,
      nodesRefRepository,
      lineLabelsRefRepository,
      normalizedLinesMap,
      nodeMovement,
    });
    if (renderedDiagram) {
      setRenderedDiagram(renderedDiagram);
    }
  }, [
    layout,
    manualLayoutStatus,
    graph,
    nodeMovement,
    nodesRefRepository,
    lineLabelsRefRepository,
    nodesRenderId,
    lineLabelsRenderId,
    normalizedLinesMap,
  ]);

  return renderedDiagram;
}
