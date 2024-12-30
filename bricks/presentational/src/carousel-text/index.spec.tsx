import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoCarouselText } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

jest.mock(
  "resize-observer-polyfill",
  () =>
    class {
      #callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.#callback = callback;
      }
      disconnect() {}
      observe() {
        Promise.resolve().then(() => {
          this.#callback([], this);
        });
      }
      unobserve() {}
    }
);

describe("eo-carousel-text", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-carousel-text"
    ) as EoCarouselText;

    act(() => {
      document.body.appendChild(element);
    });

    const container = element.shadowRoot.querySelector(
      ".container"
    ) as HTMLElement;
    Object.defineProperty(container, "offsetWidth", {
      value: 400,
      writable: true,
    });

    Object.defineProperty(
      element.shadowRoot.querySelector(".scroll") as HTMLElement,
      "offsetWidth",
      {
        value: 600,
        writable: true,
      }
    );

    expect(container.classList.contains("ready")).toBe(false);

    await act(async () => {
      await (global as any).flushPromises();
    });

    expect(container.classList.contains("ready")).toBe(true);
    expect(
      (container as HTMLElement).style.getPropertyValue("--transform-start")
    ).toBe("translateX(400px)");
    expect(
      (container as HTMLElement).style.getPropertyValue("--transform-end")
    ).toBe("translateX(-600px)");
    expect(
      (container as HTMLElement).style.getPropertyValue("--transform-duration")
    ).toBe("10s");

    act(() => {
      document.body.removeChild(element);
    });
  });
});
