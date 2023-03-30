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

    element.options = [{ label: "a", value: "a" }, { label: "b", value: "b" }, { label: "c", value: "c" }];
    element.addEventListener("value.change", onChange);


    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(element.shadowRoot.querySelectorAll(".select-item").length).toBe(3);
    act(() => {
      fireEvent.click(element.shadowRoot.querySelectorAll(".select-item")[1]);
    })
    expect(onChange).lastCalledWith(expect.objectContaining({
      type: "value.change",
      detail: "b",
    }))

    act(() => {
      fireEvent.change(element.shadowRoot.querySelector(".select-selector-search-input"), { target: { value: "c" } });
    });
    expect(element.shadowRoot.querySelectorAll(".select-item").length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
