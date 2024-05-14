import type { ActiveTarget, ActiveTargetOfSingular } from "../interfaces";
import { sameTarget } from "./sameTarget";

export function targetIsActive(
  target: ActiveTargetOfSingular,
  activeTarget: ActiveTarget | null | undefined
): boolean {
  return (
    !!activeTarget &&
    (activeTarget.type === "multi"
      ? activeTarget.targets
      : [activeTarget]
    ).some((active) => sameTarget(active, target))
  );
}
