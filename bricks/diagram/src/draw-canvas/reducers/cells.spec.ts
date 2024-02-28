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

  test("add edges", () => {
    expect(
      cells([{ id: "x" } as any], {
        type: "add-edges",
        payload: { id: "z" } as any,
      })
    ).toEqual([{ id: "x" }]);
  });
});
