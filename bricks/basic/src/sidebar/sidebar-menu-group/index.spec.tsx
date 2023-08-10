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
    element.menuCollapsed = true;
    const itemElement = document.createElement("eo-sidebar-menu-item");
    const titleElement = document.createElement("span");
    titleElement.textContent = "menu group";
    titleElement.slot = "title";

    element.appendChild(itemElement);
    element.appendChild(titleElement);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelector(".menu-group-title-icon")
    ).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".menu-group-title-text")
    ).toBeTruthy();
    expect((itemElement as any).menuCollapsed).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
