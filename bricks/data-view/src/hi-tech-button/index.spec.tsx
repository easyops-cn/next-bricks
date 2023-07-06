import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { HiTechButton } from "./index.js";

describe("data-view.hi-tech-button", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.hi-tech-button"
    ) as HiTechButton;
    element.type = "parallelogram";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot.querySelector(".parallelogram")).toBeTruthy();
    expect(element.shadowRoot.querySelector(".normal")).toBeFalsy();
    expect(element.shadowRoot.querySelector(".stereoscopic")).toBeFalsy();
    expect(element.shadowRoot.querySelector(".shading")).toBeFalsy();
    expect(element.shadowRoot.querySelector(".round")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
