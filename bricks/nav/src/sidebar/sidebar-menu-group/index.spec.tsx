import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { EoSidebarMenuGroup } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-sidebar-menu-group", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-sidebar-menu-group"
    ) as EoSidebarMenuGroup;
    element.menuCollapsed = false;
    const itemElement = document.createElement("eo-sidebar-menu-item");
    const titleElement = document.createElement("span");
    titleElement.textContent = "menu group";
    titleElement.slot = "title";

    element.appendChild(itemElement);
    element.appendChild(titleElement);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelector(".menu-group-title-icon")
    ).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".menu-group-title-text")
    ).toBeTruthy();
    expect((itemElement as any).menuCollapsed).toBeFalsy();

    expect(element.collapsed).toBeFalsy();

    await act(async () => {
      await (
        element.shadowRoot?.querySelector(".menu-group-title") as HTMLElement
      ).click();
    });

    expect(element.collapsed).toBeTruthy();

    expect(element.shadowRoot?.querySelector(".menu-group")?.className).toBe(
      "menu-group menu-group-collapsed"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
