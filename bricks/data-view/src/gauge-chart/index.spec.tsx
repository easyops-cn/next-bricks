import { describe, test, expect } from "@jest/globals";
import React from "react";
import { act } from "react";
import "./index.js";
import { GaugeChart ,GaugeChartComponent } from "./index.js";
import {render} from "@testing-library/react";

describe("data-view.gauge-chart", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.gauge-chart"
    ) as GaugeChart;
    const div = document.createElement("div");
    div.textContent = "Hello world";
    element.value = 40;
    element.radius = 124;
    act(() => {
      element.appendChild(div);
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.querySelector("svg").getAttribute("viewBox")).toBe("0 0 308 166");
    const {container} = render(<GaugeChartComponent value={100} radius={180} strokeWidth={30} />);
    expect(container.querySelector("text").innerHTML).toBe("100%");
    expect(container.querySelector("svg").getAttribute("viewBox")).toBe("0 0 420 227");
    expect(element.innerHTML).toBe("<div>Hello world</div>");
    expect(element.shadowRoot?.childNodes.length).toBe(2);
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
