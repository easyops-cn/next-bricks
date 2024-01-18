import { useEffect, useState } from "react";
import type {
  DiagramEdge,
  DiagramNode,
  LayoutOptions,
  LayoutOptionsDagre,
  LayoutOptionsForce,
  RefRepository,
  RenderedDiagram,
  UnifiedGraph,
} from "../interfaces";
import { getDagreGraph } from "../processors/getDagreGraph";
import { getForceGraph } from "../processors/getForceGraph";

export function useRenderedDiagram({
  layout,
  nodes,
  edges,
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
  nodesRefRepository: RefRepository | null;
  lineLabelsRefRepository: RefRepository | null;
  normalizedLinesMap: WeakMap<DiagramEdge, string>;
  nodesRenderId: number;
  lineLabelsRenderId: number;
  layoutOptions?: LayoutOptions;
}) {
  const [graph, setGraph] = useState<UnifiedGraph | null>(null);

  const [renderedDiagram, setRenderedDiagram] = useState<RenderedDiagram>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
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
              layoutOptions as LayoutOptionsForce
            )
          : null
    );
  }, [edges, nodes, layout, layoutOptions]);

  useEffect(() => {
    if (!nodesRefRepository || !lineLabelsRefRepository) {
      return;
    }
    const renderedDiagram = graph?.applyLayout({
      nodesRefRepository,
      lineLabelsRefRepository,
      normalizedLinesMap,
    });
    if (renderedDiagram) {
      setRenderedDiagram(renderedDiagram);
    }
  }, [
    graph,
    nodesRefRepository,
    lineLabelsRefRepository,
    nodesRenderId,
    lineLabelsRenderId,
    normalizedLinesMap,
  ]);

  return renderedDiagram;
}
