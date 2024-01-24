// istanbul ignore file: experimental
import type {
  DiagramEdge,
  LabelSize,
  RefRepository,
  RenderedNode,
} from "../interfaces";
import { getDirectLinePoints } from "../lines/getDirectLinePoints";

export function getRenderedEdges(
  edges: DiagramEdge[] | undefined,
  {
    getNode,
    normalizedLinesMap,
    lineLabelsRefRepository,
  }: {
    getNode(id: string): RenderedNode | undefined;
    normalizedLinesMap: WeakMap<DiagramEdge, string>;
    lineLabelsRefRepository: RefRepository;
  }
) {
  return (
    edges?.map((edge) => {
      const source = getNode(edge.source)!;
      const target = getNode(edge.target)!;
      const points = getDirectLinePoints(source, target);
      let angle: number | undefined;
      if (points) {
        const start = points[0];
        const end = points[points.length - 1];
        angle = Math.atan2(end.y - start.y, end.x - start.x);
      }

      const lineId = normalizedLinesMap.get(edge);
      const labelSize: LabelSize = {};
      if (lineId) {
        for (const placement of [/* "center", */ "start", "end"] as const) {
          const element = lineLabelsRefRepository.get(`${lineId}-${placement}`);
          if (element) {
            labelSize[placement] = [element.offsetWidth, element.offsetHeight];
          }
        }
      }

      return {
        data: edge,
        points,
        angle,
        labelSize,
      };
    }) ?? []
  );
}
