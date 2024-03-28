import { describe, test, expect } from "@jest/globals";
import { normalizeAlignOrigin } from "./normalizeAlignOrigin";
import type { AlignOrigin, NormalizedAlignOrigin } from "../interfaces";

describe("normalizeAlignOrigin", () => {
  test.each<[AlignOrigin | undefined, NormalizedAlignOrigin]>([
    [undefined, [0.5, 0.5]],
    [
      [0.25, 0.75],
      [0.25, 0.75],
    ],
    [
      ["center", "center"],
      [0.5, 0.5],
    ],
    [
      ["left", "bottom"],
      [0, 1],
    ],
    [
      ["right", "top"],
      [1, 0],
    ],
    [
      ["20%", "80%"],
      [0.2, 0.8],
    ],
  ])("normalizeAlignOrigin(%j) should return %j", (input, output) => {
    expect(normalizeAlignOrigin(input)).toEqual(output);
  });

  test("should throw error when unexpected align origin", () => {
    const consoleError = jest.spyOn(console, "error").mockReturnValue();
    expect(normalizeAlignOrigin(["unknown", false] as any)).toEqual([0.5, 0.5]);
    expect(consoleError).toBeCalledTimes(2);
    expect(consoleError).toHaveBeenNthCalledWith(
      1,
      "Unexpected align origin %s:",
      "x",
      "unknown"
    );
    expect(consoleError).toHaveBeenNthCalledWith(
      2,
      "Unexpected align origin %s, expected %s, received %s:",
      "y",
      "string | number",
      "boolean",
      false
    );
    consoleError.mockRestore();
  });
});
