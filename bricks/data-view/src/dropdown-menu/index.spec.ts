import { describe, test, expect } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { DropdownMenu } from "./index.jsx";

describe("data-view.dropdown-menu", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.dropdown-menu"
    ) as DropdownMenu;
    const onChange = jest.fn()

    element.options = [{ label: "label-a", value: "a" }, { label: "label-b", value: "b" }, { label: "label-c", value: "c" }];
    element.addEventListener("value.change", onChange);
    element.placeholder = "please enter something";
    element.allowClear = true;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(window.getComputedStyle(element.shadowRoot.querySelector(".select-dropdown")).display).toBe("none");
    act(() => {
      fireEvent.click(element.shadowRoot.querySelector(".select-selector"));
    });
    expect(window.getComputedStyle(element.shadowRoot.querySelector(".select-dropdown")).display).not.toBe("none");
    expect(element.shadowRoot.querySelectorAll(".select-item").length).toBe(3);

    act(() => {
      fireEvent.click(element.shadowRoot.querySelectorAll(".select-item")[1]);
      fireEvent.click(document);
    });
    expect(window.getComputedStyle(element.shadowRoot.querySelector(".select-dropdown")).display).toBe("none");
    expect(element.shadowRoot.querySelector(".select-selector-item").textContent).toBe("label-b");
    expect(onChange).lastCalledWith(expect.objectContaining({
      type: "value.change",
      detail: "b",
    }));

    act(() => {
      fireEvent.mouseDown(element.shadowRoot.querySelector(".select-clear"));
    });
    expect(element.shadowRoot.querySelector(".select-selector-item")).toBeFalsy();
    expect(onChange).lastCalledWith(expect.objectContaining({
      type: "value.change",
      detail: null,
    }))

    act(() => {
      fireEvent.change(element.shadowRoot.querySelector(".select-selector-search-input"), { target: { value: "c" } });
    });
    expect(element.shadowRoot.querySelectorAll(".select-item").length).toBe(1);
    act(() => {
      fireEvent.change(element.shadowRoot.querySelector(".select-selector-search-input"), { target: { value: "qwe" } });
    });
    expect(element.shadowRoot.querySelector(".empty-image")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
