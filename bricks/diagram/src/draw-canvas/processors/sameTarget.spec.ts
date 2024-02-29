import { describe, test, expect } from "@jest/globals";
import { sameTarget } from "./sameTarget";
import type { ActiveTarget } from "../interfaces";

describe("sameTarget", () => {
  test("should return true if both targets are null", () => {
    const result = sameTarget(null, null);
    expect(result).toBe(true);
  });

  test("should return true if both targets have the same node id", () => {
    const target1: ActiveTarget = { type: "node", id: "target1" };
    const target2: ActiveTarget = { type: "node", id: "target1" };
    const result = sameTarget(target1, target2);
    expect(result).toBe(true);
  });

  test("should return false if both targets have different node ids", () => {
    const target1: ActiveTarget = { type: "node", id: "target1" };
    const target2: ActiveTarget = { type: "node", id: "target2" };
    const result = sameTarget(target1, target2);
    expect(result).toBe(false);
  });

  test("should return true if both targets are the same edge", () => {
    const target1: ActiveTarget = {
      type: "edge",
      source: "1",
      target: "2",
    };
    const target2: ActiveTarget = {
      type: "edge",
      source: "1",
      target: "2",
    };
    const result = sameTarget(target1, target2);
    expect(result).toBe(true);
  });

  test("should return false if both targets are different edges", () => {
    const target1: ActiveTarget = {
      type: "edge",
      source: "1",
      target: "2",
    };
    const target2: ActiveTarget = {
      type: "edge",
      source: "1",
      target: "3",
    };
    const result = sameTarget(target1, target2);
    expect(result).toBe(false);
  });
});
