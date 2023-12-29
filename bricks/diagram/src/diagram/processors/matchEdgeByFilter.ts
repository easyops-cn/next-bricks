import { checkIfByTransform } from "@next-core/runtime";
import type { DiagramEdge, LineConf } from "../interfaces";

export function matchEdgeByFilter(
  edge: DiagramEdge,
  filter: LineConf
): boolean {
  if (!filter) {
    return false;
  }
  if (filter.edgeType) {
    return ([] as string[]).concat(filter.edgeType).includes(edge.type!);
  }
  return checkIfByTransform(filter, { edge });
}
