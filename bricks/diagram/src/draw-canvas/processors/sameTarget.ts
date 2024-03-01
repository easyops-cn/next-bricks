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
          ? a.id === (b as ActiveTargetOfNode).id
          : a.source === (b as ActiveTargetOfEdge).source &&
            a.target === (b as ActiveTargetOfEdge).target)
    : !b;
}
