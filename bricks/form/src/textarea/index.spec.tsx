import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import ResizeObserver from "resize-observer-polyfill";
import "./";
import { Textarea } from "./index.js";
import { fireEvent } from "@testing-library/react";

jest.mock("@next-core/theme", () => ({}));
jest.mock("resize-observer-polyfill");

let observerCallback: ResizeObserverCallback | undefined;

(ResizeObserver as jest.Mock).mockImplementation(function (
  callback: ResizeObserverCallback
) {
  observerCallback = callback;
  return {
    observe: jest.fn(),
    disconnect: jest.fn(),
  };
} as any);

describe("eo-textarea", () => {
  beforeEach(() => {
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      queueMicrotask(() => {
        cb(0);
      });

      return 0;
    });
  });

  afterEach(() => {
    (window.requestAnimationFrame as jest.Mock).mockRestore();
  });

  test("basic usage", async () => {
    const element = document.createElement("eo-textarea") as Textarea;

    const mockChangeEvent = jest.fn();
    const mockFocusEvent = jest.fn();
    const mockBlurEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("focus", mockFocusEvent);
    element.addEventListener("blur", mockBlurEvent);

    expect(element.shadowRoot).toBeFalsy();
    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    const textareaElement = element.shadowRoot?.querySelector(
      "textarea"
    ) as HTMLTextAreaElement;

    expect((textareaElement?.style as Record<string, any>)?._values).toEqual({
      height: "94px",
    });

    act(() => {
      textareaElement?.focus();
      textareaElement?.blur();
      fireEvent.change(textareaElement as HTMLElement, {
        target: { value: "a" },
      });
    });

    expect(mockFocusEvent).toBeCalledTimes(1);
    expect(mockBlurEvent).toBeCalledTimes(1);
    expect(mockChangeEvent).toBeCalledTimes(1);

    expect(textareaElement?.textContent).toBe("a");

    await act(async () => {
      element.value = undefined;
    });

    expect(textareaElement?.textContent).toBe("");

    // focusTextarea
    const mockedFocus = jest.spyOn(textareaElement, "focus");
    const mockedSetSelectionRange = jest.spyOn(
      textareaElement,
      "setSelectionRange"
    );

    act(() => {
      element.focusTextarea();
    });

    expect(mockedFocus).toBeCalledTimes(1);
    expect(mockedSetSelectionRange).not.toBeCalled();

    const value = "a";
    const valueLength = value.length;

    await act(async () => {
      element.value = value;
    });

    act(() => {
      element.focusTextarea();
    });

    expect(mockedFocus).toBeCalledTimes(2);
    expect(mockedSetSelectionRange).toBeCalledWith(valueLength, valueLength);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("auto size should work", async () => {
    jest
      .spyOn(document.documentElement, "scrollHeight", "get")
      .mockImplementation(() => 100);
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 30,
    });
    const element = document.createElement("eo-textarea") as Textarea;

    element.value = "a";
    element.autoSize = {
      minRows: 2,
      maxRows: 5,
    };
    await act(async () => {
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

  test("auto size default height without minRows", async () => {
    const element = document.createElement("eo-textarea") as Textarea;

    element.autoSize = {
      maxRows: 5,
    };
    await act(async () => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelector("textarea")?.style.height).toBe(
      "32px"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("auto size default height autoSize: true", async () => {
    const element = document.createElement("eo-textarea") as Textarea;

    element.autoSize = true;
    await act(async () => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelector("textarea")?.style.height).toBe(
      "32px"
    );

    expect(requestAnimationFrame).toBeCalledTimes(1);

    act(() => {
      observerCallback?.(
        [
          {
            contentBoxSize: [{ inlineSize: 300, blockSize: 100 }],
          } as any,
        ],
        null!
      );
    });

    // `inlineSize` not changed, will not trigger `setAutoSize`
    act(() => {
      observerCallback?.(
        [
          {
            contentBoxSize: [{ inlineSize: 300, blockSize: 120 }],
          } as any,
        ],
        null!
      );
    });
    expect(requestAnimationFrame).toBeCalledTimes(1);

    act(() => {
      observerCallback?.(
        [
          {
            contentBoxSize: [{ inlineSize: 320, blockSize: 120 }],
          } as any,
        ],
        null!
      );
    });
    expect(requestAnimationFrame).toBeCalledTimes(2);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
