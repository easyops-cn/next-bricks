import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { DropdownButton } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("basic.dropdown-button", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "basic.dropdown-button"
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

    expect(element.shadowRoot?.innerHTML).toMatchInlineSnapshot(
      `"<style>dropdown-button.shadow.css</style><eo-popover placement="bottom" sync="width"><eo-button slot="anchor" size="large" icon="[object Object]">Hello world</eo-button><eo-menu style="min-width: max-content;"><eo-menu-item class="wrapped-menu-item" text="a" event="a.click">a</eo-menu-item><eo-menu-item class="wrapped-menu-item" text="b" event="b.click" disabled="">b</eo-menu-item></eo-menu></eo-popover>"`
    );

    act(() => {
      (
        element.shadowRoot?.children[1]?.children[1]?.children[0] as HTMLElement
      ).click();
    });

    expect(mockAClick).toBeCalledTimes(1);

    act(() => {
      (
        element.shadowRoot?.children[1]?.children[1]?.children[0] as HTMLElement
      ).click();
    });

    expect(mockBClick).toBeCalledTimes(0);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
