import { describe, test, expect } from "@jest/globals";
import { act } from "@testing-library/react";
import "./";
import { Checkbox } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-button", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-checkbox") as Checkbox;
    element.options = [
      {
        label: "a",
        value: "a",
      },
      {
        label: "b",
        value: "b",
      },
    ];

    const mockChangeEvent = jest.fn();
    const mockOptionsChangeEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("options.change", mockOptionsChangeEvent);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(
      element.shadowRoot?.querySelector(".checkboxWrapper")?.childNodes.length
    ).toBe(2);
    expect(element.value).toBe(undefined);

    expect(mockChangeEvent).toBeCalledTimes(0);
    act(() => {
      (
        element.shadowRoot?.querySelector(
          "input[type='checkbox']"
        ) as HTMLElement
      ).click();
    });

    expect(mockChangeEvent).toBeCalledWith(
      expect.objectContaining({
        detail: [
          {
            label: "a",
            value: "a",
          },
        ],
      })
    );
    expect(element.value).toEqual(["a"]);
    expect(
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='checkbox']"
        )[0] as HTMLInputElement
      ).checked
    ).toBeTruthy();
    expect(mockOptionsChangeEvent).toBeCalledTimes(0);

    await act(async () => {
      await (element.value = ["b"]);
    });

    expect(
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='checkbox']"
        )[0] as HTMLInputElement
      ).checked
    ).toBeFalsy();

    expect(
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='checkbox']"
        )[1] as HTMLInputElement
      ).checked
    ).toBe(true);

    act(() => {
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='checkbox']"
        )[1] as HTMLInputElement
      ).click();
    });
    expect(element.value).toEqual([]);
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
  test("isGroup", async () => {
    const element = document.createElement("eo-checkbox") as Checkbox;
    element.isGroup = true;
    element.optionGroups = [
      {
        name: "分组1",
        key: "1",
        options: [
          { label: "a", value: "a", checkboxColor: "orange" },
          { label: "b", value: "b", checkboxColor: "green" },
        ],
      },
      {
        name: "分组2",
        key: "2",
        options: [
          { label: "c", value: "c" },
          { label: "d", value: "d" },
        ],
      },
    ];

    const mockChangeEvent = jest.fn();
    const mockOptionsChangeEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("options.change", mockOptionsChangeEvent);
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(3);
    expect(
      element.shadowRoot?.querySelectorAll(".collapse-header").length
    ).toBe(2);
    act(() => {
      (
        element.shadowRoot?.querySelectorAll(
          ".collapse-header"
        )?.[0] as HTMLElement
      ).click();
    });
    expect(
      element.shadowRoot?.querySelectorAll(".collapse-content-visible").length
    ).toBe(1);
    act(() => {
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='checkbox']"
        )[0] as HTMLInputElement
      ).click();
    });
    expect(mockChangeEvent).toBeCalledWith(
      expect.objectContaining({
        detail: [
          { label: "a", value: "a", checkboxColor: "orange" },
          { label: "b", value: "b", checkboxColor: "green" },
        ],
      })
    );
    act(() => {
      (
        element.shadowRoot?.querySelectorAll(
          "input[type='checkbox']"
        )[1] as HTMLInputElement
      ).click();
    });
    expect(
      element.shadowRoot?.querySelectorAll(".checkboxInputPartCheck").length
    ).toBe(1);
    act(() => {
      (
        element.shadowRoot?.querySelectorAll(
          ".collapse-header"
        )?.[0] as HTMLElement
      ).click();
    });
    expect(
      element.shadowRoot?.querySelectorAll(".collapse-content-visible").length
    ).toBe(2);

    await act(async () => {
      await (element.value = ["a", "b"]);
    });
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("icon", async () => {
    const element = document.createElement("eo-checkbox") as Checkbox;
    element.type = "icon";
    element.options = [
      {
        label: "a",
        value: "a",
        checkboxColor: "orange",
        icon: { icon: "bar-chart", lib: "antd" },
      },
      {
        icon: { icon: "search", lib: "antd" },
        label: "b",
        value: "b",
        checkboxColor: "green",
      },
    ];

    const mockChangeEvent = jest.fn();
    const mockOptionsChangeEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("options.change", mockOptionsChangeEvent);
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);
    expect(element.shadowRoot?.querySelectorAll(".content").length).toBe(2);
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
