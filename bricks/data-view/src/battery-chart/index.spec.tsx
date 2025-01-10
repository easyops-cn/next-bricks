import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./index.jsx";
import {BatteryChartComponent ,BatteryChart} from "./index.jsx";
import { render } from "@testing-library/react";
import React from "react";

describe("data-view.battery-chart",()=>{
    test("basic usage", async ()=>{
        const element =  document.createElement("data-view.battery-chart") as BatteryChart;
        expect(element.shadowRoot).toBeFalsy();
        act(()=>{
            element.value = 30;
            document.body.appendChild(element);
        });
        expect(element.shadowRoot).toBeTruthy();
        expect(element.shadowRoot?.childNodes.length).toBe(2);
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })
    test("BatteryChartComponent", async ()=>{
        const  {container, asFragment, rerender} = render(<BatteryChartComponent value={60} batteryWidth={50} batteryHeight={80} thresholdValue={70} />)
        expect(asFragment()).toBeTruthy();
        expect(container.querySelector(".header").getAttribute("style")).toBe("width: 17px; background: rgb(255, 119, 42); box-shadow: 0 1px 2px 0 #FF772A;");
        expect(container.querySelector(".content").getAttribute("style")).toBe("width: 50px; height: 80px;");
        expect(container.querySelector(".word").getAttribute("style")).toBe("top: 12px;")
        expect(container.querySelector(".valueWrapper").getAttribute("style")).toBe("height: 48px;");
        expect(container.querySelector(".value").getAttribute("style")).toBe("box-shadow: 0 8px 10px 0 linear-gradient(180deg, #FF772A 0%, #FFC22A 100%); border-radius: 0 0 4px 4px;");
        rerender(<BatteryChartComponent value={100} batteryHeight={80}  thresholdColors={[{
                color: "red",
                startValue: 0,
                endValue: 50
            },{
                color: "blue",
                startValue: 50,
                endValue: 100
            }]
                } />);
        expect(container.querySelector(".valueWrapper").getAttribute("style")).toBe("height: 80px;");
        expect(container.querySelector(".header").getAttribute("style")).toBe("width: 13px; box-shadow: 0 1px 2px 0 blue; background: blue;")

    })
})
