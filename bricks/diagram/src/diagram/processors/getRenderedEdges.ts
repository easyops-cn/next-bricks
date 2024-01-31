// istanbul ignore file: experimental
import type {
  DiagramEdge,
  LabelSize,
  RefRepository,
  RenderedEdge,
} from "../interfaces";

export function getRenderedEdges(
  edges: DiagramEdge[] | undefined,
  {
    normalizedLinesMap,
    lineLabelsRefRepository,
  }: {
    normalizedLinesMap: WeakMap<DiagramEdge, string>;
    lineLabelsRefRepository: RefRepository;
  }
) {
  return (
    edges?.map<RenderedEdge>((edge) => {
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
        labelSize,
      };
    }) ?? []
  );
}
