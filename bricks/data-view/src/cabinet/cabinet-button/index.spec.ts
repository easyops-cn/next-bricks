import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./index.jsx";
import { CabinetButton } from "./index.jsx";
describe("data-view.cabinet-button",()=>{
    test("basic usage",()=>{

        const element = document.createElement(
            "data-view.cabinet-button"
        ) as CabinetButton;
        element.buttonStyle ={
            width: "50px",
            height: "50px"
        }
        expect(element.shadowRoot).toBeFalsy();
        act(() => {
            document.body.appendChild(element);
        });
        expect(element.shadowRoot).toBeTruthy();
        expect(element.shadowRoot.querySelector(".closeBtn").getAttribute("style")).toBe(
            "width: 50px; height: 50px;"
        );
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();

    })
})
