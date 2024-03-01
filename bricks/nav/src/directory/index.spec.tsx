import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoDirectory } from "./index.js";
import { fireEvent } from "@testing-library/react";

jest.mock("@next-core/theme", () => ({}));

describe("eo-directory", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-directory") as EoDirectory;
    element.directoryTitle = "目录标题";
    element.menuItems = [
      {
        title: "菜单项",
        key: "key1",
        type: "group",
        children: [
          {
            title: "子菜单项",
            key: "child1",
          },
        ],
        suffixIcon: {
          lib: "antd",
          icon: "plus-circle",
          theme: "outlined",
        },
      },
      {
        title: "菜单项2",
        key: "key2",
        type: "group",
        children: [
          {
            title: "子菜单项2",
            key: "child2",
          },
        ],
        suffixIcon: {
          lib: "antd",
          icon: "plus-circle",
          theme: "outlined",
        },
        suffixIconDisabled: true,
        suffixIconTooltip: "禁止点击",
      },
      {
        title: "菜单项3",
        key: "key2",
        type: "item",
        suffixIconDisabled: true,
        suffixIconTooltip: "禁止点击",
      },
    ];
    const menuItemClick = jest.fn();
    const suffixIconClick = jest.fn();
    element.addEventListener("menu.item.click", menuItemClick);
    element.addEventListener("suffix.icon.click", suffixIconClick);
    element.defaultSelectedKeys = ["child1"];
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(
      element.shadowRoot?.querySelector(".directory-title")?.textContent
    ).toBe("目录标题");
    const menuItems = element.shadowRoot?.querySelectorAll(
      ".menu-item.menu-item-group"
    );
    expect(menuItems?.length).toBe(2);
    expect(
      element.shadowRoot?.querySelectorAll("eo-icon[icon='plus-circle']").length
    ).toBe(2);
    fireEvent.click(
      element.shadowRoot?.querySelector(
        ".menu-item-title-suffix-icon"
      ) as HTMLElement
    );
    expect(suffixIconClick).toBeCalledTimes(1);
    fireEvent.click(
      element.shadowRoot?.querySelector(".menu-item-title-item") as HTMLElement
    );
    expect(menuItemClick).toBeCalledTimes(1);

    fireEvent.click(
      element.shadowRoot?.querySelector(
        ".menu-item-item .menu-item-title-item"
      ) as HTMLElement
    );
    expect(menuItemClick).toBeCalledTimes(2);
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
  test("basic usage", async () => {
    const element = document.createElement("eo-directory") as EoDirectory;
    element.hideRightBorder = true;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot?.querySelector(".directory-container-not-border")
    ).toBeDefined();
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
