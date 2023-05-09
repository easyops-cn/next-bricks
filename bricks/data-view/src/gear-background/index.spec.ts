import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { GearBackground } from "./index.js";
describe("data-view.gear-background", () => {
  test("basic usage", () => {
    const element = document.createElement(
      "data-view.gear-background"
    ) as GearBackground;
    element.color = "#235F90";
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
