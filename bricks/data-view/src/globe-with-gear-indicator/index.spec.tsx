import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { GlobeWithGearIndicator } from "./index.js";

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

describe("data-view.globe-with-gear-indicator", () => {
  test("even labels", async () => {
    const element = document.createElement(
      "data-view.globe-with-gear-indicator"
    ) as GlobeWithGearIndicator;
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
      [expect.closeTo(725.67, 2), expect.closeTo(106.5, 2)],
      [expect.closeTo(54.33, 2), expect.closeTo(106.5, 2)],
      [expect.closeTo(735.32, 2), expect.closeTo(413.07, 2)],
      [expect.closeTo(24.58, 2), expect.closeTo(413.07, 2)],
    ]);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("odd labels", async () => {
    const element = document.createElement(
      "data-view.globe-with-gear-indicator"
    ) as GlobeWithGearIndicator;
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
      [expect.closeTo(725.67, 2), expect.closeTo(106.5, 2)],
      [expect.closeTo(14, 2), expect.closeTo(215.43, 2)],
      [expect.closeTo(735.32, 2), expect.closeTo(413.07, 2)],
    ]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("single label", async () => {
    const element = document.createElement(
      "data-view.globe-with-gear-indicator"
    ) as GlobeWithGearIndicator;
    element.dataSource = [
      {
        label: "A",
        value: "12%",
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
    ).toEqual([[expect.closeTo(766, 2), expect.closeTo(215.43, 2)]]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("no labels", async () => {
    const element = document.createElement(
      "data-view.globe-with-gear-indicator"
    ) as GlobeWithGearIndicator;

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
