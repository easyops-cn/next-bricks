import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { Viewport } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-viewport", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-viewport") as Viewport;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    const metaTag = document.querySelector('meta[name="viewport"]');
    expect(metaTag?.getAttribute("content")).toBe(
      "width=device-width, initial-scale=1"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.querySelector('meta[name="viewport"]')).toBeNull();
  });

  test("props", () => {
    const element = document.createElement("eo-viewport") as Viewport;
    element.width = "1000px";
    element.initialScale = 2;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    const metaTag = document.querySelector('meta[name="viewport"]');
    expect(metaTag?.getAttribute("content")).toBe(
      "width=1000px, initial-scale=2"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.querySelector('meta[name="viewport"]')).toBeNull();
  });
});
