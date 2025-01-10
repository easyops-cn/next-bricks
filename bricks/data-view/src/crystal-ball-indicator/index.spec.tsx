import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { CrystalBallIndicator } from "./index.js";

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

describe("data-view.crystal-ball-indicator", () => {
  test("even labels", async () => {
    const element = document.createElement(
      "data-view.crystal-ball-indicator"
    ) as CrystalBallIndicator;
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
      [expect.closeTo(549.68, 2), expect.closeTo(159, 2)],
      [expect.closeTo(54.32, 2), expect.closeTo(159, 2)],
      [expect.closeTo(549.68, 2), expect.closeTo(445, 2)],
      [expect.closeTo(54.32, 2), expect.closeTo(445, 2)],
    ]);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("odd labels", async () => {
    const element = document.createElement(
      "data-view.crystal-ball-indicator"
    ) as CrystalBallIndicator;
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
      [expect.closeTo(549.68, 2), expect.closeTo(159, 2)],
      [expect.closeTo(16, 2), expect.closeTo(302, 2)],
      [expect.closeTo(549.68, 2), expect.closeTo(445, 2)],
    ]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("no labels", async () => {
    const element = document.createElement(
      "data-view.crystal-ball-indicator"
    ) as CrystalBallIndicator;

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
