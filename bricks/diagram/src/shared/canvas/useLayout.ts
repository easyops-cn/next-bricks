import { useEffect, useRef, useState } from "react";
import type { ZoomBehavior } from "d3-zoom";
import type {
  Cell,
  LayoutOptions,
  LayoutOptionsForce,
  LayoutOptionsDagre,
  LayoutType,
  NodeId,
  NodeView,
} from "../../draw-canvas/interfaces";
import type { FullRectTuple, RangeTuple } from "../../diagram/interfaces";
import { useAutoCenter } from "./useAutoCenter";
import {
  isNodeCell,
  isNodeOrEdgeCell,
} from "../../draw-canvas/processors/asserts";
import {
  SYMBOL_FOR_LAYOUT_INITIALIZED,
  SYMBOL_FOR_SIZE_INITIALIZED,
} from "../../draw-canvas/constants";
import type { DrawCanvasAction } from "../../draw-canvas/reducers/interfaces";
import { forceLayout } from "./forceLayout";
import { dagreLayout } from "./dagreLayout";

export interface UseLayoutOptions {
  layout: LayoutType;
  layoutOptions?: LayoutOptions;
  rootRef: React.RefObject<SVGSVGElement>;
  cells: Cell[];
  zoomable?: boolean;
  zoomer: ZoomBehavior<SVGSVGElement, unknown>;
  scaleRange: RangeTuple;
  dispatch: (value: DrawCanvasAction) => void;
}

export function useLayout({
  layout,
  layoutOptions,
  rootRef,
  cells,
  zoomable,
  zoomer,
  scaleRange,
  dispatch,
}: UseLayoutOptions) {
  const [layoutInitialized, setLayoutInitialized] = useState(
    layout !== "force" && layout !== "dagre"
  );

  const [centered, setCentered] = useAutoCenter({
    rootRef,
    layoutInitialized,
    cells,
    zoomable,
    zoomer,
    scaleRange,
  });

  const previousLayoutRef = useRef<Cell[] | null>(null);

  useEffect(() => {
    // Wait for all nodes to be size-initialized before layout.
    if (
      cells.some(
        (cell) => isNodeCell(cell) && !cell[SYMBOL_FOR_SIZE_INITIALIZED]
      )
    ) {
      return;
    }

    if (layout !== "force" && layout !== "dagre") {
      setLayoutInitialized(true);
      return;
    }

    // Do not re-layout if nodes and edges not changed.
    if (
      isSameArray(previousLayoutRef.current, cells.filter(isNodeOrEdgeCell))
    ) {
      return;
    }

    let getNodeView: (id: NodeId) => NodeView;
    let nodePaddings: FullRectTuple;

    if (layout === "force") {
      ({ getNodeView, nodePaddings } = forceLayout({
        cells,
        layoutOptions: layoutOptions as LayoutOptionsForce,
      }));
    } else {
      ({ getNodeView, nodePaddings } = dagreLayout({
        cells,
        layoutOptions: layoutOptions as LayoutOptionsDagre,
      }));
    }

    const newCells: Cell[] = cells.map((cell) => {
      if (isNodeCell(cell)) {
        const nodeView = getNodeView(cell.id);
        return {
          ...cell,
          view: {
            ...cell.view,
            x: nodeView.x! - nodeView.width / 2 + nodePaddings[3],
            y: nodeView.y! - nodeView.height / 2 + nodePaddings[0],
          },
          [SYMBOL_FOR_LAYOUT_INITIALIZED]: true,
        };
      }
      return cell;
    });
    previousLayoutRef.current = newCells.filter(isNodeOrEdgeCell);
    dispatch({ type: "update-cells", payload: newCells });

    setCentered(false);
    setLayoutInitialized(true);
  }, [cells, dispatch, layout, layoutOptions, setCentered]);

  return { centered, setCentered };
}

function isSameArray<T = unknown>(a: T[] | null, b: T[]): boolean {
  return a?.length === b.length && a.every((v, i) => v === b[i]);
}
