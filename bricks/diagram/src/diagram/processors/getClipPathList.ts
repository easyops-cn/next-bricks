import type {
  LineTextClipPath,
  RefRepository,
  RenderedLineLabel,
} from "../interfaces";

export function getClipPathList(
  renderedLineLabels: RenderedLineLabel[],
  lineLabelsRefRepository: RefRepository
) {
  return renderedLineLabels
    .map(({ id, lineId, placement }) => {
      if (!lineLabelsRefRepository || placement !== "center") {
        return;
      }
      const element = lineLabelsRefRepository.get(id);
      if (!element) {
        return;
      }
      const { offsetWidth, offsetHeight } = element;
      // Do not clip when the label takes no space.
      if (
        process.env.NODE_ENV !== "test" &&
        (offsetWidth === 0 || offsetHeight === 0)
      ) {
        return;
      }
      const padding = 3;
      return {
        x0: element.offsetLeft - offsetWidth / 2 - padding,
        y0: element.offsetTop - offsetHeight / 2 - padding,
        w: offsetWidth + padding * 2,
        h: offsetHeight + padding * 2,
        lineId,
      };
    })
    .filter(Boolean) as LineTextClipPath[];
}
