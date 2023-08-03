import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import { EoDropdownActions } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-dropdown-actions", () => {
  test("basic usage", async () => {
    const onActionClick = jest.fn();
    const element = document.createElement(
      "eo-dropdown-actions"
    ) as EoDropdownActions;
    element.actions = [
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
    ];
    element.addEventListener("action.click", onActionClick);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelectorAll("eo-menu-item")).toHaveLength(
      2
    );

    expect(
      element.shadowRoot?.querySelectorAll("eo-menu-item")[0].parentElement
        ?.tagName
    ).toBe("EO-LINK");
    expect(
      element.shadowRoot?.querySelectorAll("eo-menu-item")[1].parentElement
        ?.tagName
    ).not.toBe("EO-LINK");

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

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
