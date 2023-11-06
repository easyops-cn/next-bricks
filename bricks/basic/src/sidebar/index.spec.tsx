import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import { EoSidebar } from "./index.jsx";
import { SidebarMenu } from "@next-shared/general/types";
import { ExpandedState } from "./utils.jsx";
import "./sidebar-menu";
import "./sidebar-menu-group";
import "./sidebar-menu-submenu";
import "./sidebar-menu-item";
import * as generalMenu from "@next-shared/general/menu";
import * as runtime from "@next-core/runtime";

const observe = jest.fn();
const disconnect = jest.fn();
(global.IntersectionObserver as any) = jest.fn(() => ({
  observe,
  disconnect,
}));

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/runtime");
jest.mock("@next-core/react-runtime");
jest.spyOn(generalMenu, "initMenuItemAndMatchCurrentPathKeys").mockReturnValue({
  selectedKeys: ["2.0"],
  openedKeys: ["2"],
});
jest.spyOn(runtime, "getHistory").mockReturnValue({
  location: {
    pathname: "/test",
  },
  listen: () => {
    //
  },
} as any);
const getFeatureFlags = jest.fn();
jest.spyOn(runtime, "getRuntime").mockReturnValue({
  getFeatureFlags: getFeatureFlags.mockReturnValue({
    "sidebar-show-user-defined-icon": true,
  }),
} as any);
jest.useFakeTimers();

const menu = {
  title: "这是一个菜单标题",
  icon: {
    icon: "test",
    lib: "easyops",
    category: "default",
  },
  menuItems: [
    {
      icon: {
        icon: "chevron-circle-right",
        lib: "fa",
      },
      text: "item 1",
      to: "/nlicro-test3/breadcrumb/new",
      type: "default",
      children: [],
      key: "0",
    },
    {
      icon: {
        icon: "trash-alt",
        lib: "fa",
      },
      text: "item 2",
      to: "item 2",
      type: "default",
      children: [],
      key: "1",
    },
    {
      type: "subMenu",
      title: "sub 1",
      icon: {
        icon: "trash-can",
        lib: "fa",
      },
      items: [
        {
          icon: {
            icon: "message",
            lib: "fa",
          },
          text: "inner 1",
          to: "inner 1",
          type: "default",
          children: [],
          key: "2.0",
        },
        {
          icon: {
            icon: "text-height",
            lib: "fa",
          },
          text: "inner 2",
          to: "inner 2",
          type: "default",
          children: [],
          key: "2.1",
        },
      ],
      key: "2",
    },
    {
      icon: {
        icon: "user-times",
        lib: "fa",
      },
      text: "item 3",
      to: "item 3",
      type: "default",
      children: [],
      key: "3",
    },
    {
      type: "group",
      title: "group 1",
      items: [
        {
          icon: {
            icon: "message",
            lib: "fa",
          },
          text: "inner 3",
          to: "inner 3",
          type: "default",
          children: [],
          key: "4.0",
        },
        {
          icon: {
            icon: "circle-chevron-right",
            lib: "fa",
          },
          text: "inner 4",
          to: "inner 4",
          type: "default",
          children: [],
          key: "4.1",
        },
      ],
      key: "4",
    },
    {
      icon: {
        icon: "user-xmark",
        lib: "fa",
      },
      text: "item 4",
      to: "item 4",
      type: "default",
      children: [],
      key: "5",
    },
  ],
} as unknown as SidebarMenu;

