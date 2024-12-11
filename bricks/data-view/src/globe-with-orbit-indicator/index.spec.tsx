import { act } from "react-dom/test-utils";
import "./";
import type { GlobeWithOrbitIndicator } from "./index.js";

window.requestAnimationFrame = jest.fn((fn) => setTimeout(fn, 16));
window.cancelAnimationFrame = jest.fn((frame) => clearTimeout(frame));

jest.useFakeTimers();

jest.mock("@next-core/theme", () => ({}));
jest.mock("../globe-with-halo-indicator/RotatingArc");

jest.mock(
  "resize-observer-polyfill",
  () =>
    class {
      #callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.#callback = callback;
      }
      disconnect() {}
      observe(target: Element) {
        this.#callback(
          [
            {
              target: null,
            },
            {
              target,
              contentRect: {
                width: 1200,
                height: 800,
              },
            },
          ] as ResizeObserverEntry[],
          this
        );
      }
      unobserve() {}
    }
);

describe("data-view.globe-with-orbit-indicator", () => {
  test("even labels", async () => {
    const element = document.createElement(
      "data-view.globe-with-orbit-indicator"
    ) as GlobeWithOrbitIndicator;
    element.dataSource = [
      {
        label: "A",
        value: 1234,
      },
      {
        label: "B",
        value: 5678,
      },
      {
        label: "C",
        value: 91011,
      },
      {
        label: "D",
        value: 121314,
      },
    ];
    element.centerDataSource = {
      label: "中心",
      value: 123456,
    };
    element.cornerDataSource = [
      {
        label: "左上角",
        value: 23456,
      },
    ];

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    expect(
      element.shadowRoot?.querySelectorAll<HTMLElement>(
        ".orbit-label-container"
      ).length
    ).toBe(0);

    act(() => {
      jest.advanceTimersByTime(16);
    });

    expect(
      element.shadowRoot?.querySelectorAll<HTMLElement>(
        ".orbit-label-container"
      ).length
    ).toBe(4);

    act(() => {
      jest.advanceTimersByTime(16);
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("no labels", async () => {
    const element = document.createElement(
      "data-view.globe-with-orbit-indicator"
    ) as GlobeWithOrbitIndicator;

    act(() => {
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot?.querySelectorAll(".orbit-label-container").length
    ).toBe(0);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
