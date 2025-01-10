import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./index.jsx";
import { TabItem, TabsDrawer, TabsDrawerComponent } from "./index.jsx";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
const tabList: TabItem[] = [
  {
    key: "search",
    tooltip: "搜索",
    icon: {
      lib: "antd",
      icon: "file-search",
      theme: "outlined",
    },
  },
  {
    key: "app",
    tooltip: "应用",
    icon: {
      lib: "easyops",
      category: "app",
      icon: "micro-app-configuration",
    },
  },
];
describe("data-view.tabs-drawer", () => {
  test("basic usage", () => {
    const element = document.createElement(
      "data-view.tabs-drawer"
    ) as TabsDrawer;
    const divEle = document.createElement("div");
    divEle.textContent = "test";
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.tabList = tabList;
      element.activeKey = "app";
      element.visible = true;
      document.body.appendChild(element);
      document.body.appendChild(divEle);
    });
    act(() => {
      fireEvent.click(divEle);
    });
    element.open();
    expect(element.visible).toBe(true);
    act(() => {
      const tabElement = element.shadowRoot.querySelector(".menuIconItem");
      fireEvent.click(tabElement);
    });
    element.close();
    expect(element.visible).toBe(false);
    expect(document.body.contains(element)).toBeTruthy();
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("change tab", async () => {
    const openMockFn = jest.fn();
    const closeMockFn = jest.fn();
    const changeMockFn = jest.fn();
    const { container, asFragment, rerender } = render(
      <TabsDrawerComponent
        tabList={tabList}
        activeKey="search"
        onOpen={openMockFn}
        onClose={closeMockFn}
        width={500}
        zIndex={999}
        onTabChange={changeMockFn}
      />
    );
    expect(asFragment()).toBeTruthy();
    const closeBtn = container.querySelector(".closeIconBtn");
    fireEvent.click(closeBtn);
    expect(openMockFn).toBeCalledTimes(1);
    expect(changeMockFn).toBeCalledTimes(0);
    expect(
      container.querySelector(".drawerWrapper").classList.contains("open")
    );
    const menuItems = container.querySelector(".menuIconItem");
    expect(menuItems.childNodes.length).toBe(2);
    const activeElement = menuItems.firstElementChild;
    const noActiveElement = menuItems.lastElementChild;
    fireEvent.click(noActiveElement);
    expect(activeElement.classList.contains("active")).toBeFalsy();
    expect(changeMockFn).toBeCalledTimes(1);
    rerender(<TabsDrawerComponent tabList={tabList} visible={true} />);
    fireEvent.click(closeBtn);
    expect(changeMockFn).toBeCalledTimes(1);
    expect(
      container.querySelector(".drawerWrapper").classList.contains("close")
    );
    expect(asFragment()).toBeTruthy();
  });
});
