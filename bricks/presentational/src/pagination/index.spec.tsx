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
    expect(element.shadowRoot?.querySelectorAll(".size-changer").length).toBe(
      1
    );

    act(() => {
      fireEvent.click(element.shadowRoot.querySelectorAll(".jump")[0]);
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
      fireEvent.click(element.shadowRoot.querySelectorAll(".jump")[1]);
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
      fireEvent.click(element.shadowRoot.querySelectorAll(".arrow")[0]);
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
      fireEvent.click(element.shadowRoot.querySelectorAll(".arrow")[1]);
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
      fireEvent.click(last(element.shadowRoot.querySelectorAll(".number")));
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
      fireEvent(
        element.shadowRoot.querySelectorAll("eo-dropdown-actions")[0],
        new CustomEvent("action.click", {
          detail: { key: element.pageSizeOptions[0] },
        })
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

  test("showSizeChanger is false", () => {
    const element = document.createElement("eo-pagination") as EoPagination;
    const onChange = jest.fn();
    element.total = 100;
    element.pageSize = 10;
    element.page = 10;
    element.showSizeChanger = false;
    element.addEventListener("change", onChange);
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelectorAll(".size-changer").length).toBe(
      0
    );
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("token", async () => {
    const element = document.createElement("eo-pagination") as EoPagination;
    const onChange = jest.fn();
    element.type = "token";
    element.nextToken = "next-123";
    element.addEventListener("change", onChange);

    act(() => {
      document.body.appendChild(element);
    });

    // Go to previous page but it's disabled
    fireEvent.click(element.shadowRoot.querySelectorAll(".arrow")[0]);
    expect(onChange).toBeCalledTimes(0);

    // Go to next page
    act(() => {
      fireEvent.click(element.shadowRoot.querySelectorAll(".arrow")[1]);
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "change",
        detail: {
          type: "token",
          nextToken: "next-123",
          pageSize: 20,
        },
      })
    );
    expect(element.nextToken).toBe(null);
    expect(element.previousToken).toBe(undefined);

    // Set previousToken
    element.previousToken = "prev-123";
    await act(async () => {
      await (global as any).flushPromises();
    });

    // Go to next page but it's disabled
    fireEvent.click(element.shadowRoot.querySelectorAll(".arrow")[1]);
    expect(onChange).toBeCalledTimes(1);

    // Go to previous page
    act(() => {
      fireEvent.click(element.shadowRoot.querySelectorAll(".arrow")[0]);
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "change",
        detail: {
          type: "token",
          nextToken: "prev-123",
          pageSize: 20,
        },
      })
    );
    expect(element.nextToken).toBe(null);
    expect(element.previousToken).toBe(null);

    // Change pageSize
    act(() => {
      fireEvent(
        element.shadowRoot.querySelectorAll("eo-dropdown-actions")[0],
        new CustomEvent("action.click", {
          detail: { key: element.pageSizeOptions[0] },
        })
      );
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "change",
        detail: {
          type: "token",
          nextToken: undefined,
          pageSize: 10,
        },
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
  });
});
