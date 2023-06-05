import React from "react";
import { render, createEvent, act, fireEvent } from "@testing-library/react";
import { DesktopCustom } from "./DesktopCustom.js";

describe("DesktopCustom", () => {
  it("should work", () => {
    const stopPropagation = jest.fn();
    const handleClick = jest.fn();
    const handleAddClick = jest.fn();
    const name = "世界";
    const url = "/hello";
    const { container } = render(
      <DesktopCustom
        name={name}
        url={url}
        onAddClick={handleAddClick}
        onClick={handleClick}
        showAddIcon={true}
        isFavorite={true}
      />
    );

    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "default-app-icon.png"
    );

    const mockEvent = createEvent.click(
      container.querySelector("basic\\.general-link") as HTMLElement
    );
    mockEvent.stopPropagation = stopPropagation;
    act(() => {
      fireEvent(
        container.querySelector("basic\\.general-link") as HTMLElement,
        mockEvent
      );
    });

    expect(stopPropagation).toBeCalled();
    expect(mockEvent.defaultPrevented).toBeFalsy();
    expect(handleClick).toBeCalled();

    expect(container.querySelector(".addIcon")).toBeTruthy();
    act(() => {
      fireEvent.click(container.querySelector(".addIcon") as HTMLElement);
    });
    expect(handleAddClick).toBeCalledTimes(1);

    act(() => {
      fireEvent(
        container.querySelector("basic\\.general-link") as HTMLElement,
        mockEvent
      );
    });

    expect(stopPropagation).toBeCalledTimes(2);
  });
});
