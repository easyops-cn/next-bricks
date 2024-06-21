import { describe, test, expect } from "@jest/globals";
import { checkEditorByName } from "./check-editor-by-name.js";

const mockCustomEditors = new Map();
mockCustomEditors.set("eo-button-editor", () => {
  return "mock";
});

jest.mock("@next-core/runtime", () => ({
  __secret_internals: {
    loadEditors: () => {},
  },
  customEditors: {
    get: (name: string) => mockCustomEditors.get(name),
  },
}));

describe("checkEditorByName", () => {
  test("should match editor", async () => {
    expect(await checkEditorByName("eo-button-editor")).toBe(true);
  });

  test("should not match editor", async () => {
    expect(await checkEditorByName("eo-test-editor")).toBe(false);
  });
});
