import { describe, test, expect } from "@jest/globals";
import { applyUIVersion } from "./apply-ui-version.js";

describe("basic usige", () => {
  test("should work", async () => {
    expect(await applyUIVersion("8.2")).toBe(undefined);
  });
});
