import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { EoStatisticsCard } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-statistics-card", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-statistics-card"
    ) as EoStatisticsCard;
    element.cardTitle = "事件响应数";
    element.value = "1.2K";
    element.unit = "个";
    element.icon = {
      lib: "easyops",
      category: "monitor",
      icon: "infra-monitor",
    };
    element.descriptionPosition = "bottom";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot
        ?.querySelector("slot[name='description']")
        .parentElement.classList.contains("basic-info")
    ).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".icon-container")).toBeTruthy();

    await act(async () => {
      element.descriptionPosition = "right";
      element.icon = null;
    });
    expect(
      element.shadowRoot
        ?.querySelector("slot[name='description']")
        .parentElement.classList.contains("value-container")
    ).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".icon-container")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
