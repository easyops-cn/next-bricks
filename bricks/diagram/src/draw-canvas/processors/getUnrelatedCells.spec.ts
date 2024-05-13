import { describe, test, expect } from "@jest/globals";
import { getUnrelatedCells } from "./getUnrelatedCells";
import type { ActiveTarget, Cell } from "../interfaces";

describe("getUnrelatedCells", () => {
  const cells = [
    { id: "1", type: "node" },
    { id: "2", type: "node" },
    { id: "3", type: "node" },
    { id: "4", type: "node" },
    { id: "4", type: "edge", source: "1", target: "2" },
    { id: "5", type: "edge", source: "2", target: "3" },
    { id: "6", type: "edge", source: "3", target: "4" },
    { id: "7", type: "edge", source: "4", target: "1" },
    { id: "8", type: "decorator" },
    { id: "9", type: "decorator" },
  ] as Cell[];

  test("active target is node", () => {
    const activeTarget = { type: "node", id: "2" } as ActiveTarget;
    const unrelated = getUnrelatedCells(cells, null, activeTarget);
    expect(unrelated).toEqual([
      { id: "6", type: "edge", source: "3", target: "4" },
      { id: "7", type: "edge", source: "4", target: "1" },
      { id: "8", type: "decorator" },
      { id: "9", type: "decorator" },
      { id: "4", type: "node" },
    ]);
  });

  test("active target is edge", () => {
    const activeTarget = {
      type: "edge",
      source: "1",
      target: "2",
    } as ActiveTarget;
    const unrelated = getUnrelatedCells(cells, null, activeTarget);
    expect(unrelated).toEqual([
      { id: "3", type: "node" },
      { id: "4", type: "node" },
      { id: "5", type: "edge", source: "2", target: "3" },
      { id: "6", type: "edge", source: "3", target: "4" },
      { id: "7", type: "edge", source: "4", target: "1" },
      { id: "8", type: "decorator" },
      { id: "9", type: "decorator" },
    ]);
  });

  test("active target is decorator", () => {
    const activeTarget = { id: "8", type: "decorator" } as ActiveTarget;
    const unrelated = getUnrelatedCells(cells, null, activeTarget);
    expect(unrelated).toEqual([]);
  });

  test("active target is null", () => {
    const unrelated = getUnrelatedCells(cells, null, null);
    expect(unrelated).toEqual([]);
  });

  test("connect line state is not null", () => {
    const connectLineState = { source: { id: "1" } } as any;
    const unrelated = getUnrelatedCells(cells, connectLineState, null);
    expect(unrelated).toEqual([
      { id: "2", type: "node" },
      { id: "4", type: "edge", source: "1", target: "2" },
      { id: "5", type: "edge", source: "2", target: "3" },
      { id: "6", type: "edge", source: "3", target: "4" },
      { id: "7", type: "edge", source: "4", target: "1" },
      { id: "8", type: "decorator" },
      { id: "9", type: "decorator" },
    ]);
  });
  test("connect line state is area", () => {
    const connectLineState = { source: { id: "8" } } as any;
    const unrelated = getUnrelatedCells(cells, connectLineState, null, true);
    expect(unrelated).toEqual([
      { id: "4", type: "edge", source: "1", target: "2" },
      { id: "5", type: "edge", source: "2", target: "3" },
      { id: "6", type: "edge", source: "3", target: "4" },
      { id: "7", type: "edge", source: "4", target: "1" },
    ]);
  });
});
