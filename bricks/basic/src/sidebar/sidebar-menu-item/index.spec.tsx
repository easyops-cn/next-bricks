import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./index.jsx";
import { EoSidebarMenuItem } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-sidebar-menu-item", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-sidebar-menu-item"
    ) as EoSidebarMenuItem;
    element.textContent = "menu item";
    element.icon = {
      lib: "easyops",
      category: "default",
      icon: "test",
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".menu-item-icon")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".menu-item-text")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
