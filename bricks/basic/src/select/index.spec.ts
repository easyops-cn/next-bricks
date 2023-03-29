import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { Select } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("basic.general-select", () => {
  test("basic usage", async () => {
    const element = document.createElement("basic.general-select") as Select;
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
    element.addEventListener("change", mockChangeEvent)

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect((element.shadowRoot?.querySelector(".select-dropdown") as HTMLElement).style.display).toBe("none");

    act(() => {
      (element.shadowRoot?.querySelector(".select-selector") as HTMLElement).click()
    })

    expect((element.shadowRoot?.querySelector(".select-dropdown") as HTMLElement).style.display).toBe("");
    expect(element.shadowRoot?.querySelectorAll(".select-item").length).toBe(2);

    expect(mockChangeEvent).toBeCalledTimes(0);

    act(() => {
      (element.shadowRoot?.querySelector(".select-item") as HTMLElement).click()
    })

    expect(mockChangeEvent).toBeCalledWith(expect.objectContaining({
      detail: {
        options: [{label: "a", value: "a"}],
        value: "a",
      },
    }));
    expect(element.value).toBe("a");
    expect((element.shadowRoot?.querySelector(".select-dropdown") as HTMLElement).style.display).toBe("none");


    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
