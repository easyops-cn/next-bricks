import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoMainView } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const disconnect = jest.fn();
(global.IntersectionObserver as any) = jest.fn((callback: any) => ({
  observe() {
    callback([{ intersectionRatio: 0.99 }]);
  },
  disconnect,
}));

describe("eo-main-view", () => {
  test("basic usage", () => {
    const element = document.createElement("eo-main-view") as EoMainView;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "narrow",
      "full"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("narrow", () => {
    const element = document.createElement("eo-main-view") as EoMainView;
    element.narrow = "medium";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "narrow",
      "medium"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("banner alone", () => {
    const element = document.createElement("eo-main-view") as EoMainView;
    element.bannerAlone = true;
    element.bannerTitle = "Hello";
    element.bannerDescription = "World";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "bannerTitle",
      "Hello"
    );
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "bannerDescription",
      "World"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("footer", async () => {
    const element = document.createElement("eo-main-view") as EoMainView;

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
