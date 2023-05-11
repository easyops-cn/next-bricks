import React from "react";
import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { ModernStyleTreemap } from "./index.jsx";

jest.mock("@next-core/react-runtime", () => ({
  ReactUseMultipleBricks: ({ data }: any) => {
    return <div>{data.data?.name}</div>;
  },
}));

jest.useFakeTimers();

describe("data-view.modern-style-treemap", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.modern-style-treemap"
    ) as ModernStyleTreemap;

    element.data = {
      name: "root",
      children: [
        {
          name: "a",
          value: 100,
        },
        {
          name: "b",
          value: 20,
        },
        {
          name: "c",
          value: 30,
        },
        {
          name: "d",
          value: 80,
        },
        {
          name: "e",
          value: 50,
        },
        {
          name: "f",
          value: 60,
        },
      ],
    };
    element.leafContainerStyle = {
      color: "red",
    };
    element.tooltipStyle = {
      color: "green",
    };
    element.leafUseBrick = {
      useBrick: {
        brick: "div",
        properties: { textContent: "<% DATA.data.name %>" },
      },
    };
    element.tooltipUseBrick = {
      useBrick: {
        brick: "div",
        properties: { textContent: "<% DATA.data.name %>" },
      },
    };

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    const treemapElement = element.shadowRoot.querySelector(".treemap");
    treemapElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 400,
        height: 500,
        top: 0,
        left: 0,
        bottom: 500,
        right: 400,
      } as DOMRect;
    });
    const tooltipElement = element.shadowRoot.querySelector(
      ".tooltip"
    ) as HTMLDivElement;
    tooltipElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      } as DOMRect;
    });

    expect(element.shadowRoot.querySelectorAll(".treemap-leaf").length).toBe(6);
    expect(
      element.shadowRoot.querySelectorAll(".treemap-leaf")[0].innerHTML
    ).toBe("<div>a</div>");
    expect(
      (element.shadowRoot.querySelector(".treemap-leaf") as HTMLDivElement)
        .style.color
    ).toBe("red");
    expect(tooltipElement.style.color).toBe("green");
    expect(tooltipElement.style.visibility).toBe("");

    fireEvent.mouseEnter(element.shadowRoot.querySelector(".treemap"));
    expect(tooltipElement.style.visibility).toBe("visible");

    act(() => {
      // placement： left top
      fireEvent.mouseMove(
        element.shadowRoot.querySelector("[data-leaf-id='c']"),
        { clientX: 12, clientY: 12 }
      );
      jest.runAllTimers();
    });

    expect(tooltipElement.innerHTML).toBe("<div>c</div>");
    expect(tooltipElement.classList).toContain("topLeft");
    act(() => {
      // placement： right
      fireEvent.mouseMove(
        element.shadowRoot.querySelector("[data-leaf-id='c']"),
        { clientX: 350, clientY: 450 }
      );
      jest.runAllTimers();
    });
    expect(tooltipElement.classList).toContain("right");
    act(() => {
      // placement： right  bottom
      fireEvent.mouseMove(
        element.shadowRoot.querySelector("[data-leaf-id='c']"),
        { clientX: 380, clientY: 460 }
      );
      jest.runAllTimers();
    });
    expect(tooltipElement.classList).toContain("bottomRight");
    act(() => {
      // placement： bottom
      fireEvent.mouseMove(
        element.shadowRoot.querySelector("[data-leaf-id='c']"),
        { clientX: 200, clientY: 460 }
      );
      jest.runAllTimers();
    });
    expect(tooltipElement.classList).toContain("bottom");

    act(() => {
      fireEvent.mouseMove(element.shadowRoot.querySelector(".treemap"));
      jest.runAllTimers();
    });
    expect(tooltipElement.innerHTML).toBe("<div>c</div>");

    fireEvent.mouseLeave(element.shadowRoot.querySelector(".treemap"));
    expect(tooltipElement.style.visibility).toBe("hidden");

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
