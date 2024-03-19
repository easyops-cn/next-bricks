import { useMemo } from "react";
import type { Cell, LayoutType } from "../../draw-canvas/interfaces";
import { isNodeCell } from "../../draw-canvas/processors/asserts";
import {
  SYMBOL_FOR_LAYOUT_INITIALIZED,
  SYMBOL_FOR_SIZE_INITIALIZED,
} from "../../draw-canvas/constants";

export interface UseReadyOptions {
  cells: Cell[];
  layout: LayoutType;
  centered: boolean;
}

export function useReady({ cells, layout, centered }: UseReadyOptions) {
  const ready = useMemo(
    () =>
      centered &&
      cells.every(
        (cell) =>
          !isNodeCell(cell) ||
          (cell[SYMBOL_FOR_SIZE_INITIALIZED] &&
            ((layout !== "force" && layout !== "dagre") ||
              cell[SYMBOL_FOR_LAYOUT_INITIALIZED]))
      ),
    [cells, centered, layout]
  );
  return ready;
}
