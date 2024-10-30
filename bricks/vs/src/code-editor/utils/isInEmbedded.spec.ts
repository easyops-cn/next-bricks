import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { isInEmbedded } from "./isInEmbedded";

jest.mock("monaco-editor/esm/vs/editor/editor.api.js", () => ({
  ...jest.requireActual("monaco-editor/esm/vs/editor/editor.api.js"),
}));

describe("isInEmbedded", () => {
  test("non <% %>", () => {
    const model = monaco.editor.createModel("test", "yaml");
    expect(isInEmbedded(model, new monaco.Position(1, 1))).toBe(false);
  });

  test("multiple <% %>", () => {
    const model = monaco.editor.createModel("<%  %>\n\n<%  %>", "yaml");
    expect(isInEmbedded(model, new monaco.Position(1, 4))).toBe(true);
    expect(isInEmbedded(model, new monaco.Position(2, 1))).toBe(false);
    expect(isInEmbedded(model, new monaco.Position(3, 4))).toBe(true);
  });

  test("after <% %>", () => {
    const model = monaco.editor.createModel("<%  %>\n", "yaml");
    expect(isInEmbedded(model, new monaco.Position(2, 1))).toBe(false);
  });

  test("before <% %>", () => {
    const model = monaco.editor.createModel("\n<%  %>", "yaml");
    expect(isInEmbedded(model, new monaco.Position(1, 1))).toBe(false);
  });

  test("unterminated before <% %>", () => {
    const model = monaco.editor.createModel("<%  \n\n<% %>", "yaml");
    expect(isInEmbedded(model, new monaco.Position(2, 1))).toBe(false);
  });
});
