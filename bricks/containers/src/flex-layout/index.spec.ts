import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { FlexLayout } from "./index.js";

describe("eo-flex-layout", () => {
  test("basic usage", () => {
    const element = document.createElement("eo-flex-layout") as FlexLayout;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.flexDirection = "row";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.style.flexDirection).toBe("row");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
