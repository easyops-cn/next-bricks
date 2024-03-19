import { useEffect, useRef, useState } from "react";
import type { ZoomBehavior } from "d3-zoom";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
} from "d3-force";
import dagre from "@dagrejs/dagre";
import { pick } from "lodash";
import type {
  Cell,
  ForceCollideOptions,
  ForceLink,
  ForceNode,
  LayoutOptions,
  LayoutOptionsForce,
  LayoutType,
  NodeId,
  NodeView,
} from "../../draw-canvas/interfaces";
import type { FullRectTuple, RangeTuple } from "../../diagram/interfaces";
import { useAutoCenter } from "./useAutoCenter";
import {
  isEdgeCell,
  isNodeCell,
  isNodeOrEdgeCell,
} from "../../draw-canvas/processors/asserts";
import {
  SYMBOL_FOR_LAYOUT_INITIALIZED,
  SYMBOL_FOR_SIZE_INITIALIZED,
} from "../../draw-canvas/constants";
import type { DrawCanvasAction } from "../../draw-canvas/reducers/interfaces";
import { extractPartialRectTuple } from "../../diagram/processors/extractPartialRectTuple";

export interface UseLayoutOptions {
  layout: LayoutType;
  layoutOptions?: LayoutOptions;
  rootRef: React.RefObject<SVGSVGElement>;
  cells: Cell[];
  zoomable?: boolean;
  zoomer: ZoomBehavior<SVGSVGElement, unknown>;
  scaleRange: RangeTuple;
  dispatch: (value: DrawCanvasAction) => void;
}

export function useLayout({
  layout,
  layoutOptions,
  rootRef,
  cells,
  zoomable,
  zoomer,
  scaleRange,
  dispatch,
}: UseLayoutOptions) {
  const [layoutInitialized, setLayoutInitialized] = useState(
    layout !== "force" && layout !== "dagre"
  );

  const [centered, setCentered] = useAutoCenter({
    rootRef,
    layoutInitialized,
    cells,
    zoomable,
    zoomer,
    scaleRange,
  });

  const previousLayoutRef = useRef<Cell[] | null>(null);

  useEffect(() => {
    // Wait for all nodes to be size-initialized before layout.
    if (
      cells.some(
        (cell) => isNodeCell(cell) && !cell[SYMBOL_FOR_SIZE_INITIALIZED]
      )
    ) {
      return;
    }

    if (layout !== "force" && layout !== "dagre") {
      setLayoutInitialized(true);
      return;
    }

    // Do not re-layout if nodes and edges not changed.
    if (
      isSameArray(previousLayoutRef.current, cells.filter(isNodeOrEdgeCell))
    ) {
      return;
    }

    let getNodeView: (id: NodeId) => NodeView;
    let nodePaddings: FullRectTuple;

    if (layout === "force") {
      const forceLayoutOptions = layoutOptions as LayoutOptionsForce;
      const { nodePadding, collide } = {
        nodePadding: 0,
        ...pick(forceLayoutOptions, ["nodePadding"]),
        collide:
          forceLayoutOptions?.collide !== false
            ? ({
                radiusDiff: 18,
                strength: 1,
                iterations: 1,
                ...(forceLayoutOptions?.collide === true
                  ? null
                  : (forceLayoutOptions?.collide as ForceCollideOptions)),
              } as Required<ForceCollideOptions>)
            : (false as const),
      };
      nodePaddings = extractPartialRectTuple(nodePadding);
      const forceNodes: ForceNode[] = [];
      const forceLinks: ForceLink[] = [];
      const nodesMap = new Map<NodeId, ForceNode>();
      for (const cell of cells) {
        if (isNodeCell(cell)) {
          const node: ForceNode = {
            id: cell.id,
            width: cell.view.width + nodePaddings[1] + nodePaddings[3],
            height: cell.view.height + nodePaddings[0] + nodePaddings[2],
          };
          forceNodes.push(node);
          nodesMap.set(node.id, node);
        } else if (isEdgeCell(cell)) {
          forceLinks.push({ source: cell.source, target: cell.target });
        }
      }

      const linkSimulation = forceLink<ForceNode, ForceLink>(forceLinks).id(
        (d) => d.id
      );
      const simulation = forceSimulation<ForceNode, ForceLink>(forceNodes)
        .force("link", linkSimulation)
        .force("x", forceX())
        .force("y", forceY())
        .force("charge", forceManyBody());

      if (collide) {
        simulation.force(
          "collide",
          forceCollide<ForceNode>()
            .radius(
              (d) =>
                Math.sqrt(d.width ** 2 + d.height ** 2) / 2 + collide.radiusDiff
            )
            .strength(collide.strength)
            .iterations(collide.iterations)
        );
      }

      simulation.stop();
      manuallyTickToTheEnd(simulation);

      getNodeView = (id: NodeId) => nodesMap.get(id) as NodeView;
    } else {
      const dagreLayoutOptions = layoutOptions as LayoutOptionsForce;
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
      nodePaddings = extractPartialRectTuple(nodePadding);
      const graph = new dagre.graphlib.Graph<ForceNode>();
      graph.setGraph(dagreGraphOptions);
      // Default to assigning a new object as a label for each new edge.
      graph.setDefaultEdgeLabel(function () {
        return {};
      });
      for (const cell of cells) {
        if (isNodeCell(cell)) {
          graph.setNode(cell.id, {
            id: cell.id,
            width: cell.view.width + nodePaddings[1] + nodePaddings[3],
            height: cell.view.height + nodePaddings[0] + nodePaddings[2],
          });
        } else if (isEdgeCell(cell)) {
          graph.setEdge(cell.source, cell.target);
        }
      }
      dagre.layout(graph);

      getNodeView = (id: NodeId) => graph.node(id);
    }

    const newCells: Cell[] = cells.map((cell) => {
      if (isNodeCell(cell)) {
        const nodeView = getNodeView(cell.id);
        return {
          ...cell,
          view: {
            ...cell.view,
            x: nodeView.x! - nodeView.width / 2 + nodePaddings[3],
            y: nodeView.y! - nodeView.height / 2 + nodePaddings[0],
          },
          [SYMBOL_FOR_LAYOUT_INITIALIZED]: true,
        };
      }
      return cell;
    });
    previousLayoutRef.current = newCells.filter(isNodeOrEdgeCell);
    dispatch({ type: "update-cells", payload: newCells });

    setCentered(false);
    setLayoutInitialized(true);
  }, [cells, dispatch, layout, layoutOptions, setCentered]);

  return { centered, setCentered };
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

function isSameArray<T = unknown>(a: T[] | null, b: T[]): boolean {
  return a?.length === b.length && a.every((v, i) => v === b[i]);
}
