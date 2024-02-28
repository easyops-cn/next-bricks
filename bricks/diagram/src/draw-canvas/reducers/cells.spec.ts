import { describe, test, expect } from "@jest/globals";
import { cells } from "./cells";

describe("cells reducer", () => {
  test("drop node", () => {
    expect(
      cells([], { type: "drop-node", payload: { id: "1" } as any })
    ).toEqual([{ id: "1" }]);
  });

  test("add nodes", () => {
    expect(
      cells([{ id: "2" } as any], {
        type: "add-nodes",
        payload: [{ id: "3" }] as any,
      })
    ).toEqual([{ id: "2" }, { id: "3" }]);
  });

  test("add edge", () => {
    const newCells = cells([{ type: "node", id: "2" } as any], {
      type: "add-edge",
      payload: { type: "edge", source: "1", target: "2" },
    });
    expect(newCells).toEqual([
      {
        source: "1",
        target: "2",
        type: "edge",
      },
      {
        id: "2",
        type: "node",
      },
    ]);
    expect(
      cells(newCells, {
        type: "add-edge",
        payload: { type: "edge", source: "1", target: "3" },
      })
    ).toEqual([
      {
        source: "1",
        target: "2",
        type: "edge",
      },
      {
        source: "1",
        target: "3",
        type: "edge",
      },
      {
        id: "2",
        type: "node",
      },
    ]);
  });

  test("unknown actions", () => {
    expect(
      cells([{ id: "x" } as any], {
        type: "unknown",
        payload: { id: "z" },
      } as any)
    ).toEqual([{ id: "x" }]);
  });
});
