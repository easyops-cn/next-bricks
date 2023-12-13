import { describe, test, expect } from "@jest/globals";
import "./";
import { Select } from "./index.js";
import { act, fireEvent } from "@testing-library/react";

jest.mock("@next-core/theme", () => ({}));

const mockResolveFn = jest.fn(() => "");
customElements.define(
  "illustrations.get-illustration",
  class extends HTMLElement {
    resolve = mockResolveFn;
  }
);

describe("form.general-select", () => {
  const consoleError = jest.spyOn(console, "error").mockReturnValue();

  test("basic usage", async () => {
    const element = document.createElement("form.general-select") as Select;
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
    const mockSearchEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("options.change", mockOptionsChangeEvent);
    element.addEventListener("search", mockSearchEvent);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(
      (element.shadowRoot?.querySelector(".select-dropdown") as HTMLElement)
        .style.display
    ).toBe("none");

    act(() => {
      (
        element.shadowRoot?.querySelector(".select-selector") as HTMLElement
      ).click();
    });

    expect(
      (element.shadowRoot?.querySelector(".select-dropdown") as HTMLElement)
        .style.display
    ).toBe("");
    expect(element.shadowRoot?.querySelectorAll(".select-item").length).toBe(2);

    expect(mockChangeEvent).toBeCalledTimes(0);

    act(() => {
      (
        element.shadowRoot?.querySelector(".select-item") as HTMLElement
      ).click();
    });
    expect(mockChangeEvent).toBeCalledWith(
      expect.objectContaining({
        detail: {
          options: [{ label: "a", value: "a" }],
          value: "a",
        },
      })
    );
    expect(element.value).toBe("a");
    expect(
      (element.shadowRoot?.querySelector(".select-dropdown") as HTMLElement)
        .style.display
    ).toBe("none");

    expect(
      (
        element.shadowRoot?.querySelectorAll(".select-item")[0] as HTMLElement
      ).classList.contains("select-option-selected")
    ).toBeTruthy();

    expect(mockOptionsChangeEvent).not.toBeCalled();

    await act(async () => {
      await (element.options = [
        {
          label: "a",
          value: "a",
        },
        {
          label: "b",
          value: "b",
        },
        {
          label: "c",
          value: "c",
        },
      ]);
    });

    expect(mockOptionsChangeEvent).toBeCalled();

    await act(async () => {
      await (element.value = "c");
    });

    expect(
      (
        element.shadowRoot?.querySelectorAll(".select-item")[0] as HTMLElement
      ).classList.contains("select-option-selected")
    ).toBeFalsy();

    expect(
      (
        element.shadowRoot?.querySelectorAll(".select-item")[2] as HTMLElement
      ).classList.contains("select-option-selected")
    ).toBe(true);

    act(() => {
      fireEvent.change(
        element.shadowRoot?.querySelector(
          ".select-selection-search-input"
        ) as HTMLElement,
        { target: { value: "test" } }
      );
    });

    expect(mockSearchEvent).toBeCalledWith(
      expect.objectContaining({
        detail: {
          value: "test",
        },
      })
    );

    await act(async () => {
      await (element.value = null);
    });

    expect(consoleError).toBeCalledTimes(0);

    expect(
      element.shadowRoot?.querySelectorAll(
        ".select-item .select-option-selected"
      ).length
    ).toBe(0);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("mode is multiple", () => {
    const element = document.createElement("form.general-select") as Select;
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
    element.mode = "multiple";
    element.value = ["a", "b"];
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(
      element.shadowRoot?.querySelectorAll(
        ".select-item.select-option-selected"
      ).length
    ).toBe(2);

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(
          ".select-selection-search-input"
        ) as HTMLElement
      );
    });

    act(() => {
      fireEvent.keyDown(
        element.shadowRoot?.querySelector(
          ".select-selection-search-input"
        ) as HTMLElement,
        { code: "Backspace" }
      );
    });

    expect(
      element.shadowRoot?.querySelectorAll(
        ".select-item.select-option-selected"
      ).length
    ).toBe(1);

    expect(
      (
        element.shadowRoot?.querySelectorAll(".select-item")[0] as HTMLElement
      ).classList.contains("select-option-selected")
    ).toBeTruthy();

    expect(
      (
        element.shadowRoot?.querySelectorAll(".select-item")[1] as HTMLElement
      ).classList.contains("select-option-selected")
    ).toBeFalsy();

    act(() => {
      fireEvent.keyDown(
        element.shadowRoot?.querySelector(
          ".select-selection-search-input"
        ) as HTMLElement,
        { code: "Backspace" }
      );
    });

    expect(
      element.shadowRoot?.querySelectorAll(
        ".select-item.select-option-selected"
      ).length
    ).toBe(0);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("group", () => {
    const element = document.createElement("form.general-select") as Select;
    element.options = [
      {
        label: "a",
        value: "a",
        tag: "group 1",
      },
      {
        label: "b",
        value: "b",
        tag: "group 2",
      },
      {
        label: "c",
        value: "c",
      },
    ];
    element.groupBy = "tag";
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(
      element.shadowRoot?.querySelector(".dropdown-list")?.innerHTML
    ).toMatchInlineSnapshot(
      `"<div class="dropdown-inner"><div class="select-group-wrapper"><div class="select-group-label">group 1</div><div class="select-item select-item-option select-option-hover"><div class="select-item-option-content"><div class="option"><span class="label">a</span></div><div class="is-checked"><eo-icon lib="antd" icon="check" theme="outlined"></eo-icon></div></div></div></div><div class="select-group-wrapper"><div class="select-group-label">group 2</div><div class="select-item select-item-option"><div class="select-item-option-content"><div class="option"><span class="label">b</span></div><div class="is-checked"><eo-icon lib="antd" icon="check" theme="outlined"></eo-icon></div></div></div></div><div class="select-item select-item-option"><div class="select-item-option-content"><div class="option"><span class="label">c</span></div><div class="is-checked"><eo-icon lib="antd" icon="check" theme="outlined"></eo-icon></div></div></div></div>"`
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("fields", () => {
    const element = document.createElement("form.general-select") as Select;
    element.options = [
      {
        name: "a",
        id: "a",
      },
      {
        name: "b",
        id: "b",
      },
      {
        name: "c",
        id: "c",
      },
    ] as any;
    element.fields = {
      label: "name",
      value: "id",
    };
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelectorAll(".select-item")?.length).toBe(
      3
    );

    expect(
      element.shadowRoot?.querySelectorAll(".select-item .label")[0].innerHTML
    ).toBe("a");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
