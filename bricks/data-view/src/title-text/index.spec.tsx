import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { TitleText } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("data-view.title-text", () => {
  test("basic usage", async () => {
    const element = document.createElement("data-view.title-text") as TitleText;
    expect(element.shadowRoot).toBeFalsy();
    element.type = "normal";
    element.text = "大标题";
    element.fontSize = "36px";
    element.fontWeight = "bold";
    element.letterSpacing = "9px";
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot.querySelectorAll(".title").length).toBe(1);
    expect(
      element.shadowRoot.querySelector(".normal-text").getAttribute("style")
    ).toBe(
      "font-size: 36px; letter-spacing: 9px; font-weight: bold; line-height: 36px;"
    );
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
  test("type is stroke", async () => {
    const element = document.createElement("data-view.title-text") as TitleText;
    expect(element.shadowRoot).toBeFalsy();
    element.type = "stroke";
    element.text = "大标题-stroke";
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot.querySelectorAll(".title").length).toBe(3);
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
