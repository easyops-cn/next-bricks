import React from "react";
import { describe, test, expect, jest } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import { MenuGroup, SidebarMenuItem } from "./MenuGroup.js";
import { LaunchpadContextData, LaunchpadsContext } from "./LaunchpadContext.js";
import type {
  FavMenuItem,
  MenuItemData,
  MenuItemDataNormal,
  SidebarMenuItemData,
} from "./interfaces.js";
import { matchFavorite } from "./useLaunchpadInfo.js";

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
      name: "实例管理",
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
          name: "Dir APP",
        },
        {
          type: "custom",
          instanceId: "dir-cmdb-custom",
          name: "Dir Custom",
        },
      ],
    },
  ] as MenuItemData[];

  test("basic usage", async () => {
    const starred = [
      { type: "app", id: "cmdb-instances" },
      { type: "custom", instanceId: "dir-cmdb-custom" },
    ] as Partial<FavMenuItem>[] as FavMenuItem[];
    const pushRecentVisit = jest.fn();

    const getComponent = (searching: boolean) => (
      <LaunchpadsContext.Provider
        value={{
          searching,
          loadingFavorites: false,
          isStarred: (item) => {
            return starred.some((fav) => matchFavorite(item, fav));
          },
          toggleStar: (item) => {
            const index = starred.findIndex((fav) =>
              matchFavorite(item as MenuItemDataNormal, fav)
            );
            if (index > -1) {
              starred.splice(index, 1);
            } else {
              starred.push(item as MenuItemDataNormal);
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
      "menu-item starred can-star"
    );
    expect(getByText("Bar").parentElement?.parentElement?.className).toBe(
      "menu-item can-star"
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
      "menu-item can-star"
    );

    // 收藏
    fireEvent.click(
      getByText("实例管理").parentElement?.parentElement?.querySelector(
        '[title="收藏"]'
      ) as HTMLElement
    );
    rerender(getComponent(true));
    expect(getByText("实例管理").parentElement?.parentElement?.className).toBe(
      "menu-item starred can-star"
    );

    // 搜索后影响文件夹展开/折叠
    fireEvent.click(getByText("扩展").parentElement as HTMLElement);
    rerender(getComponent(true));
    expect(getByText("扩展").nextElementSibling).toHaveProperty("icon", "down");
  });
});

describe("SidebarMenuItem", () => {
  test.each<[string, SidebarMenuItemData]>([
    [
      "app",
      {
        type: "app",
        id: "cmdb-instances",
        name: "实例管理",
      },
    ],
    [
      "custom",
      {
        type: "custom",
        id: "foo",
        name: "Bar",
      },
    ],
    [
      "link",
      {
        favoriteId: "fav-3",
        type: "link",
        name: "割接链接",
        url: "/any-where",
      },
    ],
  ] as any)("%s", (type, item) => {
    const toggleStar = jest.fn();
    const pushRecentVisit = jest.fn();

    const { container } = render(
      <LaunchpadsContext.Provider
        value={
          {
            toggleStar,
            pushRecentVisit,
          } as Partial<LaunchpadContextData> as LaunchpadContextData
        }
      >
        <SidebarMenuItem item={item} />
      </LaunchpadsContext.Provider>
    );

    fireEvent.click(
      container.querySelector(".menu-item-remove") as HTMLElement
    );
    expect(toggleStar).toBeCalledWith(item);

    fireEvent.click(container.querySelector("eo-link") as HTMLElement);
    if (type === "link") {
      expect(pushRecentVisit).not.toBeCalled();
    } else {
      expect(pushRecentVisit).toBeCalledWith(item);
    }
  });
});
