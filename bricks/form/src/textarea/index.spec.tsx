import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { Textarea } from "./index.js";
import { fireEvent } from "@testing-library/react";

jest.mock("@next-core/theme", () => ({}));

describe("eo-textarea", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-textarea") as Textarea;

    const mockChangeEvent = jest.fn();
    const mockFocusEvent = jest.fn();
    const mockBlurEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("focus", mockFocusEvent);
    element.addEventListener("blur", mockBlurEvent);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(
      (
        element.shadowRoot?.querySelector("textarea")?.style as Record<
          string,
          any
        >
      )?._values
    ).toEqual({
      display: "block",
      height: "94px",
    });

    act(() => {
      element.shadowRoot?.querySelector("textarea")?.focus();
      element.shadowRoot?.querySelector("textarea")?.blur();
      fireEvent.change(
        element.shadowRoot?.querySelector("textarea") as HTMLElement,
        { target: { value: "a" } }
      );
    });

    expect(mockFocusEvent).toBeCalledTimes(1);
    expect(mockBlurEvent).toBeCalledTimes(1);
    expect(mockChangeEvent).toBeCalledTimes(1);

    expect(element.shadowRoot?.querySelector("textarea")?.textContent).toBe(
      "a"
    );

    await act(async () => {
      await (element.value = undefined);
    });

    expect(element.shadowRoot?.querySelector("textarea")?.textContent).toBe("");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("auto size should work", () => {
    jest
      .spyOn(document.documentElement, "scrollHeight", "get")
      .mockImplementation(() => 100);
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 30,
    });
    const element = document.createElement("eo-textarea") as Textarea;

    element.autoSize = {
      minRows: 2,
      maxRows: 5,
    };
    act(() => {
      document.body.appendChild(element);
    });

    expect(
      (
        element.shadowRoot?.querySelector("textarea")?.style as Record<
          string,
          any
        >
      )?._values
    ).toEqual({
      display: "block",
      height: "54px",
      "max-height": "120px",
      "min-height": "54px",
      "overflow-y": "hidden",
      resize: "none",
    });

    act(() => {
      document.body.removeChild(element);
    });
  });
});
