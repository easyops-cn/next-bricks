import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { NavLogo } from "./index.js";
import { getRuntime } from "@next-core/runtime";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/runtime");

const mockGetBrandSettings = jest.fn();
const mockGetRuntime = getRuntime as jest.Mock;
mockGetRuntime.mockReturnValue({
  getBrandSettings: mockGetBrandSettings,
});

describe("nav.nav-logo", () => {
  test("basic usage", async () => {
    mockGetBrandSettings.mockReturnValueOnce({});
    const element = document.createElement("nav.nav-logo") as NavLogo;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector("eo-link")).toBeTruthy();
    expect(element.shadowRoot?.querySelector("eo-icon")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("brand setting", async () => {
    mockGetBrandSettings.mockReturnValueOnce({
      menu_bar_logo_no_link: "true",
      menu_bar_logo_url: "/test.png",
    });
    const element = document.createElement("nav.nav-logo") as NavLogo;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector("eo-link")).toBeFalsy();
    expect(element.shadowRoot?.querySelector("img")?.getAttribute("src")).toBe(
      "/test.png"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
