import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { GlobeEarthIndicator } from "./index.js";

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

describe("data-view.globe-earth-indicator", () => {
  test("even labels", async () => {
    const element = document.createElement(
      "data-view.globe-earth-indicator"
    ) as GlobeEarthIndicator;
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
      [
        ...element.shadowRoot!.querySelectorAll<HTMLElement>(
          ".ring-label-container"
        ),
      ].map((label) => [
        parseFloat(label.style.left),
        parseFloat(label.style.top),
      ])
    ).toEqual([
      [expect.closeTo(620.54, 2), expect.closeTo(-5.46, 2)],
      [expect.closeTo(307.46, 2), expect.closeTo(-5.46, 2)],
      [expect.closeTo(783.42, 2), expect.closeTo(194.33, 2)],
      [expect.closeTo(144.58, 2), expect.closeTo(194.33, 2)],
    ]);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("odd labels", async () => {
    const element = document.createElement(
      "data-view.globe-earth-indicator"
    ) as GlobeEarthIndicator;
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
    ];

    act(() => {
      document.body.appendChild(element);
    });

    expect(
      [
        ...element.shadowRoot!.querySelectorAll<HTMLElement>(
          ".ring-label-container"
        ),
      ].map((label) => [
        parseFloat(label.style.left),
        parseFloat(label.style.top),
      ])
    ).toEqual([
      [expect.closeTo(620.54, 2), expect.closeTo(-5.46, 2)],
      [expect.closeTo(243.28, 2), expect.closeTo(93.27, 2)],
      [expect.closeTo(783.42, 2), expect.closeTo(194.33, 2)],
    ]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("single label", async () => {
    const element = document.createElement(
      "data-view.globe-earth-indicator"
    ) as GlobeEarthIndicator;
    element.dataSource = [
      {
        label: "A",
        value: 1234,
      },
    ];

    act(() => {
      document.body.appendChild(element);
    });

    expect(
      [
        ...element.shadowRoot!.querySelectorAll<HTMLElement>(
          ".ring-label-container"
        ),
      ].map((label) => [
        parseFloat(label.style.left),
        parseFloat(label.style.top),
      ])
    ).toEqual([[expect.closeTo(729, 2), expect.closeTo(4.4, 2)]]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("no labels", async () => {
    const element = document.createElement(
      "data-view.globe-earth-indicator"
    ) as GlobeEarthIndicator;

    act(() => {
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot?.querySelectorAll(".ring-label-container").length
    ).toBe(0);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
