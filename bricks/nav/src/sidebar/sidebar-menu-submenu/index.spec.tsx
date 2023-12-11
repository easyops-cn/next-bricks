import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { EoSidebarMenuSubmenu } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-sidebar-menu-submenu", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-sidebar-menu-submenu"
    ) as EoSidebarMenuSubmenu;
    element.menuCollapsed = true;
    const itemElement = document.createElement("eo-sidebar-menu-item");
    const titleElement = document.createElement("span");
    titleElement.textContent = "sub menu";
    titleElement.slot = "title";

    element.appendChild(titleElement);
    element.appendChild(itemElement);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelector(".menu-submenu-title-icon")
    ).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".menu-submenu-title-text")
    ).toBeTruthy();
    expect((itemElement as any).menuCollapsed).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("collapsed should work", async () => {
    const element = document.createElement(
      "eo-sidebar-menu-submenu"
    ) as EoSidebarMenuSubmenu;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelector(".menu-submenu-collapsed")
    ).toBeFalsy();

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".menu-submenu-title") as HTMLElement
      );
    });
    expect(
      element.shadowRoot?.querySelector(".menu-submenu-collapsed")
    ).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
