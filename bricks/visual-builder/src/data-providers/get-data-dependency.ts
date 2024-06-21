import { createProviderClass } from "@next-core/utils/general";
import { collectMemberUsage, MemberUsage } from "@next-core/utils/storyboard";
import { ContextConf } from "@next-core/types";

export function getDataDependency(
  contextConfs: ContextConf[],
  keyword: string
): Map<ContextConf, MemberUsage> {
  const depsMap = new Map<ContextConf, MemberUsage>();

  for (const contextConf of contextConfs) {
    const stats = collectMemberUsage(
      [contextConf.if, contextConf.value, contextConf.resolve],
      keyword
    );
    depsMap.set(contextConf, stats);
  }

  return depsMap;
}

customElements.define(
  "visual-builder.get-data-deps",
  createProviderClass(getDataDependency)
);
