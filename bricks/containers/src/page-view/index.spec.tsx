import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoPageView } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const disconnect = jest.fn();
(global.IntersectionObserver as any) = jest.fn((callback: any) => ({
  observe() {
    callback([{ intersectionRatio: 0.99 }]);
  },
  disconnect,
}));

describe("eo-page-view", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-page-view") as EoPageView;

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

  test("footer", async () => {
    const element = document.createElement("eo-page-view") as EoPageView;
    element.narrow = "small";

    act(() => {
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot?.querySelector(".footer").classList.contains("pinned")
    ).toBe(false);

    element.showFooter = true;
    await act(() => (global as any).flushPromises());
    expect(
      element.shadowRoot?.querySelector(".footer").classList.contains("pinned")
    ).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
