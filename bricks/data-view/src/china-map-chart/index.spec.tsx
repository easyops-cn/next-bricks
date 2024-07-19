import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { ChinaMapChart } from "./index.js";

jest.mock("@antv/l7", () => ({
  window: {
    url: {
      createObjectURL: jest.fn(),
    },
  },
  Scene: function () {
    this.on = jest.fn();
    this.destroy = jest.fn();
    this.addImage = jest.fn();
  },
  LineLayer: jest.fn(),
  PointLayer: jest.fn(),
  MarkerLayer: jest.fn(),
  Marker: jest.fn(),
  PolygonLayer: jest.fn(),
}));

jest.mock("@antv/l7-maps", () => ({
  Map: jest.fn(),
}));

jest.mock("@next-core/theme", () => ({}));

describe("data-view.china-map-chart", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.china-map-chart"
    ) as ChinaMapChart;

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
