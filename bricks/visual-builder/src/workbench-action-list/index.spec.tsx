import React from "react";
import { describe, test, expect } from "@jest/globals";
import { render, prettyDOM, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { createHistory, getHistory } from "@next-core/runtime";
import { initMenuItemAndMatchCurrentPathKeys } from "@next-shared/general/menu";
import "./index.jsx";
import {
  WorkbenchActionList,
  WorkbenchActionListComponent,
  SidebarMenu,
} from "./index.jsx";

jest.mock("@next-shared/general/menu", () => ({
  initMenuItemAndMatchCurrentPathKeys: jest.fn().mockImplementation(() => {
    return {
      selectedKeys: ["1"],
    };
  }),
}));

createHistory();
describe("visual-builder.workbench-action-list", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.workbench-action-list"
    ) as WorkbenchActionList;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.appId = "visual-builder";
      element.menu = {
        title: "侧边栏菜单",
        icon: {
          icon: "align-left",
          lib: "fa",
          prefix: "fas",
        },
        menuItems: [
          {
            activeExcludes: [],
            activeIncludes: [
              "/visual-builder/project/:projectId/app/:appId/route/:root",
              "/visual-builder/project/:projectId/app/:appId/boards",
              "/visual-builder/project/:projectId/app/:appId/boards-redirect",
            ],
            activeMatchSearch: false,
            exact: false,
            icon: {
              icon: "copy",
              lib: "antd",
              theme: "outlined",
            },
            text: "路由",
            to: "/visual-builder/project/5d99c1b1b0cdb/app/visual-builder/routes",
            type: "default",
            key: "0",
          },
          {
            activeExcludes: [],
            activeIncludes: [],
            activeMatchSearch: false,
            exact: false,
            icon: {
              icon: "search",
              lib: "antd",
              theme: "outlined",
            },
            text: "搜索",
            to: "/visual-builder/project/5d99c1b1b0cdb/app/visual-builder/storyboard-search",
            type: "default",
            key: "1",
          },
          {
            activeExcludes: [],
            activeIncludes: [
              "/visual-builder/project/5d99c1b1b0cdb/app/visual-builder/menu/:type",
            ],
            activeMatchSearch: false,
            exact: false,
            icon: {
              icon: "unordered-list",
              lib: "antd",
              theme: "outlined",
            },
            text: "菜单",
            to: "/visual-builder/project/5d99c1b1b0cdb/app/visual-builder/menus",
            type: "default",
            key: "2",
          },
        ],
      };
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(
      element.shadowRoot.querySelectorAll("visual-builder\\.workbench-action")
        .length
    ).toEqual(3);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("render WorkbenchActionListComponent", () => {
    const menu = {
      title: "侧边栏菜单",
      icon: {
        icon: "align-left",
        lib: "fa",
        prefix: "fas",
      },
      menuItems: [
        {
          activeExcludes: [],
          activeIncludes: [],
          activeMatchSearch: false,
          exact: false,
          icon: {
            icon: "down",
            lib: "antd",
            theme: "outlined",
          },
          text: "路由",
          href: "https://dev.easuops.local/next",
          type: "default",
          key: "0",
        },
        {
          activeExcludes: [],
          activeIncludes: [],
          activeMatchSearch: false,
          exact: false,
          icon: {
            icon: "search",
            lib: "antd",
            theme: "outlined",
          },
          text: "搜索",
          to: "/visual-builder/project/5d99c1b1b0cdb/app/visual-builder/storyboard-search",
          type: "default",
          key: "1",
        },
        {
          activeExcludes: [],
          activeIncludes: [
            "/visual-builder/project/5d99c1b1b0cdb/app/visual-builder/menu/:type",
          ],
          activeMatchSearch: false,
          exact: false,
          icon: {
            icon: "unordered-list",
            lib: "antd",
            theme: "outlined",
          },
          text: "菜单",
          to: "/visual-builder/project/5d99c1b1b0cdb/app/visual-builder/menus",
          type: "default",
          key: "2",
        },
      ],
    } as SidebarMenu;

    const { container, rerender } = render(
      <WorkbenchActionListComponent appId="visual-builder" menu={menu} />
    );

    prettyDOM(container);

    const firstIcon = container.querySelectorAll(
      "visual-builder\\.workbench-action"
    )[0];
    act(() => {
      fireEvent.click(firstIcon);
    });

    expect(firstIcon.getAttribute("href")).toEqual(
      "https://dev.easuops.local/next"
    );

    const secondIcon = container.querySelectorAll(
      "visual-builder\\.workbench-action"
    )[1];

    act(() => {
      fireEvent.click(secondIcon);
    });

    rerender(<WorkbenchActionListComponent appId="new-test" menu={menu} />);

    act(() => {
      const history = getHistory();
      history.push("/visual-builder/images");
    });
    rerender(<WorkbenchActionListComponent appId="new-test" menu={menu} />);

    expect(initMenuItemAndMatchCurrentPathKeys).toBeCalledTimes(2);
    expect(initMenuItemAndMatchCurrentPathKeys).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      "/visual-builder/images",
      "",
      ""
    );
  });
});
