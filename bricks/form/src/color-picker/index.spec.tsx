import { describe, test, expect, jest } from "@jest/globals";
import "./";
import { EoColorPicker } from "./index.js";
import { act, fireEvent } from "@testing-library/react";
jest.mock("@next-core/theme", () => ({}));
describe("eo-color-picker", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  test("basic usage", async () => {
    const element = document.createElement("eo-color-picker") as EoColorPicker;
    expect(element.shadowRoot).toBeFalsy();
    const onChange = jest.fn();
    element.showText = true;
    element.format = "hex";
    element.allowClear = true;
    element.defaultValue = "#333333";
    element.addEventListener("change", onChange);
    act(() => {
      document.body.appendChild(element);
    });
    const triggerEle = element.shadowRoot?.querySelector(
      ".ant-color-picker-trigger"
    ) as HTMLElement;
    act(() => {
      fireEvent.click(triggerEle);
    });
    act(() => {
      fireEvent.change(
        element.shadowRoot?.querySelector(
          ".ant-color-picker-hex-input input"
        ) as HTMLElement,
        {
          target: {
            value: "8B4848",
          },
        }
      );
    });
    expect(
      element.shadowRoot?.querySelector(".ant-color-picker-trigger-text")
        ?.textContent
    ).toEqual("#8B4848");
    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(
          ".ant-color-picker-clear"
        ) as HTMLElement
      );
    });
    expect(onChange).toBeCalledTimes(3);
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("format is hsb", async () => {
    const element = document.createElement("eo-color-picker") as EoColorPicker;
    expect(element.shadowRoot).toBeFalsy();
    const onChange = jest.fn();
    element.format = "hsb";
    element.allowClear = true;
    element.showText = true;
    element.addEventListener("change", onChange);
    act(() => {
      document.body.appendChild(element);
    });
    const elementTrigger = element.shadowRoot?.querySelector(
      ".ant-color-picker-trigger"
    ) as HTMLElement;
    expect(elementTrigger).toBeTruthy();
    act(() => {
      fireEvent.click(elementTrigger as HTMLElement);
    });
    expect(element.shadowRoot?.querySelector(".ant-color-picker")).toBeTruthy();
    const hsbInputEls = element.shadowRoot?.querySelectorAll(
      ".ant-color-picker-hsb-input input"
    ) as NodeListOf<HTMLInputElement>;
    act(() => {
      fireEvent.change(hsbInputEls[0], {
        target: { value: 0 },
      });
      fireEvent.change(hsbInputEls[1], {
        target: { value: 78 },
      });
      fireEvent.change(hsbInputEls[2], {
        target: { value: 39 },
      });
    });
    expect(
      element.shadowRoot
        ?.querySelector(".ant-color-picker-color-block-inner")
        ?.getAttribute("style")
    ).toEqual("background: rgba(99, 99, 99, 0);");
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("format is rgb", async () => {
    const element = document.createElement("eo-color-picker") as EoColorPicker;
    expect(element.shadowRoot).toBeFalsy();
    element.format = "rgb";
    act(() => {
      document.body.appendChild(element);
    });
    const elementTrigger = element.shadowRoot?.querySelector(
      ".ant-color-picker-trigger"
    ) as HTMLElement;
    expect(elementTrigger).toBeTruthy();
    act(() => {
      fireEvent.click(elementTrigger as HTMLElement);
    });
    expect(element.shadowRoot?.querySelector(".ant-color-picker")).toBeTruthy();
    const rgbInputEls = element.shadowRoot?.querySelectorAll(
      ".ant-color-picker-rgb-input input"
    ) as NodeListOf<HTMLInputElement>;
    act(() => {
      fireEvent.change(rgbInputEls[0], {
        target: { value: 0 },
      });
      fireEvent.change(rgbInputEls[1], {
        target: { value: 0 },
      });
      fireEvent.change(rgbInputEls[2], {
        target: { value: 21 },
      });
    });
    expect(
      element.shadowRoot
        ?.querySelector(".ant-color-picker-color-block-inner")
        ?.getAttribute("style")
    ).toEqual("background: rgb(0, 0, 21);");
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
