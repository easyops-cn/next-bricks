import { normalizeSnapOptions } from "./normalizeSnapOptions";
import {
  DEFAULT_SNAP_GRID_SIZE,
  DEFAULT_SNAP_OBJECT_DISTANCE,
  DEFAULT_SNAP_OBJECT_POSITIONS,
} from "../constants";

describe("normalizeSnapOptions", () => {
  test("should return null for undefined snap", () => {
    const result = normalizeSnapOptions(undefined);
    expect(result).toEqual({
      grid: null,
      object: null,
    });
  });

  test("should return null for false snap", () => {
    const result = normalizeSnapOptions(false);
    expect(result).toEqual({
      grid: null,
      object: null,
    });
  });

  test("should return default snap options for true snap", () => {
    const result = normalizeSnapOptions(true);
    expect(result).toEqual({
      grid: {
        size: DEFAULT_SNAP_GRID_SIZE,
      },
      object: {
        distance: DEFAULT_SNAP_OBJECT_DISTANCE,
        positions: DEFAULT_SNAP_OBJECT_POSITIONS,
      },
    });
  });

  test("should return custom snap options", () => {
    const snapOptions = {
      grid: {
        size: 15,
      },
      object: {
        distance: 20,
        positions: "center",
      },
    };
    const result = normalizeSnapOptions(snapOptions);
    expect(result).toEqual({
      grid: {
        size: 15,
      },
      object: {
        distance: 20,
        positions: "center",
      },
    });
  });

  test("should return default grid size for true grid", () => {
    const snapOptions = {
      grid: true,
    };
    const result = normalizeSnapOptions(snapOptions);
    expect(result).toEqual({
      grid: {
        size: DEFAULT_SNAP_GRID_SIZE,
      },
      object: null,
    });
  });

  test("should return default object distance for true object", () => {
    const snapOptions = {
      object: true,
    };
    const result = normalizeSnapOptions(snapOptions);
    expect(result).toEqual({
      grid: null,
      object: {
        distance: DEFAULT_SNAP_OBJECT_DISTANCE,
        positions: DEFAULT_SNAP_OBJECT_POSITIONS,
      },
    });
  });

  test("should return default grid size for undefined grid size", () => {
    const snapOptions = {
      grid: {},
      object: {
        distance: 20,
      },
    };
    const result = normalizeSnapOptions(snapOptions);
    expect(result).toEqual({
      grid: {
        size: DEFAULT_SNAP_GRID_SIZE,
      },
      object: {
        distance: 20,
        positions: DEFAULT_SNAP_OBJECT_POSITIONS,
      },
    });
  });

  test("should return default object distance for undefined object distance", () => {
    const snapOptions = {
      grid: {
        size: 15,
      },
      object: {},
    };
    const result = normalizeSnapOptions(snapOptions);
    expect(result).toEqual({
      grid: {
        size: 15,
      },
      object: {
        distance: DEFAULT_SNAP_OBJECT_DISTANCE,
        positions: DEFAULT_SNAP_OBJECT_POSITIONS,
      },
    });
  });
});
