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
import { getRenderedDiagram } from "../processors/getRenderedDiagram";
import { getDagreGraph } from "../processors/getDagreGraph";
import { getForceGraph } from "../processors/getForceGraph";

export function useRenderedDiagram({
  layout,
  nodes,
  edges,
  nodesRefRepository,
  nodesRenderId,
  layoutOptions,
}: {
  layout: "dagre" | "force" | undefined;
  nodes: DiagramNode[] | undefined;
  edges: DiagramEdge[] | undefined;
  nodesRefRepository: RefRepository | null;
  nodesRenderId: number;
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
    const renderedDiagram = getRenderedDiagram({
      graph,
      nodesRefRepository,
      nodePadding,
    });
    if (renderedDiagram) {
      setRenderedDiagram(renderedDiagram);
    }
  }, [graph, nodesRefRepository, nodesRenderId, nodePadding]);

  return renderedDiagram;
}
