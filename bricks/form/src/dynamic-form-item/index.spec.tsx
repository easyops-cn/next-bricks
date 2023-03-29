import React from 'react';
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { DynamicFormItem } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/react-runtime", () => ({
  ReactUseMultipleBricks: () => {
    return <div>mock element</div>
  }
}))

describe("form.dynamic-form-item", () => {
  test("basic usage", async () => {
    const element = document.createElement("form.dynamic-form-item") as DynamicFormItem;
    element.useBrick = [
      {
        brick: "form.general-input",
        properties: {
          name: "input",
          required: true,
        }
      },
      {
        brick: "form.general-select",
        properties: {
          name: "select",
          required: true,
          options: [
            "abc",
            "efg",
            "hij"
          ]
        }
      }
    ];

    element.value = [{
      input: "hello",
      select: "abc"
    }, {
      input: "world",
      select: "efg"
    }];
    const mockValueChangeEvent = jest.fn();
    element.addEventListener("change", mockValueChangeEvent);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelectorAll(".dynamic-form-item").length).toBe(2);
    act(() => {
      (element.shadowRoot?.querySelector(".add-btn") as HTMLElement).click();
    })
    expect(element.shadowRoot?.querySelectorAll(".dynamic-form-item").length).toBe(3);

    await act(async() => {
      (element.shadowRoot?.querySelectorAll(".remove-btn")[1] as HTMLElement).click();
    })
    expect(element.shadowRoot?.querySelectorAll(".dynamic-form-item").length).toBe(2);
    expect(element.value).toEqual([
      {
        input: "hello",
        select: "abc"
      },
      {}
    ])
    expect(mockValueChangeEvent).toBeCalled();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
