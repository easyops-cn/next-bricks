import type {
  ActiveTarget,
  ActiveTargetOfEdge,
  ActiveTargetOfMulti,
  ActiveTargetOfNode,
} from "../interfaces";

export function sameTarget(
  a: ActiveTarget | null | undefined,
  b: ActiveTarget | null | undefined
): boolean {
  return a
    ? !!b &&
        a.type === b.type &&
        (a.type === "multi"
          ? a.targets.length === (b as ActiveTargetOfMulti).targets.length &&
            a.targets.every((targetA) =>
              (b as ActiveTargetOfMulti).targets.some((targetB) =>
                sameTarget(targetA, targetB)
              )
            )
          : a.type === "node" || a.type === "decorator"
            ? a.id === (b as ActiveTargetOfNode).id
            : a.source === (b as ActiveTargetOfEdge).source &&
              a.target === (b as ActiveTargetOfEdge).target)
    : !b;
}
