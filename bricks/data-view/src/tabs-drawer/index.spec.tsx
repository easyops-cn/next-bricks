import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import {TabItem, TabsDrawer, TabsDrawerComponent} from "./index.jsx";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
const tabList:TabItem[]= [
    {
        key: "search",
        tooltip: "搜索",
        icon: {
            lib: "antd",
            icon: "file-search",
            theme: "outlined",
        }
    },
    {
        key: "app",
        tooltip: "应用",
        icon: {
            lib: "easyops",
            category: "app",
            icon: "micro-app-configuration",
        }
    }
];
describe("data-view.tabs-drawer", ()=>{
    test("basic usage", async ()=>{
        const element =  document.createElement("data-view.tabs-drawer") as TabsDrawer;
        expect(element.shadowRoot).toBeFalsy();
        element.tabList = tabList;
        element.activeKey = "app";
        act(()=>{
            document.body.appendChild(element);
        });
        element.open();
        expect(element.visible).toBe(true);
        element.close();
        expect(element.visible).toBe(false);
        expect(document.body.contains(element)).toBeTruthy();
        expect(element.shadowRoot).toBeTruthy();
        expect(element.shadowRoot?.childNodes.length).toBe(2);
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })
    test("change tab", async ()=>{
        const openMockFn = jest.fn();
        const closeMockFn = jest.fn();
        const {container,asFragment} = render(
            <TabsDrawerComponent
                tabList={tabList}
                activeKey="search"
                onOpen={openMockFn}
                onClose={closeMockFn}
                width={500}
                zIndex={999}
            />
        );
        expect(asFragment()).toBeTruthy();
        const closeBtn = container.querySelector(".closeIconBtn");
        fireEvent.click(closeBtn);
        expect(openMockFn).toBeCalledTimes(1);
       const menuItems  = container.querySelector(".menuIconItem");
       expect(menuItems.childNodes.length).toBe(2);
       const activeElement = menuItems.firstElementChild;
       const noActiveElement = menuItems.lastElementChild;
       fireEvent.click(noActiveElement);
       expect(activeElement.classList.contains("active")).toBeFalsy();

    })
})
