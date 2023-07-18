import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import { EoPagination } from "./index.js";
import { last } from "lodash";

jest.mock("@next-core/theme", () => ({}));
jest.mock("react-i18next", () => {
  const originalModule = jest.requireActual("react-i18next") as any;
  return {
    ...originalModule,
    Trans: jest.fn(),
  };
});

describe("eo-pagination", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-pagination") as EoPagination;
    const onChange = jest.fn();
    element.total = 1000;
    element.pageSize = 20;
    element.page = 10;
    element.addEventListener("change", onChange);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      fireEvent.click(
        element.shadowRoot.querySelectorAll(".pagination-page-item-jump")[0]
      );
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "change",
        detail: {
          page: 5,
          pageSize: 20,
        },
      })
    );
    expect(element.page).toBe(5);
    expect(element.pageSize).toBe(20);

    act(() => {
      fireEvent.click(
        element.shadowRoot.querySelectorAll(".pagination-page-item-jump")[1]
      );
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "change",
        detail: {
          page: 10,
          pageSize: 20,
        },
      })
    );
    expect(element.page).toBe(10);
    expect(element.pageSize).toBe(20);

    act(() => {
      fireEvent.click(
        element.shadowRoot.querySelectorAll(".pagination-page-item-arrow")[0]
      );
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "change",
        detail: {
          page: 9,
          pageSize: 20,
        },
      })
    );
    expect(element.page).toBe(9);
    expect(element.pageSize).toBe(20);

    act(() => {
      fireEvent.click(
        element.shadowRoot.querySelectorAll(".pagination-page-item-arrow")[1]
      );
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "change",
        detail: {
          page: 10,
          pageSize: 20,
        },
      })
    );
    expect(element.page).toBe(10);
    expect(element.pageSize).toBe(20);

    act(() => {
      fireEvent.click(
        last(
          element.shadowRoot.querySelectorAll(".pagination-page-item-number")
        )
      );
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "change",
        detail: {
          page: 50,
          pageSize: 20,
        },
      })
    );
    expect(element.page).toBe(50);
    expect(element.pageSize).toBe(20);

    act(() => {
      fireEvent.click(
        element.shadowRoot.querySelectorAll(".pagination-size-selector-item")[0]
      );
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "change",
        detail: {
          page: 1,
          pageSize: 10,
        },
      })
    );
    expect(element.page).toBe(1);
    expect(element.pageSize).toBe(10);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
