import { createHistory } from "@next-core/runtime";
import { initMenuItemAndMatchCurrentPathKeys, matchMenuItem } from "./menu.js";
import type { SidebarMenuGroup, SidebarMenuItem } from "./types.js";

createHistory();

describe("initMenuItemAndMatchCurrentPathKeys", () => {
  it("should return selectedKeys and openedKeys", () => {
    const menuItems: SidebarMenuItem[] = [
      {
        text: "for-good",
        to: "/for/good",
        activeIncludes: ["/for/good"],
      },
      {
        type: "group",
        title: "grouped",
        items: [
          {
            text: "for-perfect",
            to: "/for/perfect",
            activeExcludes: ["/for/perfect/aaa"],
          },
          {
            type: "subMenu",
            title: "subMenu",
            items: [
              {
                text: "for-submenu",
                to: "/for/submenu",
              },
            ],
          },
        ],
      },
    ];
    const { selectedKeys, openedKeys, matchedKeys } =
      initMenuItemAndMatchCurrentPathKeys(menuItems, "/for/submenu", "", "");
    expect(menuItems[0].key).toBe("0");
    expect(menuItems[1].key).toBe("1");
    expect((menuItems[1] as SidebarMenuGroup).items[0].key).toBe("1.0");
    expect(
      ((menuItems[1] as SidebarMenuGroup).items[1] as SidebarMenuGroup).items[0]
        .key
    ).toBe("1.1.0");
    expect(selectedKeys).toEqual(["1.1.0"]);
    expect(openedKeys).toContain("1");
    expect(openedKeys).toContain("1.1");
    expect(matchedKeys).toEqual(["1", "1.1", "1.1.0"]);

    const { selectedKeys: selectedKeys2, openedKeys: openedKeys2 } =
      initMenuItemAndMatchCurrentPathKeys(
        menuItems,
        "/for/perfect",
        "",
        "prefix"
      );
    expect(selectedKeys2).toEqual(["prefix.1.0"]);
    expect(openedKeys2).toContain("prefix.1");
    expect(openedKeys2).not.toContain("prefix.1.1");
  });
});

describe("matchMenuItem", () => {
  it("matchMenuItem exact match should ok", () => {
    const item = {
      text: "mysql资源管理",
      to: "/mysql-resource/detail",
      exact: true,
    };
    const pathname = "/mysql-resource/detail";
    expect(matchMenuItem(item, pathname, "")).toBe(true);
  });

  it("matchMenuItem not exact match should ok", () => {
    const item = {
      text: "mysql资源管理",
      to: "/mysql-resource/detail",
      exact: true,
    };
    const pathname = "/mysql-resource/detail/xxxxx";
    expect(matchMenuItem(item, pathname, "")).toBe(false);
  });

  it("matchMenuItem with activeIncludes", () => {
    const item = {
      text: "mysql资源管理",
      to: "/mysql-resource/detail",
      exact: true,
      activeIncludes: ["/home", "/home/aaa"],
    };
    const pathname = "/home";
    expect(matchMenuItem(item, pathname, "")).toBe(true);
  });

  it("matchMenuItem with activeExcludes", () => {
    const item = {
      text: "mysql资源管理",
      to: "/mysql-resource/detail",
      exact: false,
      activeExcludes: ["/mysql-resource/detail/monitor/xxx"],
    };
    const pathname = "/mysql-resource/detail/aaaa";
    expect(matchMenuItem(item, pathname, "")).toBe(true);
    const pathname2 = "/mysql-resource/detail/monitor/xxx";
    expect(matchMenuItem(item, pathname2, "")).toBe(false);
  });

  it("matchMenuItem with activeMatchSearch", () => {
    const item = {
      text: "mysql资源管理",
      to: "/mysql-resource/detail?appId=abc",
      exact: false,
      activeMatchSearch: true,
    };
    const pathname = "/mysql-resource/detail";
    expect(matchMenuItem(item, pathname, "")).toBe(false);
    expect(matchMenuItem(item, pathname, "?appId=abc")).toBe(true);
    expect(matchMenuItem(item, pathname, "?appId=abc&clusterId=xyz")).toBe(
      true
    );
    expect(matchMenuItem(item, pathname, "?clusterId=xyz")).toBe(false);
  });

  it("matchMenuItem with activeMatchSearch and activeIncludes", () => {
    const item = {
      text: "mysql资源管理",
      to: "/mysql-resource/detail?appId=default",
      exact: false,
      activeMatchSearch: true,
      activeIncludes: ["/mysql-resource/detail?appId="],
    };
    const pathname = "/mysql-resource/detail";
    expect(matchMenuItem(item, pathname, "")).toBe(true);
    expect(matchMenuItem(item, pathname, "?appId=default")).toBe(true);
    expect(matchMenuItem(item, pathname, "?appId=")).toBe(true);
    expect(matchMenuItem(item, pathname, "?appId=other")).toBe(false);
    expect(matchMenuItem(item, pathname, "?k=1")).toBe(true);
  });
});
