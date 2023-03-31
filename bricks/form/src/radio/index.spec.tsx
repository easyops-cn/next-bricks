import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { Radio } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("basic.general-button", () => {
  test("basic usage", async () => {
    const element = document.createElement("form.general-radio") as Radio;
    element.options = [
      {
        label: "a",
        value: "a",
      },
      {
        label: "b",
        value: "b"
      }
    ]

    const mockChangeEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent)

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelector(".radioGruop")?.childNodes.length).toBe(2);
    expect(element.value).toBe(undefined);

    expect(mockChangeEvent).toBeCalledTimes(0);
    act(() => {
      (element.shadowRoot?.querySelector("input[type='radio']") as HTMLElement).click()
    })

    expect(mockChangeEvent).toBeCalledWith(expect.objectContaining({
      detail: "a"
    }));
    expect(element.value).toBe("a");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
