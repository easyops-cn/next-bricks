import type { AlignOrigin, NormalizedAlignOrigin } from "../interfaces";

const KeywordMap = new Map([
  ["center", 0.5],
  ["left", 0],
  ["right", 1],
  ["top", 0],
  ["bottom", 1],
]);

export function normalizeAlignOrigin(
  alignOrigin: AlignOrigin | undefined
): NormalizedAlignOrigin {
  const origin = alignOrigin ?? [0.5, 0.5];
  return [
    normalizeAlignAxis(origin[0], "x"),
    normalizeAlignAxis(origin[1], "y"),
  ];
}

function normalizeAlignAxis(value: string | number, axis: "x" | "y"): number {
  if (typeof value === "string") {
    const newX = KeywordMap.get(value);
    if (newX !== undefined) {
      return newX;
    }
    const matches = value.match(/^(-?\d+(?:\.\d+)?)%$/);
    if (matches) {
      return Number(matches[1]) / 100;
    }
    // eslint-disable-next-line no-console
    console.error("Unexpected align origin %s:", axis, value);
  } else if (typeof value === "number") {
    return value;
  } else {
    // eslint-disable-next-line no-console
    console.error(
      "Unexpected align origin %s, expected %s, received %s:",
      axis,
      "string | number",
      typeof value,
      value
    );
  }

  return 0.5;
}
