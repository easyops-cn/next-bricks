import type { NodeRect } from "../interfaces";

export function doTwoNodesOverlap(
  a: NodeRect,
  b: NodeRect,
  paddingA: number,
  paddingB: number
): boolean {
  const A = paddingA ? getNodesWithPadding(a, paddingA) : a;
  const B = paddingB ? getNodesWithPadding(b, paddingB) : b;
  const left = Math.min(A.x - A.width / 2, B.x - B.width / 2);
  const right = Math.max(A.x + A.width / 2, B.x + B.width / 2);
  const top = Math.min(A.y - A.height / 2, B.y - B.height / 2);
  const bottom = Math.max(A.y + A.height / 2, B.y + B.height / 2);
  return right - left < A.width + B.width && bottom - top < A.height + B.height;
}

function getNodesWithPadding(node: NodeRect, padding: number) {
  return {
    x: node.x - node.width / 2 - padding,
    y: node.y - node.height / 2 - padding,
    width: node.width + padding * 2,
    height: node.height + padding * 2,
  };
}
