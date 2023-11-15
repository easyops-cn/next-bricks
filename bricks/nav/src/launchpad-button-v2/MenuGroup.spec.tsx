import React from "react";
import { describe, test, expect, jest } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import { MenuGroup } from "./MenuGroup.js";
import { DesktopItem } from "../launchpad/interfaces.js";
import { LaunchpadsContext } from "./LaunchpadContext.js";
import type { FavMenuItem } from "./interfaces.js";

class WithShadowElement extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    shadow.append(slot);
  }
}

customElements.define(
  "eo-icon",
  class extends WithShadowElement {
    lib: any;
    icon: any;
    theme: any;
    prefix: any;
    category: any;
  }
);

customElements.define(
  "eo-link",
  class extends WithShadowElement {
    //
  }
);

describe("MenuGroup", () => {
  const menuItems = [
    {
      type: "app",
      id: "cmdb-instances",
      app: {
        id: "cmdb-instances",
        localeName: "实例管理",
      },
    },
    {
      type: "custom",
      id: "foo",
      name: "Bar",
    },
    {
      type: "dir",
      id: "extends",
      name: "扩展",
      items: [
        {
          type: "app",
          id: "dir-cmdb-app",
          app: {
            id: "dir-cmdb-app",
            localeName: "Dir APP",
          },
        },
        {
          type: "custom",
          id: "dir-cmdb-custom",
          name: "Dir Custom",
        },
      ],
    },
  ] as DesktopItem[];

  test("basic usage", async () => {
    const starred = [
      { type: "app", id: "cmdb-instances" },
      { type: "custom", id: "dir-cmdb-custom" },
    ];
    const pushRecentVisit = jest.fn();

    const getComponent = (searching: boolean) => (
      <LaunchpadsContext.Provider
        value={{
          searching,
          isStarred: (item: FavMenuItem) => {
            return starred.some(
              (star) => star.type === item.type && star.id === item.id
            );
          },
          toggleStar: (item: FavMenuItem) => {
            const index = starred.findIndex(
              (star) => star.type === item.type && star.id === item.id
            );
            if (index > -1) {
              starred.splice(index, 1);
            } else {
              starred.push(item);
            }
          },
          pushRecentVisit,
        }}
      >
        <MenuGroup name="CMDB" items={menuItems} />
      </LaunchpadsContext.Provider>
    );

    const { getByText, rerender } = render(getComponent(false));

    expect(getByText("实例管理").parentElement?.parentElement?.className).toBe(
      "menu-item starred"
    );
    expect(getByText("Bar").parentElement?.parentElement?.className).toBe(
      "menu-item"
    );

    // 最近访问
    expect(pushRecentVisit).toBeCalledTimes(0);
    fireEvent.click(
      getByText("Bar").parentElement?.parentElement?.querySelector(
        "eo-link"
      ) as HTMLElement
    );
    expect(pushRecentVisit).toBeCalledTimes(1);
    expect(pushRecentVisit).toBeCalledWith({
      type: "custom",
      id: "foo",
      name: "Bar",
    });

    // 文件夹展开/折叠
    expect(getByText("扩展").nextElementSibling).toHaveProperty("icon", "down");
    fireEvent.click(getByText("扩展").parentElement as HTMLElement);
    rerender(getComponent(false));
    expect(getByText("扩展").nextElementSibling).toHaveProperty("icon", "up");

    // 取消收藏
    fireEvent.click(
      getByText("实例管理").parentElement?.parentElement?.querySelector(
        '[title="取消收藏"]'
      ) as HTMLElement
    );
    // 搜索后影响文件夹展开/折叠
    rerender(getComponent(true));
    expect(getByText("扩展").nextElementSibling).toHaveProperty("icon", "up");
    expect(getByText("实例管理").parentElement?.parentElement?.className).toBe(
      "menu-item"
    );

    // 收藏
    fireEvent.click(
      getByText("实例管理").parentElement?.parentElement?.querySelector(
        '[title="收藏"]'
      ) as HTMLElement
    );
    rerender(getComponent(true));
    expect(getByText("实例管理").parentElement?.parentElement?.className).toBe(
      "menu-item starred"
    );

    // 搜索后影响文件夹展开/折叠
    fireEvent.click(getByText("扩展").parentElement as HTMLElement);
    rerender(getComponent(true));
    expect(getByText("扩展").nextElementSibling).toHaveProperty("icon", "down");
  });
});
