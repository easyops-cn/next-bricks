import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { RawDataPreview } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("visual-builder.raw-data-preview", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.raw-data-preview"
    ) as RawDataPreview;

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
