import { describe, test, expect } from "@jest/globals";
import { getTreeData } from "./get-tree-data.js";

describe("getTreeData", () => {
  test("should work", async () => {
    expect(await getTreeData()).toBe(undefined);
  });
});
