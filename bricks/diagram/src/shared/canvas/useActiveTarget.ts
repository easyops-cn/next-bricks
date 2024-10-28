import React, { useEffect, useRef, useState } from "react";
import type { ActiveTarget } from "../../draw-canvas/interfaces";
import { sameTarget } from "../../draw-canvas/processors/sameTarget";

export interface UseActiveTargetOptions {
  rootRef: React.RefObject<SVGGElement>;
  activeTarget?: ActiveTarget | null;
  doNotResetActiveTargetForSelector?: string;
  doNotResetActiveTargetOutsideCanvas?: boolean;
  onActiveTargetChange(target: ActiveTarget | null): void;
}

export type UseActiveTargetResult = ActiveTarget | null;

export function useActiveTarget({
  rootRef,
  activeTarget: _activeTarget,
  doNotResetActiveTargetForSelector,
  doNotResetActiveTargetOutsideCanvas,
  onActiveTargetChange,
}: UseActiveTargetOptions): UseActiveTargetResult {
  const newActiveTarget = _activeTarget ?? null;
  const [activeTarget, setActiveTarget] = useState<ActiveTarget | null>(
    newActiveTarget
  );

  useEffect(() => {
    setActiveTarget((previous) =>
      sameTarget(previous, newActiveTarget) ? previous : newActiveTarget
    );
  }, [newActiveTarget]);

  const activeTargetChangeInitialized = useRef(false);
  useEffect(() => {
    if (!activeTargetChangeInitialized.current) {
      activeTargetChangeInitialized.current = true;
      return;
    }
    onActiveTargetChange(activeTarget);
  }, [activeTarget, onActiveTargetChange]);

  useEffect(() => {
    if (!activeTarget) {
      return;
    }
    const resetActiveTarget = (e: MouseEvent) => {
      const path = e.composedPath();
      const rootIndex = path.indexOf(rootRef.current!);
      // Reset active target to null when clicking outside of the cells container,
      // Or inside the cells container but not on any cell.
      if (
        doNotResetActiveTargetOutsideCanvas
          ? rootIndex === 0
          : rootIndex <= 0 &&
            !(
              doNotResetActiveTargetForSelector &&
              path.some(
                (el) =>
                  el instanceof Element &&
                  el.matches(doNotResetActiveTargetForSelector)
              )
            )
      ) {
        setActiveTarget(null);
      }
    };
    document.addEventListener("click", resetActiveTarget);
    return () => {
      document.removeEventListener("click", resetActiveTarget);
    };
  }, [
    activeTarget,
    doNotResetActiveTargetOutsideCanvas,
    doNotResetActiveTargetForSelector,
    rootRef,
  ]);

  return activeTarget;
}
