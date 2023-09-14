import { describe, test, expect } from "@jest/globals";
import { isGroup, isSubMenu, isSimple } from "./utils.js";

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
        title: "a",
        items: [],
        type: "group",
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
