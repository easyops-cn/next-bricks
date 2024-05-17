import { pick } from "lodash";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
} from "d3-force";
import type {
  Cell,
  ForceCollideOptions,
  ForceLink,
  ForceNode,
  LayoutOptionsForce,
  NodeId,
  NodeView,
} from "../../draw-canvas/interfaces";
import {
  isEdgeCell,
  isNodeCell,
  isNodeOrAreaDecoratorCell,
} from "../../draw-canvas/processors/asserts";
import { extractPartialRectTuple } from "../../diagram/processors/extractPartialRectTuple";
import type { FullRectTuple, PositionTuple } from "../../diagram/interfaces";

export interface ForceLayoutOptions {
  cells: Cell[];
  layoutOptions?: LayoutOptionsForce;
  center?: PositionTuple;
  fixedPosition?: boolean;
  allowEdgeToArea?: boolean;
}

export function forceLayout({
  cells,
  layoutOptions,
  center,
  fixedPosition,
  allowEdgeToArea,
}: ForceLayoutOptions): {
  getNodeView: (id: NodeId) => NodeView;
  nodePaddings: FullRectTuple;
} {
  const { nodePadding, collide } = {
    nodePadding: 0,
    ...pick(layoutOptions, ["nodePadding"]),
    collide:
      layoutOptions?.collide !== false
        ? ({
            radiusDiff: 18,
            strength: 1,
            iterations: 1,
            ...(layoutOptions?.collide === true
              ? null
              : (layoutOptions?.collide as ForceCollideOptions)),
          } as Required<ForceCollideOptions>)
        : (false as const),
  };
  const nodePaddings = extractPartialRectTuple(nodePadding);
  const forceNodes: ForceNode[] = [];
  const forceLinks: ForceLink[] = [];
  const nodesMap = new Map<NodeId, ForceNode>();
  for (const cell of cells) {
    if (
      (allowEdgeToArea && isNodeOrAreaDecoratorCell(cell)) ||
      isNodeCell(cell)
    ) {
      const node: ForceNode = {
        id: cell.id,
        width: cell.view.width + nodePaddings[1] + nodePaddings[3],
        height: cell.view.height + nodePaddings[0] + nodePaddings[2],
        ...(fixedPosition ? { fx: cell.view.x, fy: cell.view.y } : null),
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
    .force("x", forceX(center?.[0]))
    .force("y", forceY(center?.[1]))
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

  return {
    getNodeView: (id: NodeId) => nodesMap.get(id) as NodeView,
    nodePaddings,
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
