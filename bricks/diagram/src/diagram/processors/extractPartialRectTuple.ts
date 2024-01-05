import type { FullRectTuple, PartialRectTuple } from "../interfaces";

export function extractPartialRectTuple(
  value: PartialRectTuple
): FullRectTuple {
  if (Array.isArray(value)) {
    const v0 = value[0];
    const v1 = value.length > 1 ? value[1]! : v0;
    const v2 = value.length > 2 ? value[2]! : v0;
    const v3 = value.length > 3 ? value[3]! : v1;
    return [v0, v1, v2, v3];
  }
  return new Array(4).fill(value) as FullRectTuple;
}
