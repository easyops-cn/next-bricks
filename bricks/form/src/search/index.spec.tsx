import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./index.jsx";
import { GeneralSearch } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));
jest.useFakeTimers();

describe("form.general-search", () => {
  test("basic usage", async () => {
    const onSearch = jest.fn();
    const onBlur = jest.fn();
    const onChange = jest.fn();

    const element = document.createElement(
      "form.general-search"
    ) as GeneralSearch;
    element.value = "basic";
    element.allowClear = true;
    element.addEventListener("search", onSearch);
    element.addEventListener("blur", onBlur);
    element.addEventListener("change", onChange);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const input = element.shadowRoot?.querySelector(
      ".search-input"
    ) as HTMLElement;

    act(() => {
      fireEvent.blur(input);
    });
    expect(onBlur).toBeCalledWith(
      expect.objectContaining({
        detail: "basic",
      })
    );

    act(() => {
      fireEvent.change(input, { target: { value: "query" } });
    });
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: "query",
      })
    );

    act(() => {
      fireEvent.keyDown(input, { key: "Enter" });
    });
    expect(onSearch).toBeCalledWith(
      expect.objectContaining({
        detail: "query",
      })
    );

    act(() => {
      fireEvent.mouseDown(
        element.shadowRoot?.querySelector(".clear-button") as HTMLElement
      );
    });
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: "",
      })
    );

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".search-button") as HTMLElement
      );
    });
    expect(onSearch).toBeCalledWith(
      expect.objectContaining({
        detail: "",
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("debounceTime", async () => {
    const onChange = jest.fn();

    const element = document.createElement(
      "form.general-search"
    ) as GeneralSearch;
    element.trim = true;
    element.debounceTime = 1000;
    element.addEventListener("change", onChange);

    act(() => {
      document.body.appendChild(element);
    });

    const input = element.shadowRoot?.querySelector(
      ".search-input"
    ) as HTMLElement;

    act(() => {
      fireEvent.change(input, { target: { value: "   query   " } });
    });
    expect(onChange).not.toBeCalled();

    jest.advanceTimersByTime(1000);
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: "query",
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
  });
});
