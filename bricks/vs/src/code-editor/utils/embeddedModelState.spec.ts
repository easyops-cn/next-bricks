import { describe, test, expect } from "@jest/globals";
import { EmbeddedModelContext } from "./embeddedModelState.js";

describe("EmbeddedModelContext", () => {
  test("should work", () => {
    const embeddedModelContext = EmbeddedModelContext.getInstance("id-01");

    embeddedModelContext.updateState({
      content: "const a = 123; ",
      offset: 4,
      range: {
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: 1,
        endColumn: 15,
      },
    });

    expect(embeddedModelContext.getState()).toEqual({
      content: "const a = 123; ",
      offset: 4,
      range: {
        endColumn: 15,
        endLineNumber: 1,
        startColumn: 1,
        startLineNumber: 1,
      },
    });

    expect(EmbeddedModelContext.getInstance("id-01")).toEqual(
      embeddedModelContext
    );
  });
});
