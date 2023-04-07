import { describe, test, expect, jest } from "@jest/globals";
import React from "react";
import { act } from "react-dom/test-utils";
import "./index.js";
import { render ,fireEvent} from "@testing-library/react";
import  {SystemCard,SystemCardComponent} from "./index.js";
describe("data-view.app-wall-system-card", () => {
    test("basic usage" , async ()=>{
        const element = document.createElement("data-view.app-wall-system-card") as SystemCard;
        const mockClickFn = jest.fn();
        expect(element.shadowRoot).toBeFalsy();
        const  itemList = [{
            key: "name",
            value: "test"
        }]

       act (()=>{
            element.cardTitle = "优维科技";
            element.itemList = itemList;
            element.buttonName= "测试";
            document.body.appendChild(element);
        });
        expect(element.shadowRoot).toBeTruthy();
        const btnNode = element.shadowRoot.querySelector(".buttonContent");
        expect(element.shadowRoot.querySelector(".buttonContent").childNodes.length).toBe(2);
        fireEvent.click(btnNode);
        expect(element.shadowRoot.querySelector(".cardName").innerHTML).toBe("优维科技");
        const {container,rerender} = await act(async ()=>
            render(<SystemCardComponent
                status="normal"
                cardTitle="卡片标题"
                itemList={itemList}
                handleClick={mockClickFn}
                buttonName="应用墙大屏" />));
        expect(container.querySelector(".wrapper").classList).toContain("infoWrapper");
        const btn = container.querySelector(".buttonContent");
        await act(async ()=>{
            fireEvent.click(btn);
        })
        expect(mockClickFn).toHaveBeenCalled();
        rerender(<SystemCardComponent status="warning" cardTitle="卡片标题" itemList={itemList} containerStyle={{
            width: "500px",
            height: "600px"
        }} />);
        expect(container.querySelector(".buttonContent")).toBeNull();
        expect(container.querySelector(".wrapper").classList).toContain("warningWrapper");
        expect(container.querySelector(".wrapper").getAttribute("style")).toBe("width: 500px; height: 600px;");
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })
})
