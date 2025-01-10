import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { MiniLineChart } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-mini-line-chart", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-mini-line-chart"
    ) as MiniLineChart;
    element.xField = "x";
    element.yField = "y";
    element.lineColor = "gray";
    element.data = [
      { x: 1000, y: 5 },
      { x: 1010, y: 10 },
      { x: 1020, y: 8 },
    ];

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <svg
          height="40"
          width="155"
        >
          <g
            transform="translate(1,1)"
          >
            <path
              d="M0,38C25.5,19,51,0,76.5,0C102,0,127.5,7.6,153,15.2"
              fill="none"
              stroke="gray"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </g>
        </svg>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("no smooth", async () => {
    const element = document.createElement(
      "eo-mini-line-chart"
    ) as MiniLineChart;
    element.smooth = false;
    element.data = [
      [1000, 5],
      [1010, 10],
      [1020, 8],
    ] as any[];

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <svg
          height="40"
          width="155"
        >
          <g
            transform="translate(1,1)"
          >
            <path
              d="M0,38L76.5,0L153,15.2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </g>
        </svg>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("min equals to max while not zero", async () => {
    const element = document.createElement(
      "eo-mini-line-chart"
    ) as MiniLineChart;
    element.xField = "x";
    element.yField = "y";
    element.data = [
      { x: 1000, y: 5 },
      { x: 1010, y: 5 },
      { x: 1020, y: 5 },
    ];

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <svg
          height="40"
          width="155"
        >
          <g
            transform="translate(1,1)"
          >
            <path
              d="M0,19L153,19"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </g>
        </svg>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("min equals to max equals to zero", async () => {
    const element = document.createElement(
      "eo-mini-line-chart"
    ) as MiniLineChart;
    element.xField = "x";
    element.yField = "y";
    element.data = [
      { x: 1000, y: 0 },
      { x: 1010, y: 0 },
      { x: 1020, y: 0 },
    ];

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <svg
          height="40"
          width="155"
        >
          <g
            transform="translate(1,1)"
          >
            <path
              d="M0,38L153,38"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </g>
        </svg>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("no data", async () => {
    const element = document.createElement(
      "eo-mini-line-chart"
    ) as MiniLineChart;
    element.width = 120;
    element.height = 60;

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <div
          style="width: 120px; height: 60px;"
        >
          <span>
            NO_DATA
          </span>
        </div>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
