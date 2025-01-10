import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { EoDivider } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-divider", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-divider") as EoDivider;
    element.textContent = "基本信息";
    element.type = "radiation";
    element.proportion = [1, 3];
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot.querySelector(".proportionText")?.childNodes.length
    ).toBe(2);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
