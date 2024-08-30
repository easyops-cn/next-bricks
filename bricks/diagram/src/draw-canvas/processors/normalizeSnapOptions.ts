import {
  DEFAULT_SNAP_GRID_SIZE,
  DEFAULT_SNAP_OBJECT_DISTANCE,
} from "../constants";
import type {
  SnapOptions,
  SnapToGridOptions,
  SnapToObjectOptions,
} from "../interfaces";

export interface NormalizedSnapOptions {
  grid: Required<SnapToGridOptions> | null;
  object: Required<SnapToObjectOptions> | null;
}

export function normalizeSnapOptions(
  snap: boolean | SnapOptions | undefined
): NormalizedSnapOptions {
  const intermediateSnap = snap
    ? snap === true
      ? { grid: true, object: true }
      : snap
    : null;
  const snapToGrid = intermediateSnap?.grid
    ? intermediateSnap.grid === true
      ? {}
      : intermediateSnap.grid
    : null;
  const snapToObject = intermediateSnap?.object
    ? intermediateSnap.object === true
      ? {}
      : intermediateSnap.object
    : null;
  return {
    grid: snapToGrid
      ? { size: snapToGrid.size ?? DEFAULT_SNAP_GRID_SIZE }
      : null,
    object: snapToObject
      ? { distance: snapToObject.distance ?? DEFAULT_SNAP_OBJECT_DISTANCE }
      : null,
  };
}
