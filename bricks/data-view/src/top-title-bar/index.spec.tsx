import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./";
import { TopTitleBar } from "./index.js";

describe("data-view.top-title-bar", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.top-title-bar"
    ) as TopTitleBar;

    element.text = "page-title";
    element.type = "normal";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot.querySelector(".title-text").textContent).toBe(
      "page-title"
    );

    expect(element.shadowRoot.querySelector(".normalWrapper")).toBeTruthy();
    expect(element.shadowRoot.querySelector(".sampleWrapper")).toBeFalsy();
    expect(element.shadowRoot.querySelector(".squareWrapper")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
