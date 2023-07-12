import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { MarkdownEditor } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@milkdown/core", () => ({}));
jest.mock("@milkdown/react", () => ({ MilkdownProvider: jest.fn() }));
jest.mock("@milkdown/preset-commonmark", () => ({}));
jest.mock("@milkdown/theme-nord", () => ({}));
jest.mock("@milkdown/plugin-history", () => ({}));
jest.mock("@milkdown/plugin-upload", () => ({}));
jest.mock("@milkdown/utils", () => ({ $ctx: jest.fn() }));
jest.mock("@milkdown/prose/model", () => ({}));
jest.mock("@milkdown/plugin-listener", () => ({}));
jest.mock("@milkdown/preset-gfm", () => ({}));
jest.mock("@milkdown/plugin-indent", () => ({}));
jest.mock("@milkdown/ctx", () => ({}));
jest.mock("@prosemirror-adapter/react", () => ({
  ProsemirrorAdapterProvider: jest.fn(),
}));
jest.mock("@milkdown/plugin-tooltip", () => ({ tooltipFactory: jest.fn() }));
jest.mock("@milkdown/prose/state", () => ({}));
jest.mock("@milkdown/prose/tables", () => ({}));
jest.mock("@milkdown/prose/view", () => ({}));

describe("eo-markdown-editor", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-markdown-editor"
    ) as MarkdownEditor;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.value = "# Markdown";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
