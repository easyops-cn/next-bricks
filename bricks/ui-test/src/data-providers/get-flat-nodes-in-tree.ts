import { createProviderClass } from "@next-core/utils/general";
import type { NodeType, TestTreeData } from "../interface.js";

export interface FlatNode {
  type: NodeType;
  display: string;
  instanceId: string;
  initialSort?: number;
}

export function getFlatNodesInTree(tree: TestTreeData): FlatNode[] {
  const nodes: FlatNode[] = [];
  function walk(n: TestTreeData) {
    nodes.push({
      type: n.data.type,
      display: n.name,
      instanceId: n.data.instanceId,
      initialSort: n.children.length
        ? (n.children[n.children.length - 1].data.sort ?? 0) + 1
        : 0,
    });
    for (const child of n.children) {
      walk(child);
    }
  }
  walk(tree);
  return nodes;
}

customElements.define(
  "ui-test.get-flat-nodes-in-tree",
  createProviderClass(getFlatNodesInTree)
);
