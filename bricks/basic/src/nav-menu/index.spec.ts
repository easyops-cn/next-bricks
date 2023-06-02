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

describe("basic.nav-menu", () => {
  test("basic usage", async () => {
    const element = document.createElement("basic.nav-menu") as NavMenu;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.menu = {
        title: "mock a",
        menuItems: [
          {
            text: "菜单一",
            type: "default",
          },
          {
            title: "菜单二",
            type: "subMenu",
            items: [
              {
                text: "菜单二-1",
                type: "default",
              },
              {
                title: "分组",
                type: "group",
                items: [
                  {
                    text: "分组1",
                    to: "/oops",
                    type: "default",
                  },
                  {
                    text: "分组2",
                    type: "default",
                  },
                ],
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
