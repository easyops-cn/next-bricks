// istanbul ignore file: experimental
import {
  forceSimulation,
  forceLink,
  forceCollide,
  forceManyBody,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import { pick } from "lodash";
import type {
  DiagramEdge,
  DiagramNode,
  ForceCollideOptions,
  LabelSize,
  LayoutOptionsForce,
  RenderedNode,
  UnifiedGraph,
} from "../interfaces";
import { adjustNodesSize } from "./adjustNodesSize";
import { adjustNodesPosition } from "./adjustNodesPosition";
import { getDirectLinePoints } from "../lines/getDirectLinePoints";
import { extractPartialRectTuple } from "./extractPartialRectTuple";

interface NormalNode extends SimulationNodeDatum {
  dummy?: false;
  id: string;
  data: DiagramNode;
  width: number;
  height: number;
}

interface DummyNode extends SimulationNodeDatum {
  dummy: true;
  id: string;
}

type ForceNode = NormalNode | DummyNode;

type ForceLink = SimulationLinkDatum<ForceNode> & {
  dummy?: boolean;
};

export function getForceGraph(
  previousGraph: UnifiedGraph | null,
  nodes: DiagramNode[] | undefined,
  edges: DiagramEdge[] | undefined,
  forceLayoutOptions: LayoutOptionsForce
): UnifiedGraph {
  const { nodePadding, dummyNodesOnEdges, collide } = {
    nodePadding: 0,
    dummyNodesOnEdges: 0,
    ...pick(forceLayoutOptions, ["nodePadding", "dummyNodesOnEdges"]),
    collide:
      forceLayoutOptions?.collide !== false
        ? ({
            dummyRadius: 1,
            radiusDiff: 5,
            strength: 1,
            iterations: 1,
            ...(forceLayoutOptions?.collide === true
              ? null
              : (forceLayoutOptions?.collide as ForceCollideOptions)),
          } as Required<ForceCollideOptions>)
        : (false as const),
  };
  const nodePaddings = extractPartialRectTuple(nodePadding);

  const renderedNodes: RenderedNode[] = [];
  for (const node of nodes ?? []) {
    const previousNode = previousGraph?.getNode(node.id);
    renderedNodes.push(
      previousNode?.data === node
        ? previousNode
        : ({
            id: node.id,
            data: node,
          } as RenderedNode)
    );
  }

  function getNode(id: string) {
    return renderedNodes.find((node) => node.data.id === id);
  }

  return {
    layout: "force",
    getNode,
    applyLayout({
      nodesRefRepository,
      lineLabelsRefRepository,
      normalizedLinesMap,
    }) {
      if (renderedNodes.length === 0) {
        return null;
      }

      adjustNodesSize(renderedNodes, nodesRefRepository, nodePaddings);

      const forceNodes = renderedNodes.slice();
      const forceLinks: ForceLink[] = [];

      for (const edge of edges ?? []) {
        forceLinks.push({ ...edge });
        if (dummyNodesOnEdges > 0) {
          forceNodes.push(
            ...(getDummyNodes(
              edge,
              dummyNodesOnEdges
            ) as Partial<RenderedNode>[] as RenderedNode[])
          );
          forceLinks.push(...getDummyEdges(edge, dummyNodesOnEdges));
        }
      }

      const linkSimulation = forceLink<ForceNode, ForceLink>(forceLinks).id(
        (d) => d.id
      );

      if (dummyNodesOnEdges > 0) {
        linkSimulation
          .distance((l) => (l.dummy ? 30 / (dummyNodesOnEdges + 1) : 30))
          .strength((l) => (l.dummy ? 0.5 : 1));
      }

      const simulation = forceSimulation<ForceNode>(forceNodes)
        .force("link", linkSimulation)
        .force("x", forceX())
        .force("y", forceY())
        .force("charge", forceManyBody());

      if (collide) {
        simulation.force(
          "collide",
          forceCollide<ForceNode>()
            .radius((d) =>
              d.dummy
                ? collide.dummyRadius
                : Math.sqrt(d.width ** 2 + d.height ** 2) / 2 +
                  collide.radiusDiff
            )
            .strength(collide.strength)
            .iterations(collide.iterations)
        );
      }

      simulation.stop();
      manuallyTickToTheEnd(simulation);

      adjustNodesPosition(renderedNodes, nodesRefRepository, nodePaddings);

      const renderedEdges =
        edges?.map((edge) => {
          const source = getNode(edge.source)!;
          const target = getNode(edge.target)!;
          const points = getDirectLinePoints(source, target);
          let angle: number | undefined;
          if (points) {
            const start = points[0];
            const end = points[points.length - 1];
            angle = Math.atan2(end.y - start.y, end.x - start.x);
          }

          const lineId = normalizedLinesMap.get(edge);
          const labelSize: LabelSize = {};
          if (lineId) {
            for (const placement of ["center", "start", "end"] as const) {
              const element = lineLabelsRefRepository.get(
                `${lineId}-${placement}`
              );
              if (element) {
                labelSize[placement] = [
                  element.offsetWidth,
                  element.offsetHeight,
                ];
              }
            }
          }

          return {
            data: edge,
            points,
            angle,
            labelSize,
          };
        }) ?? [];

      return { nodes: renderedNodes, edges: renderedEdges };
    },
  };
}

function manuallyTickToTheEnd(
  simulation: Simulation<ForceNode, ForceLink>
): void {
  // Manually tick to the end.
  simulation.tick(
    Math.ceil(
      Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
    )
  );
}

function getDummyNodes(edge: DiagramEdge, count: number): DummyNode[] {
  return new Array(count).fill(null).map<DummyNode>((v, i) => ({
    dummy: true,
    id: `$dummy-${edge.source}-${edge.target}-${i}`,
  }));
}

function getDummyEdges(edge: DiagramEdge, count: number): ForceLink[] {
  return new Array(count + 1).fill(null).map<ForceLink>((v, i) => ({
    dummy: true,
    source:
      i === 0 ? edge.source : `$dummy-${edge.source}-${edge.target}-${i - 1}`,
    target:
      i === count ? edge.target : `$dummy-${edge.source}-${edge.target}-${i}`,
  }));
}
