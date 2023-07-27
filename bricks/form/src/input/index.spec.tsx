import { describe, test, expect } from "@jest/globals";
import { act, fireEvent } from "@testing-library/react";
import "./";
import { Input } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("form.general-input", () => {
  it("value is correct", async () => {
    const element = document.createElement("form.general-input") as Input;
    element.value = "abc";

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelector("input")?.value).toBe("abc");

    await act(async () => {
      element.value = 123 as any;
    });
    expect(element.shadowRoot?.querySelector("input")?.value).toBe("123");

    await act(async () => {
      element.value = null as any;
    });
    expect(element.shadowRoot?.querySelector("input")?.value).toBe("");

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("should trigger event correctly", async () => {
    const element = document.createElement("form.general-input") as Input;

    const mockChangeEvent = jest.fn();
    const mockFocusEvent = jest.fn();
    const mockBlurEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("focus", mockFocusEvent);
    element.addEventListener("blur", mockBlurEvent);
    element.value = "hello world";
    element.clearable = true;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);
    const inputElement = element.shadowRoot?.querySelector(
      "input"
    ) as HTMLInputElement;

    act(() => {
      fireEvent.change(inputElement, {
        target: {
          value: "你好",
        },
      });
    });

    expect(inputElement.value).toBe("你好");

    expect(mockChangeEvent).toBeCalledWith(
      expect.objectContaining({
        detail: "你好",
      })
    );

    expect(mockFocusEvent).not.toBeCalled();
    expect(mockBlurEvent).not.toBeCalled();

    act(() => {
      element.focusInput();
    });

    expect(mockFocusEvent).toBeCalled();

    act(() => {
      element.blurInput();
    });

    expect(mockBlurEvent).toBeCalled();

    await act(async () => {
      await (element.value = "change");
    });

    expect(inputElement.value).toBe("change");

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".input-clear-icon") as HTMLDivElement
      );
    });
    expect(inputElement.value).toBe("");
    expect(mockChangeEvent).toBeCalledWith(
      expect.objectContaining({
        detail: "",
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  it("should show clear icon correctly", async () => {
    const element = document.createElement("form.general-input") as Input;
    element.value = "abc";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector(".input-clear-icon")).toBeFalsy();

    await act(async () => {
      element.value = "";
      element.clearable = true;
    });
    const clearIcon = element.shadowRoot?.querySelector(
      ".input-clear-icon"
    ) as HTMLDivElement;
    const inputElement = element.shadowRoot?.querySelector(
      "input"
    ) as HTMLInputElement;

    expect(clearIcon).toBeTruthy();
    expect(
      clearIcon.classList.contains("input-clear-icon-hidden")
    ).toBeTruthy();

    act(() => {
      fireEvent.change(inputElement, {
        target: {
          value: "test",
        },
      });
    });
    expect(clearIcon.classList.contains("input-clear-icon-hidden")).toBeFalsy();

    act(() => {
      fireEvent.click(clearIcon);
    });
    expect(
      clearIcon.classList.contains("input-clear-icon-hidden")
    ).toBeTruthy();

    await act(async () => {
      element.value = "abc";
      element.clearable = true;
      element.disabled = true;
      element.readonly = false;
    });
    expect(
      (
        element.shadowRoot?.querySelector(".input-clear-icon") as HTMLDivElement
      ).classList.contains("input-clear-icon-hidden")
    ).toBeTruthy();

    await act(async () => {
      element.value = "abc";
      element.clearable = true;
      element.disabled = false;
      element.readonly = true;
    });
    expect(
      (
        element.shadowRoot?.querySelector(".input-clear-icon") as HTMLDivElement
      ).classList.contains("input-clear-icon-hidden")
    ).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
  });
});
