import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { EoSidebarMenu } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-sidebar-menu", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-sidebar-menu") as EoSidebarMenu;
    element.menuCollapsed = true;
    const itemElement = document.createElement("eo-sidebar-menu-item");
    const groupElement = document.createElement("eo-sidebar-menu-group");
    const submenuElement = document.createElement("eo-sidebar-menu-submenu");

    element.appendChild(itemElement);
    element.appendChild(groupElement);
    element.appendChild(submenuElement);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect((itemElement as any).menuCollapsed).toBeTruthy();
    expect((groupElement as any).menuCollapsed).toBeTruthy();
    expect((submenuElement as any).menuCollapsed).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
