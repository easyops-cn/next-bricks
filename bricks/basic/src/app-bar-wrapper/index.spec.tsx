import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { EoAppBarWrapper } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-app-bar-wrapper", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-app-bar-wrapper"
    ) as EoAppBarWrapper;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelectorAll(".left").length).toBe(1);
    expect(element.shadowRoot?.querySelectorAll(".right").length).toBe(1);
    expect(element.shadowRoot?.querySelectorAll(".fixed").length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("static position", async () => {
    const element = document.createElement(
      "eo-app-bar-wrapper"
    ) as EoAppBarWrapper;
    element.position = "static";

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelectorAll(".static").length).toBe(1);

    // Also test legacy non-fixed position.
    element.position = undefined;
    element.isFixed = false;
    await act(() => (global as any).flushPromises());
    expect(element.shadowRoot?.querySelectorAll(".absolute").length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
