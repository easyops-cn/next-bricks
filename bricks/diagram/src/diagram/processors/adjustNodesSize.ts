import type { FullRectTuple, RefRepository, RenderedNode } from "../interfaces";

export function adjustNodesSize(
  nodes: RenderedNode[],
  nodesRefRepository: RefRepository,
  nodePaddings: FullRectTuple
) {
  for (const node of nodes) {
    const element = nodesRefRepository.get(node.id);
    node.width =
      Math.max(element?.offsetWidth ?? 0, 10) +
      nodePaddings[1] +
      nodePaddings[3];
    node.height =
      Math.max(element?.offsetHeight ?? 0, 10) +
      nodePaddings[0] +
      nodePaddings[2];
  }
}
