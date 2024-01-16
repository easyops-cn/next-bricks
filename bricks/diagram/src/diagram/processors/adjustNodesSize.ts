import type { FullRectTuple, RefRepository, RenderedNode } from "../interfaces";

export function adjustNodesSize(
  nodes: RenderedNode[],
  nodesRefRepository: RefRepository,
  nodePaddings: FullRectTuple
) {
  for (const node of nodes) {
    const element = nodesRefRepository.get(node.id);
    node.width =
      (element?.offsetWidth ?? 10) + nodePaddings[1] + nodePaddings[3];
    node.height =
      (element?.offsetHeight ?? 10) + nodePaddings[0] + nodePaddings[2];
  }
}
