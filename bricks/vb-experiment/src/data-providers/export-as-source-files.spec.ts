import { describe, test, expect } from "@jest/globals";
import { exportAsSourceFiles } from "./export-as-source-files.js";

describe("exportAsSourceFiles", () => {
  test("should work", async () => {
    expect(await exportAsSourceFiles()).toBe(undefined);
  });
});
