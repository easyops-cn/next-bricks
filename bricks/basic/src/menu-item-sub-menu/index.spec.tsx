import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { EoMenuItemSubMenu } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-menu-item-sub-menu", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-menu-item-sub-menu"
    ) as EoMenuItemSubMenu;

    const span = document.createElement("span");
    span.textContent = "菜单项一";

    element.appendChild(span);
    element.icon = {
      lib: "antd",
      theme: "outlined",
      icon: "close",
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector("eo-icon")).toBeTruthy();

    expect(element.shadowRoot?.querySelector(".collapsed")).toBeTruthy();

    act(() => {
      (
        element.shadowRoot?.querySelector(".sub-menu-item-title") as HTMLElement
      ).click();
    });

    expect(element.innerHTML).toEqual("<span>菜单项一</span>");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
