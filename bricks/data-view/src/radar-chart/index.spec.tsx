import React from "react";
import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import { render } from "@testing-library/react";
import "./index.js";
import { RadarChart } from "./index.js";
import { Radar } from "./radar.js";
import { Data } from "./interface.js";

const names = ["JavaScript", "Java", "CSS", "Python", "Three.js"];
const values = [40, 20, 70, 50, 10];
export const datas: Data[] = Array.from({
  length: names.length,
}).map((v, i) => ({
  value: values[i],
  maxValue: 100,
  name: names[i],
  percentValue: i > 2 ? "45%" : null,
}));
// 创建一个虚拟的 Canvas 元素
export const canvas = {
  getContext: jest.fn().mockReturnValue({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
    createLinearGradient: jest.fn().mockReturnValue({
      addColorStop: jest.fn(),
    }),
  }),
};
HTMLCanvasElement.prototype.getContext = jest
  .fn()
  .mockReturnValue(canvas.getContext());
jest.useFakeTimers();
describe("data-view.radar-chart", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.radar-chart"
    ) as RadarChart;
    const div = document.createElement("div");
    element.dataSource = [];
    await act(() => {
      element.appendChild(div);
      document.body.appendChild(element);
    });
    render(<Radar value={100} dataSource={datas} />);
    jest.advanceTimersByTime(1000);

    await act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
