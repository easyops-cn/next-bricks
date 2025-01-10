import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./";
import { TabsPageTitle } from "./index.js";
import { fireEvent } from "@testing-library/react";
describe("data-view.tabs-page-title", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.tabs-page-title"
    ) as TabsPageTitle;
    expect(element.shadowRoot).toBeFalsy();
    const titleEle = document.createElement("div");
    titleEle.textContent = "大标题";
    element.tabList = [
      {
        key: "key1",
        text: "标签1",
      },
      {
        key: "key2",
        text: "标签2",
      },
    ];
    act(() => {
      element.appendChild(titleEle);
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot.querySelectorAll(".tabWrapper").length).toBe(1);
    expect(element.shadowRoot.querySelector(".titleWrapper")).toBeFalsy();
    expect(element.shadowRoot.querySelectorAll(".tabSlot").length).toBe(2);
    const textElements = element.shadowRoot.querySelectorAll(".text");
    expect(textElements.item(0).classList).toContain("active");
    expect(element.shadowRoot.querySelector(".content")).toBeTruthy();
    fireEvent.click(textElements.item(1));
    expect(element.activeKey).toBe("key2");
    fireEvent.click(textElements.item(0));
    expect(element.activeKey).toBe("key1");
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
  test("tabList is empty", async () => {
    const element = document.createElement(
      "data-view.tabs-page-title"
    ) as TabsPageTitle;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot.querySelectorAll(".titleWrapper").length).toBe(1);
    expect(element.shadowRoot.querySelector(".tabWrapper")).toBeFalsy();
    expect(element.shadowRoot.querySelector(".content")).toBeFalsy();
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
