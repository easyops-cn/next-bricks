import React from "react";
import { describe, test, expect } from "@jest/globals";
import { act, render } from "@testing-library/react";
import { RotatingArc } from "./RotatingArc";

window.requestAnimationFrame = jest.fn((fn) => setTimeout(fn, 17));
window.cancelAnimationFrame = jest.fn((frame) => clearTimeout(frame));

jest.useFakeTimers();

describe("RotatingArc", () => {
  test("should work", () => {
    const getComponent = () => (
      <svg>
        <RotatingArc />
      </svg>
    );
    const { rerender, container } = render(getComponent());
    expect(container.querySelector("path").getAttribute("d")).toBe("M 0 0");

    act(() => {
      jest.advanceTimersByTime(17);
    });
    rerender(getComponent());
    expect(
      container
        .querySelector("path")
        .getAttribute("d")
        .split(" ")
        .map((item) => (/^[A-Z]$/.test(item) ? item : parseFloat(item)))
    ).toEqual([
      "M",
      expect.closeTo(20.78, 2),
      expect.closeTo(62.03, 2),
      "A",
      412.4,
      88.9,
      0,
      0,
      0,
      expect.closeTo(413, 2),
      expect.closeTo(178.4, 2),
    ]);

    act(() => {
      jest.advanceTimersByTime(17);
    });
    rerender(getComponent());
    expect(
      container
        .querySelector("path")
        .getAttribute("d")
        .split(" ")
        .map((item) => (/^[A-Z]$/.test(item) ? item : parseFloat(item)))
    ).toEqual([
      "M",
      expect.closeTo(16.15, 2),
      expect.closeTo(65.32, 2),
      "A",
      412.4,
      88.9,
      0,
      0,
      0,
      expect.closeTo(428.94, 2),
      expect.closeTo(178.33, 2),
    ]);
  });
});
