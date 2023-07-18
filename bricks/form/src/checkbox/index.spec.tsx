import { describe, test, expect } from "@jest/globals";
import { act } from "@testing-library/react";
import "./";
import { Checkbox } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("form.general-button", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-checkbox") as Checkbox;
    element.options = [
      {
        label: "a",
        value: "a",
      },
      {
        label: "b",
        value: "b",
      },
    ];

    const mockChangeEvent = jest.fn();
    const mockOptionsChangeEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("options.change", mockOptionsChangeEvent);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(
      element.shadowRoot?.querySelector(".checkboxWrapper")?.childNodes.length
    ).toBe(2);
    expect(element.value).toBe(undefined);

    expect(mockChangeEvent).toBeCalledTimes(0);
    act(() => {
      (
        element.shadowRoot?.querySelector(
          "input[type='checkbox']"
        ) as HTMLElement
      ).click();
    });

    expect(mockChangeEvent).toBeCalledWith(
      expect.objectContaining({
        detail: [
          {
            label: "a",
            value: "a",
          },
        ],
      })
    );
    expect(element.value).toEqual(["a"]);
    expect(
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='checkbox']"
        )[0] as HTMLInputElement
      ).checked
    ).toBeTruthy();
    expect(mockOptionsChangeEvent).toBeCalledTimes(0);

    await act(async () => {
      await (element.value = ["b"]);
    });

    expect(
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='checkbox']"
        )[0] as HTMLInputElement
      ).checked
    ).toBeFalsy();

    expect(
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='checkbox']"
        )[1] as HTMLInputElement
      ).checked
    ).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
