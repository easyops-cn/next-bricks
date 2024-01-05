import type { RenderedLine, RenderedLineLabel } from "../interfaces";

export function getRenderedLineLabels(
  previous: RenderedLineLabel[],
  renderedLines: RenderedLine[],
  linePaths: Map<string, SVGPathElement | null>
) {
  if (previous.length === 0 && renderedLines.length === 0) {
    return previous;
  }
  return renderedLines
    .map(({ line: { text, label, $id }, edge }) => {
      const path = linePaths.get($id);
      if ((!text && !label) || !path || !path.getAttribute("d")) {
        return;
      }

      // istanbul ignore next
      const { x, y, width, height } =
        process.env.NODE_ENV === "test"
          ? { x: 10, y: 20, width: 300, height: 400 }
          : path.getBBox();
      // Make redundant extra padding.
      const padding = 1000;
      const left = x - padding;
      const top = y - padding;
      const right = x + width + padding;
      const bottom = y + height + padding;

      // istanbul ignore next
      const point =
        process.env.NODE_ENV === "test"
          ? { x: 50, y: 50 }
          : path.getPointAtLength(path.getTotalLength() / 2);
      return {
        text,
        label,
        edge,
        position: [point.x, point.y],
        lineRect: { left, top, right, bottom },
        id: $id,
      };
    })
    .filter(Boolean) as RenderedLineLabel[];
}
