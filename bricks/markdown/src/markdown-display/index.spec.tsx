import React from "react";
import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { MarkdownDisplay } from "./index.js";

jest.mock("@next-shared/markdown", () => ({
  MarkdownComponent: jest.fn((props: { content?: string }) => (
    <div>{props.content}</div>
  )),
}));
jest.mock("@next-core/theme", () => ({}));

describe("eo-markdown-display", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-markdown-display"
    ) as MarkdownDisplay;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
