import React, { useEffect, useState } from "react";
import { select } from "d3-selection";
import { ZoomTransform, type ZoomBehavior } from "d3-zoom";
import type { RangeTuple } from "../../diagram/interfaces";
import { SYMBOL_FOR_SIZE_INITIALIZED } from "../../draw-canvas/constants";
import type { Cell } from "../../draw-canvas/interfaces";
import {
  isDecoratorCell,
  isNodeCell,
} from "../../draw-canvas/processors/asserts";
import { transformToCenter } from "../../draw-canvas/processors/transformToCenter";

export interface UseAutoCenterOptions {
  rootRef: React.RefObject<SVGSVGElement>;
  cells: Cell[];
  zoomable?: boolean;
  zoomer: ZoomBehavior<SVGSVGElement, unknown>;
  scaleRange: RangeTuple;
}

export type UseAutoCenterResult = [
  centered: boolean,
  setCentered: React.Dispatch<React.SetStateAction<boolean>>,
];

export function useAutoCenter({
  rootRef,
  cells,
  zoomable,
  zoomer,
  scaleRange,
}: UseAutoCenterOptions): UseAutoCenterResult {
  const [centered, setCentered] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      centered ||
      !cells.some((cell) => isNodeCell(cell) || isDecoratorCell(cell)) ||
      cells.some(
        (cell) => isNodeCell(cell) && !cell[SYMBOL_FOR_SIZE_INITIALIZED]
      )
    ) {
      return;
    }
    const { k, x, y } = transformToCenter(cells, {
      canvasWidth: root.clientWidth,
      canvasHeight: root.clientHeight,
      scaleRange: zoomable ? scaleRange : undefined,
    });
    // istanbul ignore next
    if (process.env.NODE_ENV !== "test") {
      // jsdom doesn't support svg baseVal yet.
      // https://github.com/jsdom/jsdom/issues/2531
      zoomer.transform(select(root), new ZoomTransform(k, x, y));
    }
    setCentered(true);
  }, [cells, centered, rootRef, scaleRange, zoomable, zoomer]);

  useEffect(() => {
    // Reset auto centering when nodes and decorators are all removed.
    if (!cells.some((cell) => isNodeCell(cell) || isDecoratorCell(cell))) {
      setCentered(false);
    }
  }, [cells]);

  return [centered, setCentered];
}
