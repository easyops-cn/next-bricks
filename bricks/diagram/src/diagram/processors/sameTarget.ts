import type {
  ActiveTarget,
  ActiveTargetOfEdge,
  ActiveTargetOfNode,
} from "../interfaces";

export function sameTarget(
  a: ActiveTarget | null | undefined,
  b: ActiveTarget | null | undefined
): boolean {
  return a
    ? !!b &&
        a.type === b.type &&
        (a.type === "node"
          ? a.nodeId === (b as ActiveTargetOfNode).nodeId
          : a.edge.source === (b as ActiveTargetOfEdge).edge.source &&
            a.edge.target === (b as ActiveTargetOfEdge).edge.target)
    : !b;
}
