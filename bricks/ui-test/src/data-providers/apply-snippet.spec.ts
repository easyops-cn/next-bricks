import { describe, test, expect } from "@jest/globals";
import { applySnippet } from "./apply-snippet.js";
import { createNodes } from "./shared/createNodes.js";

jest.mock("./shared/createNodes.js");

describe("applySnippet", () => {
  test("should work", async () => {
    await applySnippet({ nodes: [], parent: "p_0" });
    expect(createNodes).toBeCalledWith([], "p_0", undefined);
  });
});
