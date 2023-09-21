import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import ResizeObserver from "resize-observer-polyfill";
import "./";
import { CodeEditor } from "./index.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("./workers/index.js", () => ({
  VSWorkers: {
    getInstance: () => ({
      addEventListener: () => ({}),
      removeEventListener: () => ({}),
    }),
  },
}));

global.ResizeObserver = ResizeObserver as any;

describe("vs.code-editor", () => {
  test("basic usage", async () => {
    const element = document.createElement("vs.code-editor") as CodeEditor;
    element.value = "Hi";

    expect(element.childNodes.length).toBe(0);

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.childNodes.length).toBe(1);

    expect(monaco.editor.setTheme).toBeCalledWith("vs");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.childNodes.length).toBe(0);
  });

  test("fit content", async () => {
    const element = document.createElement("vs.code-editor") as CodeEditor;
    element.value = "Hi";
    element.theme = "vs-dark";
    element.automaticLayout = "fit-content";

    expect(element.childNodes.length).toBe(0);

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.childNodes.length).toBe(1);

    expect(monaco.editor.setTheme).toBeCalledWith("vs-dark");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.childNodes.length).toBe(0);
  });

  test("fit container", async () => {
    const element = document.createElement("vs.code-editor") as CodeEditor;
    element.value = "Hi";
    element.automaticLayout = "fit-container";

    expect(element.childNodes.length).toBe(0);

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.childNodes.length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.childNodes.length).toBe(0);
  });
});
