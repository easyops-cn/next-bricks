import { describe, test, expect } from "@jest/globals";
import { cells } from "./cells";

describe("cells reducer", () => {
  test("drop node", () => {
    expect(
      cells([], { type: "drop-node", payload: { id: "1" } as any })
    ).toEqual([{ id: "1" }]);
  });

  test("add node", () => {
    expect(
      cells([{ id: "2" } as any], {
        type: "add-node",
        payload: { id: "3" } as any,
      })
    ).toEqual([{ id: "2" }]);
  });
});
