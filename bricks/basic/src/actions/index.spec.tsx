import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import type { EoActions } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-actions", () => {
  test("basic usage", async () => {
    const onActionClick = jest.fn();
    const element = document.createElement("eo-actions") as EoActions;
    element.checkedKeys = ["f"];
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
      {
        text: "e",
        items: [
          {
            text: "f",
            key: "f",
            event: "f.click",
          },
          {
            text: "g",
            key: "g",
            event: "g.click",
          },
        ],
      },
    ];
    element.addEventListener("action.click", onActionClick);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelectorAll("eo-menu-item")).toHaveLength(
      6
    );
    expect(
      element.shadowRoot?.querySelectorAll(".menu-item-divider")
    ).toHaveLength(2);

    expect(element.shadowRoot?.querySelectorAll(".popover")).toHaveLength(1);

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

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll("eo-menu-item")[5] as HTMLElement
      );
    });
    expect(onActionClick).toBeCalled();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
