import { describe, test, expect, jest } from "@jest/globals";
import { matchPath } from "./utils.jsx";

describe("matchPath should work", () => {
  it.each<[string[] | undefined, string | undefined, boolean]>([
    [undefined, undefined, false],
    [["0.0"], "0", true],
    [["0.1.0"], "0", true],
    [["0.0.1"], "0", true],
    [["0.1.0"], "0.1", true],
    [["1.0"], "0", false],
    [["1.0"], "1", true],
    [["1.0.2"], "1.0.2", true],
    [["1.2.3.4"], "1.0.2", false],
    [["1.2.3"], "1.2.3.4", false],
    [["0.0", "2.0.2", "3.0", "4"], "2", true],
    [["0.0", "2.0.2", "3.0", "4"], "3.0", true],
  ])("basic usige", (paths, id, result) => {
    expect(matchPath(paths, id)).toBe(result);
  });
});
