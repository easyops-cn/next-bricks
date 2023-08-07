import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import "../breadcrumb-item/index.js";
import { EoBreadcrumb } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-breadcrumb", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-breadcrumb") as EoBreadcrumb;
    const item1 = document.createElement("eo-breadcrumb-item");
    const item2 = document.createElement("eo-breadcrumb-item");
    const item3 = document.createElement("eo-breadcrumb-item");
    const groupSeparator = document.createElement("span");
    const itemSeparator = document.createElement("span");
    groupSeparator.slot = "separator";
    itemSeparator.slot = "separator";

    item1.appendChild(itemSeparator);
    element.appendChild(item1);
    element.appendChild(item2);
    element.appendChild(item3);
    element.appendChild(groupSeparator);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      item1.shadowRoot?.querySelector("slot[name='group-separator']")
    ).toBeFalsy();
    expect(
      item2.shadowRoot?.querySelector("slot[name='group-separator']")
    ).toBeTruthy();
    expect(
      item3.shadowRoot?.querySelector("slot[name='group-separator']")
    ).toBeTruthy();

    expect(item1.querySelector("[slot='group-separator']")).toBeTruthy();
    expect(item2.querySelector("[slot='group-separator']")).toBeTruthy();
    expect(item3.querySelector("[slot='group-separator']")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
