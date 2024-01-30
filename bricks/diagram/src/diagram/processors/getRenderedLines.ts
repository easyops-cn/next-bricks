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
    .map(({ line, edge, markers, ...rest }) => {
      const renderedEdge = renderedMap.get(edge);
      if (!renderedEdge) {
        return;
      }
      const endMarker = markers.find(
        (marker) => marker.variant === "default" && marker.placement === "end"
      );
      const d = curveLine(
        renderedEdge.points,
        endMarker?.offset ?? 0,
        line.curveType
      );
      return {
        ...rest,
        markers,
        line,
        edge,
        d,
        angle: renderedEdge.angle,
        labelSize: renderedEdge.labelSize,
      };
    })
    .filter(Boolean) as RenderedLine[];
}
