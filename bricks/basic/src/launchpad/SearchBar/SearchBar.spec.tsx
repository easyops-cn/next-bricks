import React from "react";
import {
  render,
  act,
  fireEvent,
  createEvent,
  waitFor,
  screen,
} from "@testing-library/react";
import { SearchBar } from "./SearchBar.js";
import { initializeReactI18n } from "@next-core/i18n/react";
initializeReactI18n();

describe("SearchBar", () => {
  it("should trigger input onChange", async () => {
    const onChange = jest.fn();
    act(() => {
      render(<SearchBar onChange={onChange} />);
    });
    await waitFor(async () => {
      fireEvent.change(await screen.findByRole("input"), {
        target: {
          value: "hello",
        },
      });
    });
    expect(onChange).toBeCalledWith("hello");
  });

  it("should stop propagation when click input", async () => {
    const stopPropagation = jest.fn();
    render(<SearchBar onChange={jest.fn()} />);

    const mockEvent = createEvent.click(
      await screen.findByRole("inputContainer")
    );
    mockEvent.stopPropagation = stopPropagation;
    await waitFor(async () => {
      fireEvent(await screen.findByRole("inputContainer"), mockEvent);
    });
    expect(stopPropagation).toBeCalled();
  });

  it("should prevent default when certain keydown", async () => {
    render(<SearchBar onChange={jest.fn()} />);
    const mockEvent1 = createEvent.keyDown(
      (await screen.findByRole("input")) as HTMLElement,
      {
        key: "a",
      }
    );
    await waitFor(async () => {
      fireEvent(await screen.findByRole("input"), mockEvent1);
    });

    expect(mockEvent1.defaultPrevented).toBeFalsy();

    const mockEvent2 = createEvent.keyDown(await screen.findByRole("input"), {
      key: "ArrowLeft",
    });
    await waitFor(async () => {
      fireEvent(await screen.findByRole("input"), mockEvent2);
    });

    expect(mockEvent2.defaultPrevented).toBeTruthy();
  });

  it("should handle focus and blur", async () => {
    const { container } = render(<SearchBar onChange={jest.fn()} />);
    expect(container.querySelector(".focus")).toBeFalsy();
    await waitFor(async () => {
      await fireEvent.focus(container.querySelector("input") as HTMLElement);
    });
    expect(container.querySelector(".focus")).toBeTruthy();
    await waitFor(async () => {
      await fireEvent.blur(container.querySelector("input") as HTMLElement);
    });
    expect(container.querySelector(".focus")).toBeFalsy();
  });
});
