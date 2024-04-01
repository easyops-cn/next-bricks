import { without } from "lodash";
import type {
  RangeTuple,
  SizeTuple,
  TransformLiteral,
} from "../../diagram/interfaces";
import { DEFAULT_NODE_GAP, SYMBOL_FOR_SIZE_INITIALIZED } from "../constants";
import type {
  Cell,
  InitialCell,
  LayoutType,
  NodeCell,
  NodeId,
  NodeView,
} from "../interfaces";
import { isDecoratorCell, isEdgeCell, isNodeCell } from "./asserts";
import { initializeCells } from "./initializeCells";
import { transformToCenter } from "./transformToCenter";
import { forceLayout } from "../../shared/canvas/forceLayout";
import { dagreLayout } from "../../shared/canvas/dagreLayout";

export function updateCells({
  cells,
  layout,
  previousCells,
  defaultNodeSize,
  canvasWidth,
  canvasHeight,
  scaleRange,
  transform,
  reason,
  parent,
}: {
  cells: InitialCell[] | undefined;
  layout?: LayoutType;
  previousCells: Cell[];
  defaultNodeSize: SizeTuple;
  canvasWidth: number;
  canvasHeight: number;
  scaleRange: RangeTuple;
  transform: TransformLiteral;
  reason?: "add-related-nodes";
  parent?: NodeId;
}): {
  cells: Cell[];
  updated: Cell[];
  shouldReCenter: boolean;
} {
  const isManualLayout = layout !== "force" && layout !== "dagre";
  const newCells = initializeCells(cells, { defaultNodeSize });
  const updateCandidates: NodeCell[] = [];
  let shouldReCenter = false;

  const previousSizeInitializedNodes = new Map<string, NodeCell>();
  let previousShouldCentered = false;
  for (const cell of previousCells) {
    if (isDecoratorCell(cell)) {
      previousShouldCentered = true;
    } else if (isNodeCell(cell)) {
      previousShouldCentered = true;
      if (cell[SYMBOL_FOR_SIZE_INITIALIZED]) {
        previousSizeInitializedNodes.set(cell.id, cell);
      }
    }
  }

  const nodesMap = new Map<string, NodeCell>();
  for (const cell of newCells) {
    if (isNodeCell(cell)) {
      nodesMap.set(cell.id, cell);
      const previousNode = previousSizeInitializedNodes.get(cell.id);
      if (previousNode) {
        cell.view.width = previousNode.view.width;
        cell.view.height = previousNode.view.height;
        cell[SYMBOL_FOR_SIZE_INITIALIZED] = true;
      }
    }
  }

  let handled = false;

  if (reason === "add-related-nodes" && parent) {
    // Place these unpositioned downstream nodes below the parent node, and
    // on the right side of the positioned siblings.
    const downstreamNodeIds = new Set<string>();
    for (const cell of newCells) {
      if (
        isEdgeCell(cell) &&
        cell.source === parent &&
        cell.target !== parent
      ) {
        downstreamNodeIds.add(cell.target);
      }
    }
    const parentNode = nodesMap.get(parent);
    if (parentNode?.view.x !== undefined && parentNode.view.y !== undefined) {
      handled = true;
      const downstreamNodes = [...downstreamNodeIds]
        .map((id) => nodesMap.get(id))
        .filter(Boolean) as NodeCell[];
      let rightMostNode: NodeCell | undefined = undefined;
      for (const node of downstreamNodes) {
        if (node.view.x !== undefined && node.view.y !== undefined) {
          // Find the rightmost node that is below the parent node.
          if (
            (!rightMostNode || node.view.x > rightMostNode.view.x) &&
            node.view.y > parentNode.view.y
          ) {
            rightMostNode = node;
          }
        } else {
          // Unpositioned nodes
          updateCandidates.push(node);
        }
      }
      if (updateCandidates.length > 0 && isManualLayout) {
        let nextX: number;
        let nextY: number;
        if (rightMostNode) {
          // Place unpositioned nodes on the right side of the rightmost positioned siblings.
          nextX =
            rightMostNode.view.x + rightMostNode.view.width + DEFAULT_NODE_GAP;
          nextY = rightMostNode.view.y;
        } else {
          // If there are no positioned siblings, just place them below the parent.
          const totalWidth = updateCandidates.reduce(
            (acc, node) => acc + node.view.width + DEFAULT_NODE_GAP,
            -DEFAULT_NODE_GAP
          );
          nextX =
            parentNode.view.x - totalWidth / 2 + parentNode.view.width / 2;
          nextY = parentNode.view.y + parentNode.view.height + DEFAULT_NODE_GAP;
        }
        for (const node of updateCandidates) {
          node.view.x = nextX;
          node.view.y = nextY;
          nextX += node.view.width + DEFAULT_NODE_GAP;
        }
      }
    }
  }

  if (!handled) {
    // By default, place unpositioned nodes in a grid.
    let maxWidth = defaultNodeSize[0];
    let maxHeight = defaultNodeSize[1];
    const positionedNodes: NodeCell[] = [];
    let hasDecorators = false;
    for (const cell of newCells) {
      if (isNodeCell(cell)) {
        if (cell.view.width > maxWidth) {
          maxWidth = cell.view.width;
        }
        if (cell.view.height > maxHeight) {
          maxHeight = cell.view.height;
        }
        if (cell.view.x === undefined || cell.view.y === undefined) {
          updateCandidates.push(cell);
        } else {
          positionedNodes.push(cell);
        }
      } else if (isDecoratorCell(cell)) {
        hasDecorators = true;
      }
    }

    if (isManualLayout) {
      if (!previousShouldCentered) {
        // If the previous cells are not centered, use the centered transform instead.
        transform = transformToCenter(without(newCells, ...updateCandidates), {
          canvasWidth,
          canvasHeight,
          scaleRange,
        });
      }

      let getNodeView: (id: NodeId) => NodeView;

      // If there is no positioned nodes, or only one while without decorators,
      // then there is no relative positions, we can place the nodes with dagre layout.
      // Otherwise, use the force layout.
      if (
        positionedNodes.length === 0 ||
        (positionedNodes.length === 1 && !hasDecorators)
      ) {
        // The positioned node (if exists) will be updated.
        updateCandidates.push(...positionedNodes);
        ({ getNodeView } = dagreLayout({ cells: newCells }));
        shouldReCenter = true;
      } else {
        ({ getNodeView } = forceLayout({
          cells: newCells,
          fixedPosition: true,
          center: [
            (canvasWidth / 2 - transform.x) / transform.k,
            (canvasHeight / 2 - transform.y) / transform.k,
          ],
        }));
      }

      for (const cell of newCells) {
        if (isNodeCell(cell)) {
          const view = getNodeView(cell.id);
          cell.view.x = view.x;
          cell.view.y = view.y;
        }
      }
    }
  }

  return { cells: newCells, updated: updateCandidates, shouldReCenter };
}
