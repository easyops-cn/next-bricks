import { BaseNodeCell } from "../interfaces";

export function computeContainerRect(cells: BaseNodeCell[]) {
  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;
  cells.forEach((cell) => {
    const { x, y, width, height } = cell.view;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + width > maxX) maxX = x + width;
    if (y + height > maxY) maxY = y + height;
  });
  if (![minX, maxX, minY, maxY].some((n) => isFinite(n))) return {};
  const padding = 20;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  return {
    x: minX - padding,
    y: minY - padding,
    width: width,
    height: height,
  };
}
