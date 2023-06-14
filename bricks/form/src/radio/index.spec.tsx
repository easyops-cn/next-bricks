import { describe, test, expect } from "@jest/globals";
import { act } from "@testing-library/react";
import "./";
import { Radio } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("form.general-button", () => {
  test("basic usage", async () => {
    const element = document.createElement("form.general-radio") as Radio;
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
      element.shadowRoot?.querySelector(".radioGruop")?.childNodes.length
    ).toBe(2);
    expect(element.value).toBe(undefined);

    expect(mockChangeEvent).toBeCalledTimes(0);
    act(() => {
      (
        element.shadowRoot?.querySelector("input[type='radio']") as HTMLElement
      ).click();
    });

    expect(mockChangeEvent).toBeCalledWith(
      expect.objectContaining({
        detail: {
          label: "a",
          value: "a",
        },
      })
    );
    expect(element.value).toBe("a");
    expect(
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='radio']"
        )[0] as HTMLInputElement
      ).checked
    ).toBeTruthy();
    expect(mockOptionsChangeEvent).toBeCalledTimes(0);

    await act(async () => {
      await (element.options = ["a", "b", "c"]);
    });

    expect(mockOptionsChangeEvent).toBeCalledWith(
      expect.objectContaining({
        detail: {
          options: [
            {
              label: "a",
              value: "a",
            },
            {
              label: "b",
              value: "b",
            },
            {
              label: "c",
              value: "c",
            },
          ],
        },
      })
    );

    await act(async () => {
      await (element.value = "c");
    });

    expect(
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='radio']"
        )[0] as HTMLInputElement
      ).checked
    ).toBeFalsy();

    expect(
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='radio']"
        )[2] as HTMLInputElement
      ).checked
    ).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
