import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import { EoDropdownActions } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
class MockEoPopover extends HTMLElement {
  changeActive(active: boolean) {
    this.dispatchEvent(
      new CustomEvent("before.visible.change", { detail: active })
    );
  }
}

customElements.define("eo-popover", MockEoPopover);

describe("eo-dropdown-actions", () => {
  test("basic usage", async () => {
    const onActionClick = jest.fn();
    const element = document.createElement(
      "eo-dropdown-actions"
    ) as EoDropdownActions;
    element.actions = [
      {
        type: "divider",
      },
      {
        text: "a",
        event: "a.click",
        url: "/test",
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
      {
        type: "divider",
      },
      {
        text: "d",
        event: "d.click",
        danger: true,
      },
      {
        type: "divider",
      },
    ];
    element.addEventListener("action.click", onActionClick);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    await act(async () => {
      (
        element.shadowRoot?.querySelector("eo-popover") as MockEoPopover
      ).changeActive(true);
    });
    expect(
      element.shadowRoot?.querySelector("eo-popover")?.hasAttribute("active")
    ).toBeTruthy();

    expect(element.shadowRoot?.querySelectorAll("eo-menu-item")).toHaveLength(
      3
    );
    expect(
      element.shadowRoot?.querySelectorAll(".menu-item-divider")
    ).toHaveLength(1);

    expect(
      element.shadowRoot?.querySelectorAll("eo-menu-item")[0].parentElement
        ?.tagName
    ).toBe("EO-LINK");
    expect(
      element.shadowRoot?.querySelectorAll("eo-menu-item")[1].parentElement
        ?.tagName
    ).not.toBe("EO-LINK");
    expect(
      element.shadowRoot
        ?.querySelectorAll("eo-menu-item")[2]
        .classList.contains("menu-item-danger")
    ).toBeTruthy();

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll("eo-menu-item")[0] as HTMLElement
      );
    });
    expect(onActionClick).lastCalledWith(
      expect.objectContaining({
        detail: {
          text: "a",
          event: "a.click",
          url: "/test",
        },
      })
    );
    expect(
      element.shadowRoot?.querySelector("eo-popover")?.hasAttribute("active")
    ).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
