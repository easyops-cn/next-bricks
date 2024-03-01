import { describe, test, expect } from "@jest/globals";
import { handleKeyboard } from "./handleKeyboard";
import type { Cell } from "../interfaces";

describe("handleKeyboard", () => {
  const cells = [
    {
      type: "node",
      id: "a",
    },
    {
      type: "decorator",
      id: "b",
    },
  ] as unknown as Cell[];

  test("delete node", () => {
    const action = handleKeyboard(
      new KeyboardEvent("keydown", { key: "Backspace" }),
      {
        cells,
        activeTarget: {
          type: "node",
          id: "a",
        },
      }
    );
    expect(action).toEqual({
      action: "delete-cell",
      cell: { type: "node", id: "a" },
    });
  });

  test("delete decorator", () => {
    const action = handleKeyboard(
      new KeyboardEvent("keydown", { key: "Backspace" }),
      {
        cells,
        activeTarget: {
          type: "decorator",
          id: "b",
        },
      }
    );
    expect(action).toEqual({
      action: "delete-cell",
      cell: { type: "decorator", id: "b" },
    });
  });

  test("no active node", () => {
    const action = handleKeyboard(
      new KeyboardEvent("keydown", { key: "Backspace" }),
      {
        cells,
        activeTarget: undefined,
      }
    );
    expect(action).toBe(undefined);
  });

  test("unknown key", () => {
    const action = handleKeyboard(
      new KeyboardEvent("keydown", { key: "Escape" }),
      {
        cells,
        activeTarget: {
          type: "node",
          id: "a",
        },
      }
    );
    expect(action).toBe(undefined);
  });
});
