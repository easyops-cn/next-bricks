import { describe, test, expect } from "@jest/globals";
import React from "react";
import "./index.jsx";
import {ComplexSearch, ComplexSearchComponent ,OptionItem} from "./index.js";
import { act } from "react-dom/test-utils";
import { render,fireEvent } from "@testing-library/react";
const options:OptionItem[] = [
    {
        name: "mmp_1",
        icon: {
            "lib": "antd",
            "icon": "account-book",
            "theme": "outlined"}
        ,
        data: {
            instanceId: "123425555"
        }
    },
    {
        name: "mmp_2",
        icon: {
            "lib": "antd",
            "icon": "account-book",
            "theme": "outlined"}
        ,
        data: {
            instanceId: "123425555"
        }
    }
];
describe("data-view.complex-search", ()=>{
    test("basic usage", async ()=>{
        const element = document.createElement(
            "data-view.complex-search"
        ) as ComplexSearch;
        expect(element.shadowRoot).toBeFalsy();
        act(() => {
            element.options = options ;
            element.placeholder = "请输入ip";
            document.body.appendChild(element);
        });

        expect(element.shadowRoot).toBeTruthy();
        expect(element.shadowRoot.childNodes.length).toBe(2);
        const inputElement = element.shadowRoot.querySelector("input");
        fireEvent.focus(inputElement);
        fireEvent.change(inputElement, { target: { value: "hello" } });
        fireEvent.focus(inputElement);
        fireEvent.blur(inputElement);
        const menuItem = element.shadowRoot.querySelector(".dropdownMenuItem");
        fireEvent.click(menuItem);
        fireEvent.keyDown(inputElement,{key: "Enter"});
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })
    test("ComplexSearchComponent", async ()=>{
        const mockSearchFn = jest.fn();
        const mockSelectFn = jest.fn();
        const mockFocusFn= jest.fn();
        const mockChangeFn = jest.fn();
        const mockBlurFn = jest.fn();
        const {container, asFragment, rerender} = render(<ComplexSearchComponent
            onSearch={mockSearchFn}
            onFocus={mockFocusFn}
            onBlur={mockBlurFn}
            onInputChange={mockChangeFn}
            onSelect={mockSelectFn}
            placeholder="请输入ip"
            value="astrid"
            options={options}
            tooltipUseBrick={{
                useBrick: [{brick: "div", properties:{textContent: "test"}}]
            }}
        />)
        expect(asFragment()).toBeTruthy();
        const inputElement = container.querySelector("input");
        expect(inputElement.getAttribute("placeholder")).toBe("请输入ip");
        fireEvent.focus(inputElement);
        expect(mockFocusFn).toHaveBeenCalled();
        fireEvent.change(inputElement, { target: { value: "hello" } });
        expect(mockChangeFn).toHaveBeenCalledTimes(1);
        const menuItem = container.querySelector(".dropdownMenuItem");
        fireEvent.mouseEnter(menuItem);
        const tooltipNode = container.querySelector(".dropdownMenuItemTooltip");
        expect(tooltipNode.getAttribute("style")).toBe("top: 0px; visibility: visible;");
        fireEvent.mouseEnter(tooltipNode);
        fireEvent.mouseLeave(tooltipNode);
        expect(tooltipNode.getAttribute("style")).toBe("top: 0px; visibility: hidden;");
        fireEvent.click(menuItem);
        expect(mockSelectFn).toHaveBeenCalled();
        fireEvent.mouseLeave(menuItem);
        fireEvent.blur(inputElement);
        expect(mockBlurFn).toHaveBeenCalled();
        fireEvent.keyDown(inputElement,{key: "Enter"});
        expect(mockSearchFn).toHaveBeenCalled()
        const closeBtn = container.querySelector(".clearIcon");
        fireEvent.click(closeBtn);
        expect(mockChangeFn).toHaveBeenCalledTimes(2);
        const body = document.body;
        fireEvent.click(body);
        rerender(<ComplexSearchComponent
           />)
        expect(container.querySelector(".emptyData").childNodes.length).toBe(2);

    })

})

