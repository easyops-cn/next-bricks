import React from "react";
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { DynamicFormItem, uniqueValidatorFN } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/react-runtime", () => ({
  ReactUseMultipleBricks: (props: any) => {
    return props.useBrick.map((brick: any, index: number) => (
      <div key={index}>
        mock element validator {brick.properties?.validator?.length}
      </div>
    ));
  },
}));

describe("form.dynamic-form-item", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "form.dynamic-form-item"
    ) as DynamicFormItem;
    element.useBrick = [
      {
        brick: "form.general-input",
        properties: {
          name: "input",
          required: true,
        },
      },
      {
        brick: "form.general-select",
        properties: {
          name: "select",
          required: true,
          options: ["abc", "efg", "hij"],
        },
      },
    ];

    element.value = [
      {
        input: "hello",
        select: "abc",
      },
      {
        input: "world",
        select: "efg",
      },
    ];
    const mockValueChangeEvent = jest.fn();
    const mockRowAddEvent = jest.fn();
    const mockRowRemoveEvent = jest.fn();
    element.addEventListener("change", mockValueChangeEvent);
    element.addEventListener("row.add", mockRowAddEvent);
    element.addEventListener("row.remove", mockRowRemoveEvent);
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(
      element.shadowRoot?.querySelectorAll(".dynamic-form-item").length
    ).toBe(2);
    act(() => {
      (element.shadowRoot?.querySelector(".add-btn") as HTMLElement).click();
    });
    expect(mockRowAddEvent).toBeCalledTimes(1);
    expect(
      element.shadowRoot?.querySelectorAll(".dynamic-form-item").length
    ).toBe(3);

    await act(async () => {
      (
        element.shadowRoot?.querySelectorAll(".remove-btn")[1] as HTMLElement
      ).click();
    });

    expect(mockRowAddEvent).toBeCalledTimes(1);
    expect(
      element.shadowRoot?.querySelectorAll(".dynamic-form-item").length
    ).toBe(2);
    expect(element.value).toEqual([
      {
        input: "hello",
        select: "abc",
      },
      {},
    ]);
    expect(mockValueChangeEvent).toBeCalledTimes(1);

    expect(
      element.shadowRoot?.querySelectorAll(".dynamic-form-item").length
    ).toBe(2);

    await act(async () => {
      await (element.value = [
        {
          input: "hello",
          select: "abc",
        },
        {
          input: "world",
          select: "efg",
        },
      ]);
    });

    expect(
      element.shadowRoot?.querySelectorAll(".dynamic-form-item").length
    ).toBe(2);

    await act(async () => {
      await (element.value = [
        {
          input: "change",
          select: "abc",
        },
      ]);
    });

    expect(
      element.shadowRoot?.querySelectorAll(".dynamic-form-item").length
    ).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("unique width validator", async () => {
    const element = document.createElement(
      "form.dynamic-form-item"
    ) as DynamicFormItem;
    element.useBrick = [
      {
        brick: "form.general-input",
        properties: {
          name: "input",
          required: true,
          unique: true,
          validator: jest.fn(),
        },
      },
      {
        brick: "form.general-select",
        properties: {
          name: "select",
          required: true,
          options: ["abc", "efg", "hij"],
          unique: true,
        },
      },
    ];

    element.value = [
      {
        input: "hello",
        select: "abc",
      },
      {
        input: "hello",
        select: "efg",
      },
    ];
    const mockValueChangeEvent = jest.fn();
    element.addEventListener("change", mockValueChangeEvent);
    act(() => {
      document.body.appendChild(element);
    });

    expect(
      element.shadowRoot?.querySelectorAll(".dynamic-form")[0].childNodes[0]
        .textContent
    ).toBe("mock element validator 2");
    expect(
      element.shadowRoot?.querySelectorAll(".dynamic-form")[0].childNodes[1]
        .textContent
    ).toBe("mock element validator 1");

    expect(
      uniqueValidatorFN(
        {
          curElement: {
            value: [
              {
                dimensionId: "one",
              },
              {
                dimensionId: "one",
              },
            ],
          },
        } as any,
        {
          label: "维度id",
          name: "dimensionId",
        },
        () => "dimensionId not repeat"
      )()
    ).toBe("dimensionId not repeat");

    expect(
      uniqueValidatorFN(
        {
          curElement: {
            value: [
              {
                dimensionId: "one",
              },
              {
                dimensionId: "two",
              },
            ],
          },
        } as any,
        {
          label: "维度id",
          name: "dimensionId",
        },
        () => "dimensionId not repeat"
      )()
    ).toBe("");

    expect(
      uniqueValidatorFN(
        {
          curElement: {
            value: [
              {
                dimensionId: "one",
              },
              {
                dimensionId: "one",
              },
            ],
          },
        } as any,
        {
          label: "维度id",
          name: "dimensionId",
          message: {
            unique: "维度id不能重复",
          },
        },
        () => "dimensionId not repeat"
      )()
    ).toBe("维度id不能重复");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("hideRemoveButton、disabledRemoveButton;hideAddButton、disabledAddButton", async () => {
    const element = document.createElement(
      "form.dynamic-form-item"
    ) as DynamicFormItem;
    element.useBrick = [
      {
        brick: "form.general-input",
        properties: {
          name: "input",
          required: true,
          unique: true,
          validator: jest.fn(),
        },
      },
      {
        brick: "form.general-select",
        properties: {
          name: "select",
          required: true,
          options: ["abc", "efg", "hij"],
          unique: true,
        },
      },
    ];

    element.value = [
      {
        input: "hello1",
        select: "abc1",
      },
      {
        input: "hello2",
        select: "efg2",
      },
      {
        input: "hello3",
        select: "efg3",
      },
    ];

    element.hideAddButton = (value) => value.length === 5;
    element.disabledAddButton = (value) => value.length === 4;
    element.hideRemoveButton = (value, row) => row === 1;
    element.disabledRemoveButton = (value, row) => row === 0;
    const mockValueChangeEvent = jest.fn();
    element.addEventListener("change", mockValueChangeEvent);
    act(() => {
      document.body.appendChild(element);
    });

    expect(
      element.shadowRoot?.querySelectorAll(".remove-btn-wrapper").length
    ).toBe(2);
    expect(
      element.shadowRoot?.querySelectorAll(".remove-btn-disabled-wrapper")
        .length
    ).toBe(1);
    act(() => {
      (element.shadowRoot?.querySelector(".add-btn") as HTMLElement).click();
    });
    expect(
      element.shadowRoot?.querySelectorAll(".add-btn.add-btn-disabled").length
    ).toBe(1);
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
