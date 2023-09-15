import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoTimePicker } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-time-picker", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-time-picker") as EoTimePicker;
    const onOpenChangeMock = jest.fn();
    const onChangeMock = jest.fn();

    element.addEventListener("change", onChangeMock);
    element.addEventListener("open", onOpenChangeMock);
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector("input")).toBeTruthy();
    act(() => {
      (element.shadowRoot?.querySelector("input") as HTMLElement).click();
    });
    expect(onOpenChangeMock).toBeCalled();
    expect(
      element.shadowRoot?.querySelector(".ant-picker-now-btn")
    ).toBeTruthy();
    act(() => {
      (
        element.shadowRoot?.querySelector(".ant-picker-now-btn") as HTMLElement
      ).click();
    });

    expect(onChangeMock).toBeCalled();
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
