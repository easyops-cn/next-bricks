import type { SizeTuple } from "../../diagram/interfaces";
import type { Cell, InitialCell, NodeCell, NodeId } from "../interfaces";
import { isEdgeCell, isNodeCell } from "./asserts";
import { initializeCells } from "./initializeCells";

export function updateCells({
  cells,
  defaultNodeSize,
  reason,
  parent,
}: {
  cells: InitialCell[];
  defaultNodeSize: SizeTuple;
  reason?: "add-related-nodes";
  parent?: NodeId;
}): {
  cells: Cell[];
  updated: Cell[];
} {
  const newCells = initializeCells(cells, { defaultNodeSize });
  const updateCandidates: NodeCell[] = [];
  if (reason === "add-related-nodes" && parent) {
    // Place these unpositioned downstream nodes below the parent node, and
    // on the right side of the positioned siblings.
    const nodesMap = new Map<string, NodeCell>();
    const downstreamNodeIds = new Set<string>();
    for (const cell of newCells) {
      if (isNodeCell(cell)) {
        nodesMap.set(cell.id, cell);
      } else if (isEdgeCell(cell)) {
        if (cell.source === parent && cell.target !== parent) {
          downstreamNodeIds.add(cell.target);
        }
      }
    }
    const parentNode = nodesMap.get(parent);
    if (parentNode?.view.x !== undefined && parentNode.view.y !== undefined) {
      const downstreamNodes = [...downstreamNodeIds]
        .map((id) => nodesMap.get(id))
        .filter(Boolean) as NodeCell[];
      let rightMostNode: NodeCell | undefined = undefined;
      for (const node of downstreamNodes) {
        if (node.view.x !== undefined && node.view.y !== undefined) {
          // Positioned nodes
          if (!rightMostNode || node.view.x > rightMostNode.view.x) {
            rightMostNode = node;
          }
        } else {
          // Unpositioned nodes
          updateCandidates.push(node);
        }
      }
      if (updateCandidates.length > 0) {
        const gap = 20;
        let nextX: number;
        let nextY: number;
        if (rightMostNode) {
          // Place unpositioned nodes on the right side of the rightmost positioned siblings.
          nextX = rightMostNode.view.x + rightMostNode.view.width + gap;
          nextY = rightMostNode.view.y;
        } else {
          // If there are no positioned siblings, just place them below the parent.
          const totalWidth = updateCandidates.reduce(
            (acc, node) => acc + node.view.width + gap,
            -gap
          );
          nextX =
            parentNode.view.x - totalWidth / 2 + parentNode.view.width / 2;
          nextY = parentNode.view.y + parentNode.view.height + gap;
        }
        for (const node of updateCandidates) {
          node.view.x = nextX;
          node.view.y = nextY;
          nextX += node.view.width + gap;
        }
      }
    }
  }
  return { cells: newCells, updated: updateCandidates };
}
