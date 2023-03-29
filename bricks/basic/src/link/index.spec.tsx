import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { Link } from "./index.js";
import { GeneralIconProps } from "@next-bricks/icons/general-icon";

jest.mock("@next-core/theme", () => ({}));

describe("basic.general-button", () => {
  test("basic usage", async () => {
    const element1 = document.createElement("basic.general-link") as Link;
    const element2 = document.createElement("basic.general-link") as Link;
    element1.textContent = "hello world";
    element1.icon = {} as GeneralIconProps;

    element2.textContent = "disabled link";
    element2.disabled = true;

    const mockElement1ClickEvent = jest.fn();
    const mockElement2ClickEvent = jest.fn();
    element1.addEventListener("click", mockElement1ClickEvent);
    element2.addEventListener("click", mockElement2ClickEvent);

    expect(element1.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element1);
      document.body.appendChild(element2);
    });
    expect(element1.shadowRoot).toBeTruthy();
    expect(element1.shadowRoot?.childNodes.length).toBe(2);

    expect(element1.innerHTML).toBe("hello world");
    expect(element1.shadowRoot?.querySelector("a")?.childNodes.length).toBe(2);

    expect(element2.innerHTML).toBe("disabled link");
    expect(element2.shadowRoot?.querySelector("a")?.childNodes.length).toBe(1);

    expect(mockElement1ClickEvent).toBeCalledTimes(0);
    expect(mockElement2ClickEvent).toBeCalledTimes(0);

    act(() => {
      element1.shadowRoot?.querySelector("a")?.click();
      element2.shadowRoot?.querySelector("a")?.click();
    });

    expect(mockElement1ClickEvent).toBeCalledTimes(1);
    expect(mockElement2ClickEvent).toBeCalledTimes(0);

    act(() => {
      document.body.removeChild(element1);
      document.body.removeChild(element2);
    });
    expect(element1.shadowRoot?.childNodes.length).toBe(0);
    expect(element2.shadowRoot?.childNodes.length).toBe(0);
  });
});
