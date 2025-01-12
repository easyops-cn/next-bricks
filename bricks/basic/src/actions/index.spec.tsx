import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent, createEvent } from "@testing-library/dom";
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
          {
            text: "h",
            key: "h",
            url: "/h",
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
      7
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

    let clickEventOfMenuItem0: Event | undefined;
    act(() => {
      const target = element.shadowRoot!.querySelectorAll("eo-menu-item")[0];
      clickEventOfMenuItem0 = createEvent.click(target);
      fireEvent(target, clickEventOfMenuItem0);
    });
    expect(clickEventOfMenuItem0?.defaultPrevented).toBeFalsy();
    expect(onActionClick).lastCalledWith(
      expect.objectContaining({
        detail: {
          text: "a",
          event: "a.click",
          url: "/test",
        },
      })
    );

    let clickEventOfMenuItem2: Event | undefined;
    act(() => {
      const target = element.shadowRoot!.querySelectorAll("eo-menu-item")[2];
      clickEventOfMenuItem2 = createEvent.click(target);
      fireEvent(target, clickEventOfMenuItem2);
    });
    expect(clickEventOfMenuItem2?.defaultPrevented).toBeTruthy();

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll("eo-menu-item")[5] as HTMLElement
      );
    });
    expect(onActionClick).toBeCalled();

    expect(
      element.shadowRoot?.querySelectorAll("eo-link")[1].getAttribute("url")
    ).toBe("/h");

    act(() => {
      fireEvent.click(
        element
          .shadowRoot!.querySelectorAll("eo-link")[1]
          .querySelector("eo-menu-item")!
      );
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("item draggable", async () => {
    const onItemDragStart = jest.fn();
    const onItemDragEnd = jest.fn();

    const element = document.createElement("eo-actions") as EoActions;
    element.itemDraggable = true;
    element.actions = [
      {
        text: "drag item 1",
        dragConf: {
          format: "text/plain",
          data: {
            a: 1,
          },
        },
      },
      {
        text: "drag item 2",
        dragConf: {
          format: "text/plain",
          data: {
            a: 2,
          },
        },
      },
    ];
    element.addEventListener("item.drag.start", onItemDragStart);
    element.addEventListener("item.drag.start", onItemDragEnd);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    act(() => {
      fireEvent.dragStart(
        element.shadowRoot?.querySelectorAll("eo-menu-item")[0] as HTMLElement
      );
    });
    expect(onItemDragStart).toBeCalled();

    act(() => {
      fireEvent.dragEnd(
        element.shadowRoot?.querySelectorAll("eo-menu-item")[0] as HTMLElement
      );
    });
    expect(onItemDragEnd).toBeCalled();

    act(() => {
      document.body.removeChild(element);
    });
  });
});
