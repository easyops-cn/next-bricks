import type {
  DiagramEdge,
  NormalizedLine,
  RenderedEdge,
  RenderedLine,
} from "../interfaces";
import { curveLine } from "../lines/curveLine";

export function getRenderedLines(
  renderedEdges: RenderedEdge[],
  normalizedLines: NormalizedLine[]
): RenderedLine[] {
  const renderedMap = new WeakMap<DiagramEdge, RenderedEdge>();
  for (const renderedEdge of renderedEdges) {
    renderedMap.set(renderedEdge.data, renderedEdge);
  }
  return normalizedLines
    .map(({ line, edge, ...rest }) => {
      const renderedEdge = renderedMap.get(edge);
      if (!renderedEdge) {
        return;
      }
      const d = curveLine(
        renderedEdge.points,
        line.arrow ? -5 : 0,
        line.curveType
      );
      return {
        ...rest,
        line,
        edge,
        d,
      };
    })
    .filter(Boolean) as RenderedLine[];
}
