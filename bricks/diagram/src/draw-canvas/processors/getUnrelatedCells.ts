import type { ActiveTarget, Cell } from "../interfaces";
import { sameTarget } from "./sameTarget";

export function getUnrelatedCells(
  cells: Cell[],
  activeTarget: ActiveTarget | null
): Cell[] {
  const unrelated: Cell[] = [];

  switch (activeTarget?.type) {
    case "node": {
      const nodesMap = new Map<string, Cell>();
      const relatedNodeIds = new Set<string>([activeTarget.id]);
      for (const cell of cells) {
        if (cell.type === "node") {
          nodesMap.set(cell.id, cell);
        } else if (cell.type === "edge") {
          if (cell.source === activeTarget.id) {
            relatedNodeIds.add(cell.target);
          } else if (cell.target === activeTarget.id) {
            relatedNodeIds.add(cell.source);
          } else {
            unrelated.push(cell);
          }
        } else {
          unrelated.push(cell);
        }
      }
      for (const [id, cell] of nodesMap) {
        if (!relatedNodeIds.has(id)) {
          unrelated.push(cell);
        }
      }
      break;
    }

    case "edge":
      for (const cell of cells) {
        if (
          !(cell.type === "edge"
            ? sameTarget(cell, activeTarget)
            : cell.type === "node" &&
              (cell.id === activeTarget.source ||
                cell.id === activeTarget.target))
        ) {
          unrelated.push(cell);
        }
      }
      break;

    case "decorator":
      for (const cell of cells) {
        if (cell.type !== "decorator" || cell.id !== activeTarget.id) {
          unrelated.push(cell);
        }
      }
      break;
  }

  return unrelated;
}
