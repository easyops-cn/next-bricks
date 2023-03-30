import React from "react";
import { describe, test, expect } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { ModernStyleTreemap } from "./index.jsx";

jest.mock("@next-core/react-runtime", () => ({
  ReactUseMultipleBricks: ({ data }: any) => {
    return <div>{data.data?.name}</div>
  }
}));

jest.useFakeTimers();

describe("data-view.modern-style-treemap", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.modern-style-treemap"
    ) as ModernStyleTreemap;

    element.data = {
      "name": "root",
      "children": [
        {
          "name": "a",
          "value": 100
        },
        {
          "name": "b",
          "value": 20
        },
        {
          "name": "c",
          "value": 30
        },
        {
          "name": "d",
          "value": 80,
        },
        {
          "name": "e",
          "value": 50
        },
        {
          "name": "f",
          "value": 60
        }
      ]
    }
    element.leafContainerStyle = {
      color: "red"
    };
    element.tooltipStyle = {
      color: "green"
    };
    element.leafUseBrick = { useBrick: { brick: "div", properties: { textContent: "<% DATA.data.name %>" } } };
    element.tooltipUseBrick = { useBrick: { brick: "div", properties: { textContent: "<% DATA.data.name %>" } } };

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(element.shadowRoot.querySelectorAll(".treemap-leaf").length).toBe(6);
    expect(element.shadowRoot.querySelectorAll(".treemap-leaf")[0].innerHTML).toBe("<div>a</div>");
    expect(
      (element.shadowRoot.querySelector(".treemap-leaf") as HTMLDivElement).style
        .color
    ).toBe("red");
    expect(
      (element.shadowRoot.querySelector(".tooltip") as HTMLDivElement).style
        .color
    ).toBe("green");
    expect(
      (element.shadowRoot.querySelector(".tooltip") as HTMLDivElement).style
        .visibility
    ).toBe("");

    fireEvent.mouseEnter(element.shadowRoot.querySelector(".treemap"));
    expect(
      (element.shadowRoot.querySelector(".tooltip") as HTMLDivElement).style
        .visibility
    ).toBe("visible");

    act(()=>{
      fireEvent.mouseMove(element.shadowRoot.querySelector("[data-leaf-id='c']"));
      jest.runAllTimers();
    })
    expect(element.shadowRoot.querySelector(".tooltip").innerHTML).toBe("<div>c</div>");
    act(()=>{
      fireEvent.mouseMove(element.shadowRoot.querySelector(".treemap"));
      jest.runAllTimers();
    })
    expect(element.shadowRoot.querySelector(".tooltip").innerHTML).toBe("<div>c</div>");

    fireEvent.mouseLeave(element.shadowRoot.querySelector(".treemap"));
    expect(
      (element.shadowRoot.querySelector(".tooltip") as HTMLDivElement).style
        .visibility
    ).toBe("hidden");

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
