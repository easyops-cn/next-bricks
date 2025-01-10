import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./";
import type { ProgressBarList } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

jest.mock("../hooks/index.js", () => {
  return {
    useResizeObserver: jest
      .fn()
      .mockReturnValue([
        { current: null },
        { clientWidth: 462, clientHeight: 500 },
      ]),
  };
});

describe("data-view.progress-bar-list", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.progress-bar-list"
    ) as ProgressBarList;
    element.dataSource = [
      {
        title: "资源1",
        count: 123,
      },
      {
        title: "资源2",
        count: 39,
      },
      {
        title: "资源3",
        count: 23,
      },
      {
        title: "资源4",
        count: 13,
      },
    ];

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
});
