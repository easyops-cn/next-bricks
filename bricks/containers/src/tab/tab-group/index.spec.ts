import { describe, test, expect } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import "../tab-item/index.jsx";
import type { TabGroup } from "./index.jsx";
import type { TabItem } from "../tab-item/index.jsx";

jest.mock("@next-core/theme", () => ({}));

// todo: update unit test
describe("eo-tab-list", () => {
  test("basic usage", async () => {
    const onTabSelect = jest.fn();
    const element = document.createElement("eo-tab-group") as TabGroup;
    const item1 = document.createElement("eo-tab-item") as TabItem;
    const item2 = document.createElement("eo-tab-item") as TabItem;
    item1.slot = "nav";
    item2.slot = "nav";
    item1.panel = "a";
    item2.panel = "b";

    element.appendChild(item1);
    element.appendChild(item2);
    element.addEventListener("tab.select", onTabSelect);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    await act(async () => {
      fireEvent.click(item2);
    });
    expect(onTabSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: "b",
      })
    );
    expect(element.activePanel).toBe("b");

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
