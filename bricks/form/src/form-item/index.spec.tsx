import { FormItem } from "./";
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { Form } from "../form/index.js";

jest.mock("./FormItem.shadow.less", () => "");
jest.mock("@next-core/theme", () => ({}));

describe("eo-form-item", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-form-item") as FormItem;

    const mockFormElement = document.createElement("form") as unknown as Form;
    const mockCurElement = document.createElement("input") as any;

    const mockFormStore = {
      onWatch: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      setField: jest.fn(),
      removeField: jest.fn(),
      setFieldsValueByInitData: jest.fn(),
    };
    (mockFormElement as any).formStore = mockFormStore;

    element.formElement = mockFormElement;
    element.curElement = mockCurElement;
    element.name = "test";
    element.trigger = "change";
    element.label = "测试";
    element.required = true;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(mockCurElement.$bindFormItem).toBeTruthy();

    expect(mockFormStore.subscribe).toBeCalledTimes(5);

    expect(mockFormStore.setFieldsValueByInitData).toBeCalledWith("test");

    expect(mockFormStore.setField).toHaveBeenNthCalledWith(1, "test", {
      name: "test",
      label: "测试",
      notRender: false,
      validate: {
        required: true,
      },
    });

    await act(async () => {
      await (element.required = false);
    });

    expect(mockFormStore.setField).toHaveBeenNthCalledWith(2, "test", {
      name: "test",
      label: "测试",
      notRender: false,
      validate: {
        required: false,
      },
    });

    expect(mockFormStore.subscribe).toBeCalledTimes(5);

    act(() => {
      document.body.removeChild(element);
    });

    expect(mockFormStore.removeField).toBeCalledTimes(1);
    expect(mockFormStore.unsubscribe).toBeCalledTimes(5);
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
