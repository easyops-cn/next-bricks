import { describe, test, expect } from "@jest/globals";
import React from "react";
import "./index.jsx";
import {ParticleAnimationComponent, ParticleAnimation,ColorType} from "./index.js";
import { act } from "react";
import {render} from "@testing-library/react";

describe("data-view.particle-animation",()=>{
    test("basic usage", async ()=>{
        const colors:ColorType = {
            startColor: "#44E6F300",
            middleColor: "#48D9EE",
            endColor: "#E4FFFF"
        };
        const element = document.createElement(
            "data-view.particle-animation"
        ) as ParticleAnimation;
        expect(element.shadowRoot).toBeFalsy();
        act(() => {
            element.textContent = "Hello";
            element.colors =  colors;
            document.body.appendChild(element);
        });
        expect(element.shadowRoot).toBeTruthy();
        expect(element.shadowRoot.childNodes.length).toBe(2);
        const {container} = render(<ParticleAnimationComponent
            colors={colors}
            containerStyle={{width: "250px",height: "250px"}} />)
        expect(container.querySelector(".animation-wrapper").getAttribute("style")).toBe("width: 250px; height: 250px;");
        expect(container.querySelector(".circle-container").getAttribute("style")).toBe("color: rgb(72, 217, 238);")
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })
})
