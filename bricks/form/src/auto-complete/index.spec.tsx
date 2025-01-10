import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent } from "@testing-library/react";
import "./";
import { AutoComplete } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-auto-complete", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-auto-complete") as AutoComplete;
    element.options = [
      { label: "option1", value: "option1" },
      { label: "option2", value: "option2", caption: "caption2" },
      {
        label: "option3",
        value: "option3",
        options: [
          { label: "option3-1", value: "option3-1", caption: "caption3-1" },
        ],
      },
    ];
    element.filterByCaption = true;
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const input = element.shadowRoot?.querySelector("eo-input") as HTMLElement;
    act(() => {
      fireEvent.focus(input);
    });
    expect(element.shadowRoot?.querySelectorAll(".group-wrapper").length).toBe(
      1
    );

    act(() => {
      fireEvent(input, new CustomEvent("change", { detail: "caption" }));
    });
    expect(
      element.shadowRoot?.querySelectorAll(".option-container").length
    ).toBe(2);
    expect(element.value).toBe("caption");

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".option-container") as HTMLElement
      );
    });
    expect(element.value).toBe("option2");

    act(() => {
      fireEvent.focus(input);
    });
    expect(element.shadowRoot?.querySelector(".dropdown-wrapper")).toBeTruthy();

    act(() => {
      fireEvent.click(document);
    });
    expect(element.shadowRoot?.querySelector(".dropdown-wrapper")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
