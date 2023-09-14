import React from "react";
import { describe, test, expect } from "@jest/globals";
import { ThreeLevelMenuPopoverContent } from "./ThreeLevelMenuPopoverContent.js";
import { act, render, fireEvent } from "@testing-library/react";

describe("basic function", () => {
  test("", () => {
    const { asFragment, container, unmount } = render(
      <ThreeLevelMenuPopoverContent
        selectedKey={["1-1-0"]}
        menuItem={{
          title: "接口与数据",
          type: "subMenu",
          key: "1",
          items: [
            {
              title: "Api Gateway",
              type: "group",
              key: "1-0",
              items: [{ text: "特性开关", key: "1-0-0" }],
            },
            {
              title: "测试组",
              type: "group",
              key: "1-1",
              items: [{ text: "挂件", key: "1-1-0" }],
            },
          ],
        }}
      />
    );

    const searchWrapper = container.querySelector("eo-search");
    fireEvent.focus(searchWrapper as Element);
    expect(container.querySelector(".active")).toBeTruthy();

    act(() => {
      fireEvent(
        searchWrapper as HTMLElement,
        new CustomEvent("search", { detail: "开关" })
      );
    });
    expect(
      container.querySelectorAll(
        ".three-level-menu-search-result .menu-item-label"
      ).length
    ).toBe(1);
    act(() => {
      fireEvent(
        searchWrapper as HTMLElement,
        new CustomEvent("search", { detail: "" })
      );
    });

    expect(
      container.querySelectorAll(
        ".three-level-menu-search-result .menu-item-label"
      ).length
    ).toBe(0);
    expect(
      container.querySelectorAll(".three-level-menu-search-history-text").length
    ).toBe(1);
    fireEvent.blur(searchWrapper as Element);
    unmount();
  });
});
