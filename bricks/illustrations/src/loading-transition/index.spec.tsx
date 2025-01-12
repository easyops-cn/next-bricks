import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { LoadingTransition } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("illustrations.loading-transition", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "illustrations.loading-transition"
    ) as LoadingTransition;

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
