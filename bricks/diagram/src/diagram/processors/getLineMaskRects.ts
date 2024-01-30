import type {
  LineMaskRects,
  RefRepository,
  RenderedLineLabel,
} from "../interfaces";

export function getLineMaskRects(
  renderedLineLabels: RenderedLineLabel[],
  lineLabelsRefRepository: RefRepository
) {
  const map: LineMaskRects = new Map();

  for (const { id, lineId, placement } of renderedLineLabels) {
    if (!lineLabelsRefRepository || placement !== "center") {
      continue;
    }
    const element = lineLabelsRefRepository.get(id);
    if (!element) {
      continue;
    }
    const { offsetWidth, offsetHeight } = element;
    // Do not mask out when the label takes no space.
    if (
      process.env.NODE_ENV !== "test" &&
      (offsetWidth === 0 || offsetHeight === 0)
    ) {
      continue;
    }
    const padding = 3;
    let rects = map.get(lineId);
    if (!rects) {
      map.set(lineId, (rects = []));
    }

    rects.push({
      x: element.offsetLeft - offsetWidth / 2 - padding,
      y: element.offsetTop - offsetHeight / 2 - padding,
      width: offsetWidth + padding * 2,
      height: offsetHeight + padding * 2,
    });
  }

  return map;
}
