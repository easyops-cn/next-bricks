import { createProviderClass } from "@next-core/utils/general";
import {
  type StoryboardNode,
  parseStoryboard,
  traverse,
} from "@next-core/storyboard";
import {
  Storyboard,
  UseProviderResolveConf,
  UseProviderEventHandler,
} from "@next-core/types";

function collect(nodeOrNodes: StoryboardNode | StoryboardNode[]): Set<string> {
  const collection = new Set<string>();

  traverse(nodeOrNodes, (node) => {
    switch (node.type) {
      case "Resolvable":
      case "EventHandler": {
        const useProvider = (
          node.raw as UseProviderResolveConf | UseProviderEventHandler
        )?.useProvider;
        if (useProvider) {
          collection.add(useProvider);
        }
      }
    }
  });

  return collection;
}

export function collectUsedContracts(storyboard: Storyboard): string[] {
  const collection = collect(parseStoryboard(storyboard as any));

  const contracts = [];

  for (const item of collection) {
    if (item.includes("@")) {
      contracts.push(item);
    }
  }

  return contracts;
}

customElements.define(
  "visual-builder.collect-used-contracts",
  createProviderClass(collectUsedContracts)
);
