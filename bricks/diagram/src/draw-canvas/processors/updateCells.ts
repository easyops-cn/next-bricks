import type { SizeTuple, TransformLiteral } from "../../diagram/interfaces";
import { DEFAULT_NODE_GAP, SYMBOL_FOR_SIZE_INITIALIZED } from "../constants";
import type {
  Cell,
  InitialCell,
  NodeCell,
  NodeId,
  NodeView,
} from "../interfaces";
import { isEdgeCell, isNodeCell } from "./asserts";
import { initializeCells } from "./initializeCells";

export function updateCells({
  cells,
  previousCells,
  defaultNodeSize,
  canvasHeight,
  transform,
  reason,
  parent,
}: {
  cells: InitialCell[];
  previousCells: Cell[];
  defaultNodeSize: SizeTuple;
  canvasHeight: number;
  transform: TransformLiteral;
  reason?: "add-related-nodes";
  parent?: NodeId;
}): {
  cells: Cell[];
  updated: Cell[];
} {
  const newCells = initializeCells(cells, { defaultNodeSize });
  const updateCandidates: NodeCell[] = [];

  const previousSizeInitializedNodes = new Map<string, NodeCell>();
  for (const cell of previousCells) {
    if (isNodeCell(cell) && cell[SYMBOL_FOR_SIZE_INITIALIZED]) {
      previousSizeInitializedNodes.set(cell.id, cell);
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
      if (updateCandidates.length > 0) {
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
    const occupiedViews: NodeView[] = [];
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
          occupiedViews.push(cell.view);
        }
      }
    }

    const deltaX = maxWidth + DEFAULT_NODE_GAP;
    const deltaY = maxHeight + DEFAULT_NODE_GAP;

    const occupiedIndexes = new Set<string>();
    for (const view of occupiedViews) {
      const x0 = Math.floor((view.x + transform.x / transform.k) / deltaX);
      const y0 = Math.floor((view.y + transform.y / transform.k) / deltaY);
      const x1 = Math.floor(
        (view.x + transform.x / transform.k + view.width) / deltaX
      );
      const y1 = Math.floor(
        (view.y + transform.y / transform.k + view.height) / deltaY
      );

      for (let i = x0; i <= x1; i++) {
        for (let j = y0; j <= y1; j++) {
          occupiedIndexes.add(`${i},${j}`);
        }
      }
    }

    const scaledDeltaX = deltaX * transform.k;
    const scaledDeltaY = deltaY * transform.k;
    const rows = Math.max(1, Math.floor(canvasHeight / scaledDeltaY));
    let i = 0;
    for (const node of updateCandidates) {
      let xIndex: number;
      let yIndex: number;
      do {
        xIndex = Math.floor(i / rows);
        yIndex = i % rows;
        i++;
      } while (occupiedIndexes.has(`${xIndex},${yIndex}`));

      node.view.x =
        (xIndex * scaledDeltaX - transform.x) / transform.k +
        DEFAULT_NODE_GAP / 2;
      node.view.y =
        (yIndex * scaledDeltaY - transform.y) / transform.k +
        DEFAULT_NODE_GAP / 2;
    }
  }

  return { cells: newCells, updated: updateCandidates };
}
