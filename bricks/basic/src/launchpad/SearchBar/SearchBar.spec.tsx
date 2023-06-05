import React from "react";
import { render, act, fireEvent, createEvent } from "@testing-library/react";
import { Input } from "antd";
import { SearchBar } from "./SearchBar.js";

describe("SearchBar", () => {
  it("should trigger input onChange", () => {
    const onChange = jest.fn();
    const { container } = render(<SearchBar onChange={onChange} />);
    // wrapper.find(Input).invoke("onChange")({
    //   target: {
    //     value: "hello",
    //   },
    // } as any);
    act(() => {
      fireEvent.change(container.querySelector("input") as HTMLElement, {
        target: {
          value: "hello",
        },
      });
    });
    expect(onChange).toBeCalledWith("hello");
  });

  it("should stop propagation when click input", () => {
    const stopPropagation = jest.fn();
    const { container } = render(<SearchBar onChange={jest.fn()} />);

    const mockEvent = createEvent.click(
      container.querySelector(".inputContainer") as HTMLElement
    );
    mockEvent.stopPropagation = stopPropagation;
    act(() => {
      fireEvent(
        container.querySelector(".inputContainer") as HTMLElement,
        mockEvent
      );
    });
    expect(stopPropagation).toBeCalled();
  });

  it("should prevent default when certain keydown", () => {
    const { container } = render(<SearchBar onChange={jest.fn()} />);
    const mockEvent1 = createEvent.keyDown(
      container.querySelector("input") as HTMLElement,
      {
        key: "a",
      }
    );
    fireEvent(container.querySelector("input") as HTMLElement, mockEvent1);

    expect(mockEvent1.defaultPrevented).toBeFalsy();

    const mockEvent2 = createEvent.keyDown(
      container.querySelector("input") as HTMLElement,
      {
        key: "ArrowLeft",
      }
    );
    fireEvent(container.querySelector("input") as HTMLElement, mockEvent2);

    expect(mockEvent2.defaultPrevented).toBeTruthy();
  });

  it("should handle focus and blur", () => {
    const { container } = render(<SearchBar onChange={jest.fn()} />);
    expect(container.querySelector(".focus")).toBeFalsy();
    fireEvent.focus(container.querySelector("input") as HTMLElement);
    expect(container.querySelector(".focus")).toBeTruthy();
    fireEvent.blur(container.querySelector("input") as HTMLElement);
    expect(container.querySelector(".focus")).toBeFalsy();
  });
});
