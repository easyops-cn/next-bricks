import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { PreviewContainer } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("ui-test.preview-container", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "ui-test.preview-container"
    ) as PreviewContainer;

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
