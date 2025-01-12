import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { EoCounterBadge } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-counter-badge", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-counter-badge"
    ) as EoCounterBadge;
    element.icon = {
      icon: "plus-circle",
      lib: "antd",
      theme: "outlined",
    };
    element.count = 12;
    element.textContent = "some content";
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelectorAll("eo-icon").length).toBe(1);
    expect(element.shadowRoot?.querySelectorAll(".noContent").length).toBe(0);

    await act(async () => {
      element.dot = true;
      element.count = 200;
    });
    expect(element.shadowRoot?.querySelectorAll(".badgeDot").length).toBe(1);

    await act(async () => {
      element.dot = false;
      element.overflowCount = 99;
    });
    expect(
      element.shadowRoot?.querySelector(".countContent")?.textContent
    ).toBe("99+");

    await act(async () => {
      element.textContent = null;
      element.icon = undefined;
    });
    expect(element.shadowRoot?.querySelectorAll(".noContent").length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("showZero should work", async () => {
    const element = document.createElement(
      "eo-counter-badge"
    ) as EoCounterBadge;
    element.icon = {
      icon: "plus-circle",
      lib: "antd",
      theme: "outlined",
    };
    element.count = 0;
    element.textContent = "some content";
    element.dot = false;
    element.showZero = false;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelectorAll(".countContent").length).toBe(
      0
    );

    await act(async () => {
      element.dot = true;
      element.showZero = false;
    });
    expect(element.shadowRoot?.querySelectorAll(".countContent").length).toBe(
      0
    );

    await act(async () => {
      element.dot = false;
      element.showZero = true;
    });
    expect(element.shadowRoot?.querySelectorAll(".countContent").length).toBe(
      1
    );

    await act(async () => {
      element.dot = true;
      element.showZero = true;
    });
    expect(element.shadowRoot?.querySelectorAll(".countContent").length).toBe(
      1
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