describe("eo-sidebar", () => {
  test("basic layout", async () => {
    const element = document.createElement("eo-sidebar") as EoSidebar;

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".menu-title-point")).toBeTruthy();

    await act(async () => {
      element.menu = menu;
    });

    expect(element.shadowRoot?.querySelector(".menu-title-icon")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".content")?.childNodes)
      .toMatchInlineSnapshot(`
NodeList [
  <eo-sidebar-menu
    menu-collapsed=""
  >
    <eo-sidebar-menu-item
      menu-collapsed=""
    >
      item 1
    </eo-sidebar-menu-item>
    <eo-sidebar-menu-item
      menu-collapsed=""
    >
      item 2
    </eo-sidebar-menu-item>
    <eo-sidebar-menu-submenu
      menu-collapsed=""
    >
      <span
        slot="title"
      >
        sub 1
      </span>
      <eo-sidebar-menu-item
        menu-collapsed=""
        selected=""
      >
        inner 1
      </eo-sidebar-menu-item>
      <eo-sidebar-menu-item
        menu-collapsed=""
      >
        inner 2
      </eo-sidebar-menu-item>
    </eo-sidebar-menu-submenu>
    <eo-sidebar-menu-item
      menu-collapsed=""
    >
      item 3
    </eo-sidebar-menu-item>
    <eo-sidebar-menu-group
      menu-collapsed=""
    >
      <span
        slot="title"
      >
        group 1
      </span>
      <eo-sidebar-menu-item
        menu-collapsed=""
      >
        inner 3
      </eo-sidebar-menu-item>
      <eo-sidebar-menu-item
        menu-collapsed=""
      >
        inner 4
      </eo-sidebar-menu-item>
    </eo-sidebar-menu-group>
    <eo-sidebar-menu-item
      menu-collapsed=""
    >
      item 4
    </eo-sidebar-menu-item>
  </eo-sidebar-menu>,
  <div />,
]
`);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("fixed icon", async () => {
    getFeatureFlags.mockReturnValueOnce({
      "sidebar-show-user-defined-icon": false,
    });
    const onExpandedStateChange = jest.fn();
    const element = document.createElement("eo-sidebar") as EoSidebar;
    element.hiddenFixedIcon = true;
    element.menu = menu;
    element.addEventListener("expanded.state.change", onExpandedStateChange);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".menu-title-icon")).toBeFalsy();
    expect(element.shadowRoot?.querySelector(".state-collapsed")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".fixed-icon")).toBeFalsy();

    await act(async () => {
      element.hiddenFixedIcon = false;
    });
    expect(element.shadowRoot?.querySelector(".fixed-icon")).toBeTruthy();

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".fixed-icon") as HTMLElement
      );
    });
    expect(element.shadowRoot?.querySelector(".state-expanded")).toBeTruthy();
    expect(onExpandedStateChange).lastCalledWith(
      expect.objectContaining({
        detail: "expanded",
      })
    );

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".fixed-icon") as HTMLElement
      );
    });
    expect(element.shadowRoot?.querySelector(".state-collapsed")).toBeTruthy();
    expect(onExpandedStateChange).lastCalledWith(
      expect.objectContaining({
        detail: "collapsed",
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("hover", async () => {
    const onExpandedStateChange = jest.fn();
    const element = document.createElement("eo-sidebar") as EoSidebar;
    element.menu = menu;
    element.addEventListener("expanded.state.change", onExpandedStateChange);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".state-collapsed")).toBeTruthy();
    expect(
      (element.shadowRoot?.querySelector(".sidebar-container") as HTMLElement)
        ?.style.width
    ).toBe("60px");
    expect(
      (element.shadowRoot?.querySelector(".inner") as HTMLElement)?.style.width
    ).toBe("60px");

    act(() => {
      fireEvent.mouseEnter(
        element.shadowRoot?.querySelector(".sidebar-container") as HTMLElement
      );
    });
    expect(element.shadowRoot?.querySelector(".state-hovered")).toBeTruthy();
    expect(onExpandedStateChange).lastCalledWith(
      expect.objectContaining({
        detail: "hovered",
      })
    );
    expect(
      (element.shadowRoot?.querySelector(".sidebar-container") as HTMLElement)
        ?.style.width
    ).toBe("220px");
    expect(
      (element.shadowRoot?.querySelector(".inner") as HTMLElement)?.style.width
    ).toBe("220px");

    act(() => {
      fireEvent.mouseLeave(
        element.shadowRoot?.querySelector(".sidebar-container") as HTMLElement
      );
    });
    expect(element.shadowRoot?.querySelector(".state-collapsed")).toBeTruthy();
    expect(onExpandedStateChange).lastCalledWith(
      expect.objectContaining({
        detail: "collapsed",
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("hover with static position", async () => {
    const onExpandedStateChange = jest.fn();
    const element = document.createElement("eo-sidebar") as EoSidebar;
    element.menu = menu;
    element.position = "static";
    element.addEventListener("expanded.state.change", onExpandedStateChange);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".state-collapsed")).toBeTruthy();
    expect(
      (element.shadowRoot?.querySelector(".sidebar-container") as HTMLElement)
        ?.style.width
    ).toBe("60px");
    expect(
      (element.shadowRoot?.querySelector(".inner") as HTMLElement)?.style.width
    ).toBe("60px");

    act(() => {
      fireEvent.mouseEnter(
        element.shadowRoot?.querySelector(".sidebar-container") as HTMLElement
      );
    });
    expect(element.shadowRoot?.querySelector(".state-hovered")).toBeTruthy();
    expect(onExpandedStateChange).lastCalledWith(
      expect.objectContaining({
        detail: "hovered",
      })
    );
    expect(
      (element.shadowRoot?.querySelector(".sidebar-container") as HTMLElement)
        ?.style.width
    ).toBe("60px");
    expect(
      (element.shadowRoot?.querySelector(".inner") as HTMLElement)?.style.width
    ).toBe("220px");

    act(() => {
      fireEvent.mouseLeave(
        element.shadowRoot?.querySelector(".sidebar-container") as HTMLElement
      );
    });
    expect(element.shadowRoot?.querySelector(".state-collapsed")).toBeTruthy();
    expect(onExpandedStateChange).lastCalledWith(
      expect.objectContaining({
        detail: "collapsed",
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("resize", async () => {
    const onActualWidthChange = jest.fn();
    const element = document.createElement("eo-sidebar") as EoSidebar;
    element.menu = menu;
    element.expandedState = ExpandedState.Expanded;
    element.addEventListener("actual.width.change", onActualWidthChange);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".state-expanded")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".resize-line")).toBeTruthy();

    act(() => {
      fireEvent.mouseDown(
        element.shadowRoot?.querySelector(".resize-line") as HTMLElement
      );
    });
    expect(element.shadowRoot?.querySelector(".dragging")).toBeTruthy();

    act(() => {
      fireEvent.mouseMove(document.documentElement, { clientX: 500 });
      jest.runAllTimers();
    });
    expect(onActualWidthChange).lastCalledWith(
      expect.objectContaining({
        detail: 500,
      })
    );

    act(() => {
      fireEvent.mouseMove(document.documentElement, { clientX: 0 });
      jest.runAllTimers();
    });
    expect(onActualWidthChange).lastCalledWith(
      expect.objectContaining({
        detail: 220,
      })
    );

    act(() => {
      fireEvent.mouseUp(document.documentElement);
    });
    expect(element.shadowRoot?.querySelector(".dragging")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
