import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./";
import { GeneralSwitch } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-switch", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-switch") as GeneralSwitch;
    element.value = false;
    element.label = "switch";
    element.disabled = false;
    element.checkedIcon = {
      icon: "plus-circle",
      lib: "antd",
      theme: "outlined",
    };
    element.unCheckedIcon = {
      icon: "plus-circle",
      lib: "antd",
      theme: "outlined",
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const mockSwitchEvent = jest.fn();
    element.addEventListener("switch", mockSwitchEvent);
    const btn = element.shadowRoot?.querySelector("button") as HTMLElement;
    await act(async () => {
      await btn.click();
    });
    expect(btn?.className).toBe("switch-checked");
    expect(mockSwitchEvent).toBeCalledWith(
      expect.objectContaining({ detail: true })
    );
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
