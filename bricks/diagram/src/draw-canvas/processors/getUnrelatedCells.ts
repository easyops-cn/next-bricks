import type { ActiveTarget, Cell, ConnectLineState } from "../interfaces";
import { targetIsActive } from "./targetIsActive";

export function getUnrelatedCells(
  cells: Cell[],
  connectLineState: ConnectLineState | null,
  activeTarget: ActiveTarget | null,
  allowEdgeToArea?: boolean
): Cell[] {
  const unrelated: Cell[] = [];
  if (connectLineState) {
    const existedTargets = new Set<string>();
    for (const cell of cells) {
      if (cell.type === "edge" && cell.source === connectLineState.source.id) {
        existedTargets.add(cell.target);
      }
    }
    for (const cell of cells) {
      switch (cell.type) {
        case "node":
          if (existedTargets.has(cell.id)) {
            unrelated.push(cell);
          }
          break;
        case "decorator":
          if (
            !allowEdgeToArea ||
            cell.decorator == "text" ||
            existedTargets.has(cell.id)
          ) {
            unrelated.push(cell);
          }
          break;
        default:
          unrelated.push(cell);
      }
    }
  } else {
    switch (activeTarget?.type) {
      case "multi": {
        const nodesMap = new Map<string, Cell>();
        const activeNodeIds = new Set<string>();
        const relatedNodeIds = new Set<string>();
        for (const active of activeTarget.targets) {
          if (active.type === "node") {
            activeNodeIds.add(active.id);
            relatedNodeIds.add(active.id);
          }
        }
        for (const cell of cells) {
          if (cell.type === "node") {
            nodesMap.set(cell.id, cell);
          } else if (cell.type === "edge") {
            if (activeNodeIds.has(cell.source)) {
              relatedNodeIds.add(cell.target);
            } else if (activeNodeIds.has(cell.target)) {
              relatedNodeIds.add(cell.source);
            } else if (!targetIsActive(cell, activeTarget)) {
              unrelated.push(cell);
            }
          } else if (!targetIsActive(cell, activeTarget)) {
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
              ? targetIsActive(cell, activeTarget)
              : cell.type === "node" &&
                (cell.id === activeTarget.source ||
                  cell.id === activeTarget.target))
          ) {
            unrelated.push(cell);
          }
        }
        break;
    }
  }

  return unrelated;
}
