import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { EoSidebarSubMenu } from "./index.js";
import * as GeneralMenu from "@next-shared/general/menu";

jest.mock("@next-core/theme", () => ({}));

jest.spyOn(GeneralMenu, "initMenuItemAndMatchCurrentPathKeys").mockReturnValue({
  selectedKeys: [],
  openedKeys: [],
  matchedKeys: [],
});

jest.mock("@next-core/runtime", () => ({
  getHistory: () => ({
    location: {
      pathname: "/test",
    },
    listen: () => {
      //
    },
    createHref: () => "/oops",
  }),
  matchPath: () => true,
}));

describe("eo-sidebar-sub-menu", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-sidebar-sub-menu"
    ) as EoSidebarSubMenu;

    element.menu = {
      title: "mock data",
      menuItems: [
        {
          exact: true,
          icon: { icon: "cube", lib: "fa" },
          text: "测试标题",
          to: "/developers/brick-book/atom/sub-menu",
          type: "default",
          key: "0",
        },
        {
          items: [
            {
              icon: { category: "model", icon: "host", lib: "easyops" },
              text: "主机测试兼容复杂场景",
              to: "/developers/brick-book/atom/sub-menu/1",
              key: "1.0",
            },
            {
              icon: { category: "model", icon: "docker-image", lib: "easyops" },
              text: "Docker",
              to: "/developers/brick-book/atom/sub-menu/2",
              key: "1.1",
            },
          ],
          title: "平台资源",
          type: "group",
          key: "1",
        },
        {
          items: [
            {
              icon: { category: "model", icon: "admin", lib: "easyops" },
              text: "开发负责人",
              to: "/developers/brick-book/atom/sub-menu/3",
              key: "2.0",
            },
            {
              icon: { category: "model", icon: "admin", lib: "easyops" },
              text: "运维负责人",
              to: "/developers/brick-book/atom/sub-menu/4",
              key: "2.1",
            },
            {
              icon: { category: "model", icon: "admin", lib: "easyops" },
              text: "测试负责人",
              to: "/developers/brick-book/atom/sub-menu/5",
              key: "2.2",
            },
          ],
          title: "负责人",
          type: "group",
          key: "2",
        },
        {
          items: [
            {
              icon: { category: "model", icon: "app", lib: "easyops" },
              items: [
                {
                  items: [
                    {
                      text: "被调方",
                      to: "/developers/brick-book/atom/sub-menu/6",
                      key: "3.0.0.0",
                    },
                  ],
                  title: "被调方",
                  type: "subMenu",
                  key: "3.0.0",
                },
                {
                  text: "被调方",
                  to: "/developers/brick-book/atom/sub-menu/7",
                  key: "3.0.1",
                },
              ],
              title: "被调方",
              type: "subMenu",
              key: "3.0",
            },
            {
              icon: { category: "model", icon: "app", lib: "easyops" },
              items: [
                {
                  text: "被调方",
                  to: "/developers/brick-book/atom/sub-menu/8",
                  key: "3.1.0",
                },
              ],
              title: "被调方",
              type: "subMenu",
              key: "3.1",
            },
          ],
          title: "调用关系",
          type: "group",
          key: "3",
        },
      ],
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.childNodes.length).toEqual(2);

    expect(
      element.shadowRoot?.querySelector("eo-menu-item")?.textContent
    ).toEqual("测试标题");

    expect(
      element.shadowRoot?.querySelectorAll("eo-menu-group").length
    ).toEqual(3);

    expect(
      element.shadowRoot?.querySelectorAll("eo-menu-item-sub-menu").length
    ).toEqual(3);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
