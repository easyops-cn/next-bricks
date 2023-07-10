import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { LightsComponentTitle } from "./index.js";
describe("data-view.lights-component-title", () => {
  test("light theme", async () => {
    const element = document.createElement(
      "data-view.lights-component-title"
    ) as LightsComponentTitle;
    expect(element.shadowRoot).toBeFalsy();
    element.componentTitle = "组件标题";
    
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot.querySelector(".lightTitle").textContent).toBe(
      "组件标题"
    );
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
  test("dark theme", async () => {
    const element = document.createElement(
      "data-view.lights-component-title"
    ) as LightsComponentTitle;
    expect(element.shadowRoot).toBeFalsy();
    element.componentTitle = "组件标题2";
    element.theme = "dark";   
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot.querySelector(".darkTitle").textContent).toBe(
      "组件标题2"
    );
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
