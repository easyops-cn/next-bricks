import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { NavMenu } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

jest.mock("@next-core/runtime", () => ({
  getHistory: () => ({
    location: {},
    listen: () => {
      //
    },
    createHref: () => "/oops",
  }),
  matchPath: () => true,
}));

describe("eo-nav-menu", () => {
  test("basic usage", async () => {
    (window as any).ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
    const element = document.createElement("eo-nav-menu") as NavMenu;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.menu = {
        title: "mock a",
        menuItems: [
          {
            text: "菜单一",
            type: "default",
            key: "menu 1",
          },
          {
            title: "菜单二",
            type: "subMenu",
            key: "menu 2",
            items: [
              {
                text: "菜单二-1",
                type: "default",
                key: "menu 3",
              },
              {
                title: "分组",
                type: "group",
                key: "menu 4",
                items: [
                  {
                    text: "分组1",
                    to: "/oops",
                    type: "default",
                    key: "menu 5",
                  },
                  {
                    text: "分组2",
                    type: "default",
                    key: "menu 6",
                  },
                ],
              },
            ],
          },
          {
            title: "菜单三",
            type: "group",
            childLayout: "siteMap",
            groupFrom: "platformMenus",
            groupId: "platformMenus",
            items: [
              {
                childLayout: "default",

                items: [
                  {
                    text: "MySQL",
                    to: "/database-service-monitor/MySQL",
                    type: "default",
                  },
                ],
                key: "2.0",
                title: "数据库服务",
                type: "group",
              },
            ],
          },
        ],
      };
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.innerHTML).toMatchSnapshot();

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
