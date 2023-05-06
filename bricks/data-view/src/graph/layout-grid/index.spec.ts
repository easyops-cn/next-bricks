import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { GraphLayoutGrid } from "./index.js";

describe("data-view.graph-layout-grid", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.graph-layout-grid"
    ) as GraphLayoutGrid;
    expect(element.shadowRoot).toBeFalsy();
    await act(() => {
      element.rows = 3;
      element.columns = 7;
      element.isReverse = false;
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot.querySelectorAll(".item").length).toBe(10);
    expect(
      element.shadowRoot.querySelector(".item").getAttribute("style")
    ).toBe("grid-area: 1 / 2 /1 / 2;");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("isReverse is true", async () => {
    const element = document.createElement(
      "data-view.graph-layout-grid"
    ) as GraphLayoutGrid;
    expect(element.shadowRoot).toBeFalsy();
    await act(() => {
      element.rows = 3;
      element.columns = 7;
      element.isReverse = true;
      element.dataSource = [
        {
          text: "应用",
          value: "200",
          url: "https://i.pinimg.com/564x/a0/04/6a/a0046a18a86a0f905ced2e78a8b0dff2.jpg",
        },
      ];
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(
      element.shadowRoot.querySelector(".item").getAttribute("style")
    ).toBe("grid-area: 1 / 1 /1 / 1;");
    expect(
      element.shadowRoot.querySelector(".container").getAttribute("style")
    ).toBe("grid-template-columns: repeat(7, 1fr);");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
