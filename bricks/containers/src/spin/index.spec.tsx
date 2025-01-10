import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { EoSpin } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-spin", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-spin") as EoSpin;
    element.tip = "加载中...";
    element.spinning = true;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelector(".spin-tip").textContent).toBe(
      "加载中..."
    );
    expect(element.shadowRoot?.querySelector(".spin-item")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
