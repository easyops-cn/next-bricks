import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { GraphText } from "./index.jsx";
describe("data-view.graph-text", () => {
  test("basic usage", () => {
    const element = document.createElement("data-view.graph-text") as GraphText;
    element.text = "负载均衡数";
    element.value = 234;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot.querySelector(".text").textContent).toBe(
      "负载均衡数"
    );
    expect(element.shadowRoot.querySelector(".symbol").textContent).toBe(
      "SYMBOL"
    );
    expect(element.shadowRoot.querySelector(".value").textContent).toBe("234");

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
