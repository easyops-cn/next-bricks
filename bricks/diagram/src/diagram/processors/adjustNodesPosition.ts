import type { FullRectTuple, RefRepository, RenderedNode } from "../interfaces";

export function adjustNodesPosition(
  nodes: RenderedNode[],
  nodesRefRepository: RefRepository,
  nodePaddings: FullRectTuple
) {
  for (const node of nodes) {
    const x = node.x - node.width / 2 + nodePaddings[3];
    const y = node.y - node.height / 2 + nodePaddings[0];

    const nodeContainer = nodesRefRepository.get(node.id)?.parentElement;
    if (nodeContainer) {
      nodeContainer.style.left = `${x}px`;
      nodeContainer.style.top = `${y}px`;
      nodeContainer.style.visibility = "visible";
    }
  }
}
