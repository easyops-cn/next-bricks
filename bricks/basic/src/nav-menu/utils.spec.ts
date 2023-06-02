import { describe, test, expect } from "@jest/globals";
import {
  isGroup,
  isSubMenu,
  isSimple,
  initMenuItemAndMatchCurrentPathKeys,
} from "./utils.js";
import type { MenuItem, MenuGroup } from "../interface.js";

jest.mock("@next-core/theme", () => ({}));

jest.mock("@next-core/runtime", () => ({
  matchPath: (pathname: string, { path }: { path: string }) => {
    if (
      pathname &&
      path === pathname.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1")
    ) {
      return true;
    }
    return false;
  },
}));

describe("isGroup", () => {
  test("should work", () => {
    expect(
      isGroup({
        title: "a",
        items: [],
        type: "group",
      })
    ).toBeTruthy();

    expect(
      isGroup({
        text: "a",
        type: "default",
      })
    ).toBeFalsy();
  });
});

describe("isSubmenu", () => {
  test("should work", () => {
    expect(
      isSubMenu({
        title: "a",
        items: [],
        type: "subMenu",
      })
    ).toBeTruthy();

    expect(
      isSubMenu({
        text: "a",
        type: "default",
      })
    ).toBeFalsy();
  });
});

describe("isGroup", () => {
  test("should work", () => {
    expect(
      isSimple({
        text: "a",
        type: "default",
      })
    ).toBeTruthy();

    expect(
      isSimple({
        title: "a",
        items: [],
        type: "group",
      })
    ).toBeFalsy();
  });
});

describe("initMenuItemAndMatchCurrentPathKeys", () => {
  test("should work", async () => {
    const menuItems: MenuItem[] = [
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
    const { selectedKeys, openedKeys } = initMenuItemAndMatchCurrentPathKeys(
      menuItems,
      "/for/submenu",
      "",
      ""
    );
    expect(menuItems[0].key).toBe("0");
    expect(menuItems[1].key).toBe("1");
    expect((menuItems[1] as MenuGroup).items[0].key).toBe("1.0");
    expect(
      ((menuItems[1] as MenuGroup).items[1] as MenuGroup).items[0].key
    ).toBe("1.1.0");
    expect(selectedKeys).toEqual(["1.1.0"]);
    expect(openedKeys).toContain("1");
    expect(openedKeys).toContain("1.1");
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
