import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { getRuntime } from "@next-core/runtime";
import { useCurrentApp } from "@next-core/react-runtime";
import "./";
import { EoFrameBreadcrumb } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/runtime");
jest.mock("@next-core/react-runtime");

const mockUseCurrentApp = useCurrentApp as jest.Mock;
const mockGetNavConfig = jest.fn();
const mockGetRuntime = getRuntime as jest.Mock;
mockGetRuntime.mockReturnValue({
  getNavConfig: mockGetNavConfig,
});

describe("eo-frame-breadcrumb", () => {
  test("should render breadcrumb from props", async () => {
    const element = document.createElement(
      "eo-frame-breadcrumb"
    ) as EoFrameBreadcrumb;
    element.breadcrumb = [
      {
        text: "prop 1",
        to: "/test",
      },
      {
        text: "prop 2",
      },
    ];

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelectorAll("eo-breadcrumb-item"))
      .toMatchInlineSnapshot(`
      NodeList [
        <eo-breadcrumb-item
          url="/test"
        >
          prop 1
        </eo-breadcrumb-item>,
        <eo-breadcrumb-item>
          prop 2
        </eo-breadcrumb-item>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("should render breadcrumb from nav config", async () => {
    const element = document.createElement(
      "eo-frame-breadcrumb"
    ) as EoFrameBreadcrumb;
    mockGetNavConfig.mockReturnValueOnce({
      breadcrumb: [
        {
          text: "nav config 1",
          to: "/test",
        },
        {
          text: "nav config 2",
        },
      ],
    });

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelectorAll("eo-breadcrumb-item"))
      .toMatchInlineSnapshot(`
      NodeList [
        <eo-breadcrumb-item
          url="/test"
        >
          nav config 1
        </eo-breadcrumb-item>,
        <eo-breadcrumb-item>
          nav config 2
        </eo-breadcrumb-item>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("should render breadcrumb from current app and has breadcrumb items", async () => {
    const element = document.createElement(
      "eo-frame-breadcrumb"
    ) as EoFrameBreadcrumb;
    mockUseCurrentApp.mockReturnValueOnce({
      localeName: "app-a",
      menuIcon: {
        icon: "app-icon",
      },
      breadcrumb: {
        items: [
          {
            text: "current app 1",
            to: "/test",
          },
          {
            text: "current app 2",
          },
        ],
      },
    });

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelectorAll("eo-breadcrumb-item"))
      .toMatchInlineSnapshot(`
      NodeList [
        <eo-breadcrumb-item
          url="/test"
        >
          <eo-icon
            class="breadcrumb-item-prefix-icon"
            icon="home"
            lib="antd"
            slot="prefix"
            theme="outlined"
          />
          current app 1
        </eo-breadcrumb-item>,
        <eo-breadcrumb-item>
          current app 2
        </eo-breadcrumb-item>,
        <eo-breadcrumb-item>
          app-a
        </eo-breadcrumb-item>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("should render breadcrumb from current app with custom icon", async () => {
    const element = document.createElement(
      "eo-frame-breadcrumb"
    ) as EoFrameBreadcrumb;
    mockUseCurrentApp.mockReturnValueOnce({
      localeName: "app-a",
      menuIcon: {
        icon: "app-icon",
      },
      breadcrumb: {
        items: [
          {
            text: "current app 1",
            to: "/test",
            icon: {
              lib: "antd",
              icon: "edit",
            },
          },
          {
            text: "current app 2",
          },
        ],
      },
    });

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelectorAll("eo-breadcrumb-item"))
      .toMatchInlineSnapshot(`
      NodeList [
        <eo-breadcrumb-item
          url="/test"
        >
          <eo-icon
            class="breadcrumb-item-prefix-icon"
            icon="edit"
            lib="antd"
            slot="prefix"
          />
          current app 1
        </eo-breadcrumb-item>,
        <eo-breadcrumb-item>
          current app 2
        </eo-breadcrumb-item>,
        <eo-breadcrumb-item>
          app-a
        </eo-breadcrumb-item>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("should render breadcrumb from current app and without breadcrumb items", async () => {
    const element = document.createElement(
      "eo-frame-breadcrumb"
    ) as EoFrameBreadcrumb;
    mockUseCurrentApp.mockReturnValueOnce({
      localeName: "app-a",
      homepage: "/app-a",
      menuIcon: {
        icon: "app-icon",
      },
    });

    element.breadcrumb = [
      {
        text: "prop 1",
        to: "/test",
      },
      {
        text: "prop 2",
      },
    ];

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelectorAll("eo-breadcrumb-item"))
      .toMatchInlineSnapshot(`
      NodeList [
        <eo-breadcrumb-item
          url="/app-a"
        >
          <eo-icon
            class="breadcrumb-item-prefix-icon"
            icon="app-icon"
            slot="prefix"
          />
          app-a
        </eo-breadcrumb-item>,
        <eo-breadcrumb-item
          url="/test"
        >
          prop 1
        </eo-breadcrumb-item>,
        <eo-breadcrumb-item>
          prop 2
        </eo-breadcrumb-item>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("should render with menu", async () => {
    const element = document.createElement(
      "eo-frame-breadcrumb"
    ) as EoFrameBreadcrumb;
    mockUseCurrentApp.mockReturnValueOnce({
      localeName: "app-a",
      homepage: "/app-a",
      menuIcon: {
        icon: "app-icon",
      },
      breadcrumb: {
        useCurrentMenuTitle: true,
      },
    });

    element.menu = {
      title: "menu",
      link: "/menu",
      icon: {
        icon: "menu-icon",
      } as any,
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelectorAll("eo-breadcrumb-item"))
      .toMatchInlineSnapshot(`
      NodeList [
        <eo-breadcrumb-item>
          <eo-icon
            class="breadcrumb-item-prefix-icon"
            icon="app-icon"
            slot="prefix"
          />
          app-a
        </eo-breadcrumb-item>,
        <eo-breadcrumb-item
          url="/menu"
        >
          <eo-icon
            class="breadcrumb-item-prefix-icon"
            icon="menu-icon"
            slot="prefix"
          />
          menu
        </eo-breadcrumb-item>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("should render with noCurrentApp", async () => {
    const element = document.createElement(
      "eo-frame-breadcrumb"
    ) as EoFrameBreadcrumb;
    mockUseCurrentApp.mockReturnValueOnce({
      localeName: "app-a",
      homepage: "/app-a",
      menuIcon: {
        icon: "app-icon",
      },
    });
    element.noCurrentApp = true;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll("eo-breadcrumb-item")
    ).toMatchInlineSnapshot(`NodeList []`);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
