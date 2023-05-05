import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { GraphNode } from "./index.jsx";
describe("data-view.graph-node", () => {
  test("basic usage", () => {
    const element = document.createElement("data-view.graph-node") as GraphNode;
    element.url =
      "https://i.pinimg.com/564x/a0/04/6a/a0046a18a86a0f905ced2e78a8b0dff2.jpg";
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(
      element.shadowRoot
        .querySelector(".node")
        .children.item(0)
        .getAttribute("src")
    ).toBe(
      "https://i.pinimg.com/564x/a0/04/6a/a0046a18a86a0f905ced2e78a8b0dff2.jpg"
    );
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
