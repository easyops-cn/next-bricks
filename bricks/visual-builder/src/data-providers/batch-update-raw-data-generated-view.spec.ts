import { describe, test, expect } from "@jest/globals";
import { batchUpdateRawDataGeneratedView } from "./batch-update-raw-data-generated-view.js";

describe("batchUpdateRawDataGeneratedView", () => {
  test("should work", async () => {
    expect(await batchUpdateRawDataGeneratedView()).toBe(undefined);
  });
});
