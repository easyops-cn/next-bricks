import { formatOptions } from "./formatOptions.js";
import { describe, test, expect } from "@jest/globals";

describe("formatOptions", () => {
  test("should work", () => {
    expect(formatOptions(["a", "b"])).toEqual([
      { label: "a", value: "a" },
      { label: "b", value: "b" },
    ]);

    expect(formatOptions([1, 2])).toEqual([
      { label: 1, value: 1 },
      { label: 2, value: 2 },
    ]);

    expect(formatOptions([true, false])).toEqual([
      { label: "true", value: true },
      { label: "false", value: false },
    ]);

    expect(
      formatOptions([
        { label: "a", value: "a" },
        { label: "a", value: "a" },
      ])
    ).toEqual([
      { label: "a", value: "a" },
      { label: "a", value: "a" },
    ]);

    expect(
      formatOptions(
        [
          { text: "text-a", key: "key-a" },
          { text: "text-b", key: "key-b" },
        ],
        { label: "text", value: "key" }
      )
    ).toEqual([
      { label: "text-a", value: "key-a", text: "text-a", key: "key-a" },
      { label: "text-b", value: "key-b", text: "text-b", key: "key-b" },
    ]);
  });
});
