import { describe, test, expect } from "@jest/globals";
import { act, fireEvent } from "@testing-library/react";
import "./";
import { Input } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("form.general-button", () => {
  test("basic usage", async () => {
    const element = document.createElement("form.general-input") as Input;
    const prefixElement = document.createElement("div");
    prefixElement.slot = "prefix";
    const suffixElement = document.createElement("div");
    suffixElement.slot = "suffix";

    const mockChangeEvent = jest.fn();
    const mockFocusEvent = jest.fn();
    const mockBlurEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("focus", mockFocusEvent);
    element.addEventListener("blur", mockBlurEvent);
    element.value = "hello world";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
      element.appendChild(prefixElement);
      element.appendChild(suffixElement);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.innerHTML).toBe(
      '<div slot="prefix"></div><div slot="suffix"></div>'
    );

    act(() => {
      fireEvent.change(
        element.shadowRoot?.querySelector("input") as HTMLInputElement,
        {
          target: {
            value: "你好",
          },
        }
      );
    });

    expect(
      (element.shadowRoot?.querySelector("input") as HTMLInputElement).value
    ).toBe("你好");

    expect(mockChangeEvent).toBeCalledWith(
      expect.objectContaining({
        detail: "你好",
      })
    );

    expect(mockFocusEvent).not.toBeCalled();
    expect(mockBlurEvent).not.toBeCalled();

    act(() => {
      fireEvent.focus(
        element.shadowRoot?.querySelector("input") as HTMLInputElement
      );
    });

    expect(mockFocusEvent).toBeCalled();

    act(() => {
      fireEvent.blur(
        element.shadowRoot?.querySelector("input") as HTMLInputElement
      );
    });

    expect(mockBlurEvent).toBeCalled();

    await act(async () => {
      await (element.value = "change");
    });

    expect(
      (element.shadowRoot?.querySelector("input") as HTMLInputElement).value
    ).toBe("change");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
