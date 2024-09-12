import React, { useEffect, useRef, useState } from "react";
import type { ActiveTarget } from "../../draw-canvas/interfaces";
import { sameTarget } from "../../draw-canvas/processors/sameTarget";

export interface UseActiveTargetOptions {
  rootRef: React.RefObject<SVGGElement>;
  activeTarget?: ActiveTarget | null;
  onActiveTargetChange(target: ActiveTarget | null): void;
}

export type UseActiveTargetResult = ActiveTarget | null;

export function useActiveTarget({
  rootRef,
  activeTarget: _activeTarget,
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
      if (rootIndex <= 0) {
        setActiveTarget(null);
      }
    };
    document.addEventListener("click", resetActiveTarget);
    return () => {
      document.removeEventListener("click", resetActiveTarget);
    };
  }, [activeTarget, rootRef]);

  return activeTarget;
}
