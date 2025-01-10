import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { IndicatorCard } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("data-view.indicator-card", () => {
  test("basic usage", () => {
    const element = document.createElement(
      "data-view.indicator-card"
    ) as IndicatorCard;

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

  test('layout="column"', () => {
    const element = document.createElement(
      "data-view.indicator-card"
    ) as IndicatorCard;
    element.datasource = [
      {
        value: 300,
        desc: "月碳排放量",
        unit: "(吨)",
      },
      {
        value: 1000.33,
        desc: "季度碳排放总量",
        unit: "(吨)",
      },
    ];
    act(() => {
      document.body.appendChild(element);
    });
    const container = element.shadowRoot?.querySelector(".container");
    expect(container.querySelectorAll(".col-wrapper")).toHaveLength(2);
    expect(element.shadowRoot?.querySelector(".townhouse")).toBeNull();
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test('layout="column-townhouse"', () => {
    const element = document.createElement(
      "data-view.indicator-card"
    ) as IndicatorCard;
    element.datasource = [
      {
        value: 300,
        desc: "月碳排放量",
        unit: "(吨)",
      },
      {
        value: 1000.33,
        desc: "季度碳排放总量",
        unit: "(吨)",
      },
    ];
    element.layout = "column-townhouse";
    act(() => {
      document.body.appendChild(element);
    });
    const container = element.shadowRoot?.querySelector(".container");
    expect(container.querySelectorAll(".col-wrapper")).toHaveLength(2);
    expect(element.shadowRoot?.querySelector(".townhouse")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test('layout="row"', () => {
    const element = document.createElement(
      "data-view.indicator-card"
    ) as IndicatorCard;
    element.datasource = [
      {
        value: 300,
        desc: "月碳排放量",
        unit: "(吨)",
      },
      {
        value: 1000.33,
        desc: "季度碳排放总量",
        unit: "(吨)",
      },
    ];
    element.layout = "row";
    act(() => {
      document.body.appendChild(element);
    });
    const container = element.shadowRoot?.querySelector(".container");
    expect(container.querySelectorAll(".row-wrapper")).toHaveLength(2);
    expect(container.querySelectorAll(".row-left img")).toHaveLength(2);
    expect(element.shadowRoot?.querySelector(".townhouse")).toBeNull();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test('layout="row-townhouse"', () => {
    const element = document.createElement(
      "data-view.indicator-card"
    ) as IndicatorCard;
    element.datasource = [
      {
        value: 300,
        desc: "月碳排放量",
        unit: "(吨)",
      },
      {
        value: 1000.33,
        desc: "季度碳排放总量",
        unit: "(吨)",
      },
    ];
    element.layout = "row-townhouse";
    act(() => {
      document.body.appendChild(element);
    });
    const container = element.shadowRoot?.querySelector(".container");
    expect(container.querySelectorAll(".row-wrapper")).toHaveLength(2);
    expect(container.querySelectorAll(".row-left img")).toHaveLength(2);
    expect(element.shadowRoot?.querySelector(".townhouse")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
