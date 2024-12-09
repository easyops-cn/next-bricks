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
  draggable?: boolean;
  ctrlDraggable?: boolean;
  scaleRange?: RangeTuple;
  onSwitchActiveTarget?(target: ActiveTarget | null): void;
}

export interface UseZoomResult {
  grabbing: boolean;
  transform: TransformLiteral;
  scaleRange: RangeTuple;
  zoomer: ZoomBehavior<SVGSVGElement, unknown>;
}

function wheelData(event: WheelEvent) {
  // Keep factor for pinch event as 10 as d3-zoom default behavior,
  // but set factor to 1 for normal wheel event even if ctrlKey is true.
  // Because on Windows with normal mouse, deltaY is too big when ctrlKey is pressed,
  // which cause the zooming too fast.

  // However, there seems no standard way to distinguish the pinch event on Mac OS
  // from normal wheel event. Here is a workaround.
  // The pinch event is emitted as a wheel event with ctrlKey set to true, and deltaX is always -0,
  // and deltaY is a float number. While normal wheel event has deltaY as integer.
  const pinching =
    event.ctrlKey &&
    Object.is(event.deltaX, -0) &&
    String(event.deltaY).includes(".");
  // console.log(pinching, event.deltaX, event.deltaY);

  return (
    -event.deltaY *
    (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) *
    (pinching ? 10 : 1)
  );
}

export function useZoom({
  rootRef,
  zoomable,
  scrollable,
  pannable,
  draggable,
  ctrlDraggable,
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

  const zoomer = useMemo(
    () => zoom<SVGSVGElement, unknown>().wheelDelta(wheelData),
    []
  );

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
      })
      .filter(
        (event) =>
          (event.type === "wheel" ||
            (ctrlDraggable ? draggable || event.ctrlKey : !event.ctrlKey)) &&
          !event.button
      );
  }, [
    onSwitchActiveTarget,
    scaleRange,
    zoomable,
    zoomer,
    ctrlDraggable,
    draggable,
  ]);

  useEffect(() => {
    if (ctrlDraggable) {
      const onContextMenu = (e: MouseEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      };
      document.addEventListener("contextmenu", onContextMenu, true);
      return () => {
        document.removeEventListener("contextmenu", onContextMenu, true);
      };
    }
  }, [ctrlDraggable]);

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
      .on("wheel", (e: WheelEvent) => {
        e.preventDefault();
      })
      .on("dblclick.zoom", null);

    if ((!draggable && !ctrlDraggable) || !pannable) {
      rootSelection.on("mousedown.zoom", null);
    }

    if (!pannable) {
      rootSelection
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
    }

    return unsetZoom;
  }, [
    ctrlDraggable,
    draggable,
    pannable,
    rootRef,
    scrollable,
    zoomable,
    zoomer,
  ]);

  return { grabbing, transform, zoomer, scaleRange };
}
