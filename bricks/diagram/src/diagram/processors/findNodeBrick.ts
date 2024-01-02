import { checkIfByTransform } from "@next-core/runtime";
import { NodeBrickConf, DiagramNode } from "../interfaces";

export function findNodeBrick(
  node: DiagramNode,
  nodeBricks: NodeBrickConf[] | undefined
): NodeBrickConf | undefined {
  return nodeBricks?.find((item) => {
    if (item.nodeType) {
      return ([] as unknown[]).concat(item.nodeType).includes(node.type);
    }
    return checkIfByTransform(item, { node });
  });
}
