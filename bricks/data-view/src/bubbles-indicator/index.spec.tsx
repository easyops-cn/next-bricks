import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { BubblesIndicator } from "./index.js";

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

describe("data-view.bubbles-indicator", () => {
  test("even labels", async () => {
    const element = document.createElement(
      "data-view.bubbles-indicator"
    ) as BubblesIndicator;
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
      element.shadowRoot!.querySelectorAll<HTMLElement>(".bubble").length
    ).toBe(17);
    expect(element.shadowRoot?.querySelectorAll(".bubble-label").length).toBe(
      4
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("odd labels", async () => {
    const element = document.createElement(
      "data-view.bubbles-indicator"
    ) as BubblesIndicator;
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
      element.shadowRoot!.querySelectorAll<HTMLElement>(".bubble").length
    ).toBe(17);
    expect(element.shadowRoot?.querySelectorAll(".bubble-label").length).toBe(
      3
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("no labels", async () => {
    const element = document.createElement(
      "data-view.bubbles-indicator"
    ) as BubblesIndicator;

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelectorAll(".bubble").length).toBe(17);
    expect(element.shadowRoot?.querySelectorAll(".bubble-label").length).toBe(
      0
    );

    act(() => {
      document.body.removeChild(element);
    });
  });
});
