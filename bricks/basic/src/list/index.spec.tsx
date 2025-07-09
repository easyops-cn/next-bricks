import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { List } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

customElements.define(
  "eo-icon",
  class extends HTMLElement {
    lib?: string;
    prefix!: string | null;
    icon?: string;
  }
);

describe("eo-list", () => {
  test("render with data source", async () => {
    const element = document.createElement("eo-list") as List;
    element.dataSource = [
      { title: "Item 1", url: "/item1" },
      { title: "Item 2", url: "/item2" },
    ];

    act(() => {
      document.body.appendChild(element);
    });

    const items = element.shadowRoot?.querySelectorAll("li.item");
    expect(items?.length).toBe(2);
    expect(items?.[0].textContent).toContain("Item 1");
    expect(items?.[1].textContent).toContain("Item 2");

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("render with variant", async () => {
    const element = document.createElement("eo-list") as List;
    element.variant = "navigation";
    element.dataSource = [{ title: "Nav Item" }];

    act(() => {
      document.body.appendChild(element);
    });

    const container = element.shadowRoot?.querySelector(".container");
    expect(container?.classList.contains("navigation")).toBeTruthy();

    const icon = element.shadowRoot?.querySelector(".icon");
    expect(icon).not.toBeNull();

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("render with custom fields", async () => {
    const element = document.createElement("eo-list") as List;
    element.dataSource = [{ customTitle: "Custom Item", customUrl: "/custom" }];
    element.fields = {
      title: "customTitle",
      url: "customUrl",
    };

    act(() => {
      document.body.appendChild(element);
    });

    const item = element.shadowRoot?.querySelector("li.item");
    expect(item?.textContent).toContain("Custom Item");

    const link = element.shadowRoot?.querySelector(".link");
    expect(link?.getAttribute("url")).toBe("/custom");

    act(() => {
      document.body.removeChild(element);
    });
  });
});
