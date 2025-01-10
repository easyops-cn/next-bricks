import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import ResizeObserver from "resize-observer-polyfill";
import "./";
import { CodeEditor } from "./index.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/react-runtime");
jest.mock("./workers/yamlLinter", () => ({}));

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

    expect(monaco.editor.setTheme).toBeCalledWith("custom-theme");
    expect(monaco.editor.defineTheme).toBeCalledWith("custom-theme", {
      base: "vs",
      colors: { "editor.lineHighlightBackground": "#0000000A" },
      inherit: true,
      rules: [],
    });

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

    expect(monaco.editor.setTheme).toBeCalledWith("custom-theme");
    expect(monaco.editor.defineTheme).toBeCalledWith("custom-theme", {
      base: "vs-dark",
      colors: { "editor.lineHighlightBackground": "#FFFFFF0F" },
      inherit: true,
      rules: [],
    });

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

  test("toolbar", async () => {
    const element = document.createElement("vs.code-editor") as CodeEditor;
    element.value = "Copy";
    element.automaticLayout = "fit-container";
    element.showCopyButton = true;
    element.showExpandButton = true;

    expect(element.childNodes.length).toBe(0);

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.childNodes.length).toBe(1);

    expect(element.querySelector(".copy-icon")).toBeTruthy();
    expect(element.querySelector(".expand-icon")).toBeTruthy();

    act(() => {
      (element.querySelector(".expand-icon") as HTMLElement).click();
    });

    expect(
      element
        .querySelector(".code-editor-wrapper")
        ?.classList.contains("expanded")
    ).toBeTruthy();

    act(() => {
      (element.querySelector(".expand-icon") as HTMLElement).click();
    });

    expect(
      element
        .querySelector(".code-editor-wrapper")
        ?.classList.contains("expanded")
    ).toBeFalsy();

    act(() => {
      (element.querySelector(".expand-icon") as HTMLElement).click();
    });

    expect(
      element
        .querySelector(".code-editor-wrapper")
        ?.classList.contains("expanded")
    ).toBeTruthy();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(
      element
        .querySelector(".code-editor-wrapper")
        ?.classList.contains("expanded")
    ).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.childNodes.length).toBe(0);
  });
});
