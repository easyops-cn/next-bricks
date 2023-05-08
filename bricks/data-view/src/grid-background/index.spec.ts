import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { GridBackground } from "./index.js";
describe("data-view.grid-background", () => {
  test("basic usage", () => {
    const element = document.createElement(
      "data-view.grid-background"
    ) as GridBackground;
    element.color = "#235F90";
    element.particleColor = { startColor: "#477AFFFF", endColor: "#5F83FF00" };
    element.maskStyle = {
      background: " red",
    };
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(
      element.shadowRoot.querySelector("svg").getAttribute("viewBox")
    ).toBe("0 0 1920 1080");
    expect(
      element.shadowRoot.querySelector(".mask").getAttribute("style")
    ).toBe("background: red;");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
