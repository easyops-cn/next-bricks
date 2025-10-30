import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
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
    expect(onActionClick).toHaveBeenLastCalledWith(
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
    expect(onActionClick).toHaveBeenCalled();

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
    expect(onItemDragStart).toHaveBeenCalled();

    act(() => {
      fireEvent.dragEnd(
        element.shadowRoot?.querySelectorAll("eo-menu-item")[0] as HTMLElement
      );
    });
    expect(onItemDragEnd).toHaveBeenCalled();

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("activeKeys", async () => {
    const element = document.createElement("eo-actions") as EoActions;
    element.actions = [
      {
        text: "a",
        key: "a",
        items: [
          {
            text: "a-1",
            key: "a-1",
          },
          {
            text: "a-2",
            key: "a-2",
          },
        ],
      },
      {
        text: "b",
        key: "b",
        items: [
          {
            text: "b-1",
            key: "b-1",
          },
          {
            text: "b-2",
            key: "b-2",
          },
        ],
      },
    ];

    act(() => {
      document.body.appendChild(element);
    });

    const popovers = element.shadowRoot?.querySelectorAll(".popover");
    const firstSubMenuItem = popovers?.[0]?.querySelector(
      "eo-menu-item"
    ) as HTMLElement;
    const firstSubMenuItemChild =
      firstSubMenuItem?.nextElementSibling?.querySelector(
        "eo-menu-item"
      ) as HTMLElement;
    const secondSubMenuItem = popovers?.[1]?.querySelector(
      "eo-menu-item"
    ) as HTMLElement;

    expect(firstSubMenuItem.classList.contains("menu-item-active")).toBe(false);
    expect(firstSubMenuItemChild.classList.contains("menu-item-active")).toBe(
      false
    );
    expect(secondSubMenuItem.classList.contains("menu-item-active")).toBe(
      false
    );

    element.activeKeys = ["a"];
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(firstSubMenuItem.classList.contains("menu-item-active")).toBe(true);
    expect(firstSubMenuItemChild.classList.contains("menu-item-active")).toBe(
      false
    );
    expect(secondSubMenuItem.classList.contains("menu-item-active")).toBe(
      false
    );

    element.activeKeys = ["a", "a-1"];
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(firstSubMenuItem.classList.contains("menu-item-active")).toBe(true);
    expect(firstSubMenuItemChild.classList.contains("menu-item-active")).toBe(
      true
    );
    expect(secondSubMenuItem.classList.contains("menu-item-active")).toBe(
      false
    );

    element.activeKeys = ["b"];
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(firstSubMenuItem.classList.contains("menu-item-active")).toBe(false);
    expect(firstSubMenuItemChild.classList.contains("menu-item-active")).toBe(
      false
    );
    expect(secondSubMenuItem.classList.contains("menu-item-active")).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("group", async () => {
    const element = document.createElement("eo-actions") as EoActions;
    element.actions = [
      {
        type: "group",
        text: "Group 1",
      },
      {
        text: "Action 1",
        key: "action1",
      },
      {
        text: "Action 2",
        key: "action2",
      },
      {
        type: "divider",
      },
      {
        type: "group",
        text: "Group 2",
      },
      {
        text: "Action 3",
        key: "action3",
      },
      {
        text: "Sub Menu",
        key: "submenu",
        items: [
          {
            type: "group",
            text: "Sub Group 1",
          },
          {
            text: "Sub Action 1",
            key: "sub-action1",
          },
          {
            text: "Sub Action 2",
            key: "sub-action2",
          },
          {
            type: "group",
            text: "Sub Group 2",
          },
          {
            text: "Sub Action 3",
            key: "sub-action3",
          },
        ],
      },
    ];

    act(() => {
      document.body.appendChild(element);
    });

    const menu = element.shadowRoot?.querySelector("eo-menu");
    expect(menu?.classList.contains("grouped")).toBe(true);

    const groupLabels = element.shadowRoot?.querySelectorAll(".group-label");
    expect(groupLabels).toHaveLength(4);
    expect(groupLabels?.[0].textContent).toBe("Group 1");
    expect(groupLabels?.[1].textContent).toBe("Group 2");
    expect(groupLabels?.[2].textContent).toBe("Sub Group 1");
    expect(groupLabels?.[3].textContent).toBe("Sub Group 2");

    const menuItems = element.shadowRoot?.querySelectorAll("eo-menu-item");
    expect(menuItems).toHaveLength(7);

    const dividers = element.shadowRoot?.querySelectorAll(".menu-item-divider");
    expect(dividers).toHaveLength(1);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("footerTips", async () => {
    const element = document.createElement("eo-actions") as EoActions;
    element.actions = [
      {
        text: "Action 1",
        key: "action1",
      },
      {
        text: "Action 2",
        key: "action2",
      },
    ];
    element.footerTips = "This is a footer tip";

    act(() => {
      document.body.appendChild(element);
    });

    const footer = element.shadowRoot?.querySelector(".footer");
    expect(footer).toBeTruthy();
    expect(footer?.textContent).toBe("This is a footer tip");

    act(() => {
      document.body.removeChild(element);
    });
  });
});
