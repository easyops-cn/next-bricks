import { useEffect, useMemo, useState } from "react";
import { pick } from "lodash";
import type {
  DiagramEdge,
  DiagramNode,
  LayoutOptionsDagre,
  RefRepository,
  RenderedDiagram,
  UnifiedGraph,
} from "../interfaces";
import { getDagreGraph } from "../processors/getDagreGraph";
import { getForceGraph } from "../processors/getForceGraph";
import { extractPartialRectTuple } from "../processors/extractPartialRectTuple";

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
  layoutOptions?: LayoutOptionsDagre;
}) {
  const [graph, setGraph] = useState<UnifiedGraph | null>(null);

  const [renderedDiagram, setRenderedDiagram] = useState<RenderedDiagram>({
    nodes: [],
    edges: [],
  });

  const fixedOptions = useMemo(
    () => ({
      rankdir: "TB",
      ranksep: 50,
      edgesep: 10,
      nodesep: 50,
      // align: undefined,
      nodePadding: 0,
      ...layoutOptions,
    }),
    [layoutOptions]
  );

  const { nodePadding } = fixedOptions;

  useEffect(() => {
    setGraph((previousGraph) =>
      layout === "dagre"
        ? getDagreGraph(
            previousGraph,
            nodes,
            edges,
            pick(fixedOptions, [
              "rankdir",
              "ranksep",
              "edgesep",
              "nodesep",
              "align",
            ])
          )
        : layout === "force"
          ? getForceGraph(previousGraph, nodes, edges)
          : null
    );
  }, [edges, nodes, fixedOptions, layout]);

  useEffect(() => {
    if (!nodesRefRepository || !lineLabelsRefRepository) {
      return;
    }
    const nodePaddings = extractPartialRectTuple(nodePadding);
    const renderedDiagram = graph?.applyLayout({
      nodesRefRepository,
      lineLabelsRefRepository,
      normalizedLinesMap,
      nodePaddings,
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
    nodePadding,
    normalizedLinesMap,
  ]);

  return renderedDiagram;
}
