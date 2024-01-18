import type {
  LineLabelConf,
  RenderedLine,
  RenderedLineLabel,
  TextOptions,
} from "../interfaces";

export function getRenderedLineLabels(
  previous: RenderedLineLabel[],
  renderedLines: RenderedLine[],
  linePaths: Map<string, SVGPathElement | null>
) {
  if (previous.length === 0 && renderedLines.length === 0) {
    return previous;
  }
  return renderedLines.flatMap(
    ({ line: { text, label, $id }, edge, labelSize, angle }) => {
      const path = linePaths.get($id);
      if ((!text && !label) || !path || !path.getAttribute("d")) {
        return [] as RenderedLineLabel[];
      }

      let key: "label" | "text";
      let list: LineLabelConf[] | TextOptions[];
      if (label) {
        key = "label";
        list = ([] as LineLabelConf[]).concat(label);
      } else {
        key = "text";
        list = ([] as TextOptions[]).concat(text!);
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
      const pathLength =
        process.env.NODE_ENV === "test" ? 50 : path.getTotalLength();

      return list.map<RenderedLineLabel>((item) => {
        const placement = item.placement ?? "center";
        const offset = 0;
        // istanbul ignore next
        const point =
          process.env.NODE_ENV === "test"
            ? { x: 50, y: 50 }
            : path.getPointAtLength(
                placement === "start"
                  ? Math.min(offset, pathLength / 2)
                  : placement === "end"
                    ? Math.max(pathLength - offset, pathLength / 2)
                    : pathLength / 2
              );

        return {
          [key as "label"]: item as LineLabelConf,
          edge,
          position: [point.x, point.y],
          lineRect: { left, top, right, bottom },
          id: `${$id}-${placement}`,
          lineId: $id,
          placement,
          angle,
          size: labelSize?.[placement],
        };
      });
    }
  );
}
