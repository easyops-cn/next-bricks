import React, { useEffect, useMemo, useState } from "react";
import { select } from "d3-selection";
import { zoom, type ZoomBehavior } from "d3-zoom";
import type { RangeTuple, TransformLiteral } from "../../diagram/interfaces";
import {
  DEFAULT_SCALE_RANGE_MIN,
  DEFAULT_SCALE_RANGE_MAX,
} from "../../draw-canvas/constants";
import type { ActiveTarget } from "../../draw-canvas/interfaces";

export interface UseZoomOptions {
  rootRef: React.RefObject<SVGSVGElement>;
  zoomable?: boolean;
  scrollable?: boolean;
  pannable?: boolean;
  scaleRange?: RangeTuple;
  onSwitchActiveTarget?(target: ActiveTarget | null): void;
}

export interface UseZoomResult {
  grabbing: boolean;
  transform: TransformLiteral;
  scaleRange: RangeTuple;
  zoomer: ZoomBehavior<SVGSVGElement, unknown>;
}

export function useZoom({
  rootRef,
  zoomable,
  scrollable,
  pannable,
  scaleRange: _scaleRange,
  onSwitchActiveTarget,
}: UseZoomOptions): UseZoomResult {
  const [grabbing, setGrabbing] = useState(false);
  const [transform, setTransform] = useState<TransformLiteral>({
    k: 1,
    x: 0,
    y: 0,
  });

  const scaleRange = useMemo(
    () =>
      _scaleRange ??
      ([DEFAULT_SCALE_RANGE_MIN, DEFAULT_SCALE_RANGE_MAX] as RangeTuple),
    [_scaleRange]
  );

  const zoomer = useMemo(() => zoom<SVGSVGElement, unknown>(), []);

  // istanbul ignore next: d3-zoom currently hard to test
  useEffect(() => {
    let moved = false;
    zoomer
      .scaleExtent(zoomable ? scaleRange : [1, 1])
      .on("start", () => {
        moved = false;
        setGrabbing(true);
      })
      .on("zoom", (e: { transform: TransformLiteral }) => {
        moved = true;
        setTransform(e.transform);
      })
      .on("end", () => {
        setGrabbing(false);
        if (!moved) {
          onSwitchActiveTarget?.(null);
        }
      });
  }, [onSwitchActiveTarget, scaleRange, zoomable, zoomer]);

  // istanbul ignore next: d3-zoom currently hard to test
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const rootSelection = select(root);

    const unsetZoom = () => {
      rootSelection
        .on(".zoom", null)
        .on(".zoom.custom", null)
        .on("wheel", null);
    };

    if (!(zoomable || scrollable || pannable)) {
      unsetZoom();
      return;
    }

    if (zoomable || scrollable) {
      // Do not override default d3 zoom handler.
      // Only handles *panning*
      rootSelection.on(
        "wheel.zoom.custom",
        (e: WheelEvent & { wheelDeltaX: number; wheelDeltaY: number }) => {
          // Mac OS trackpad pinch event is emitted as a wheel.zoom and d3.event.ctrlKey set to true
          if (!e.ctrlKey) {
            // Stop immediate propagation for default d3 zoom handler
            e.stopImmediatePropagation();
            if (scrollable) {
              e.preventDefault();
              zoomer.translateBy(
                rootSelection,
                e.wheelDeltaX / 5,
                e.wheelDeltaY / 5
              );
            }
          }
          // zoomer.scaleBy(rootSelection, Math.pow(2, defaultWheelDelta(e)))
        }
      );
    }

    rootSelection
      .call(zoomer)
      .on("wheel", (e: WheelEvent) => e.preventDefault())
      .on("dblclick.zoom", null)
      .on("mousedown.zoom", null);

    if (!pannable) {
      rootSelection
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
    }

    return unsetZoom;
  }, [pannable, rootRef, scrollable, zoomable, zoomer]);

  return { grabbing, transform, zoomer, scaleRange };
}
