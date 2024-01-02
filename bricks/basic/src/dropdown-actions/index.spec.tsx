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

customElements.define(
  "eo-actions",
  class extends HTMLElement {
    actions: unknown[] | undefined;
  }
);

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
    element.addEventListener("action.click", (e: Event) =>
      onActionClick((e as CustomEvent).detail)
    );

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

    expect(element.shadowRoot?.querySelectorAll("eo-actions")).toHaveLength(1);

    act(() => {
      fireEvent(
        element.shadowRoot!.querySelector("eo-actions")!,
        new CustomEvent("action.click", { detail: element.actions![1] })
      );
    });
    expect(onActionClick).toBeCalledWith(
      expect.objectContaining({
        text: "a",
        event: "a.click",
        url: "/test",
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
