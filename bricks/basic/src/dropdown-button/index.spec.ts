import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { DropdownButton } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

class EoDropdownActions extends HTMLElement {
  triggerActionClick(event: string) {
    this.dispatchEvent(new CustomEvent("action.click", { detail: { event } }));
  }
}
customElements.define("eo-dropdown-actions", EoDropdownActions);

describe("eo-dropdown-button", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-dropdown-button"
    ) as DropdownButton;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.btnText = "Hello world";
      element.size = "large";
      element.actions = [
        {
          text: "a",
          event: "a.click",
        },
        {
          text: "b",
          event: "b.click",
          disabled: true,
        },
        {
          text: "c",
          event: "c.click",
          hidden: true,
        },
      ];
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    const mockAClick = jest.fn();
    const mockBClick = jest.fn();
    element.addEventListener("a.click", mockAClick);
    element.addEventListener("b.click", mockBClick);

    act(() => {
      (
        element.shadowRoot?.querySelector(
          "eo-dropdown-actions"
        ) as EoDropdownActions
      ).triggerActionClick("a.click");
    });
    expect(mockAClick).toHaveBeenCalledTimes(1);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
