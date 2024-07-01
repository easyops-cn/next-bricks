import React from "react";
import { act } from "react-dom/test-utils";
import { describe, test, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import { DecoratorText } from "./DecoratorText";
describe("DecoratorText", () => {
  test("basic usage", () => {
    const onDecoratorTextEditing = jest.fn();
    const onDecoratorTextChange = jest.fn();

    const { container } = render(
      <svg>
        <DecoratorText
          cell={{
            type: "decorator",
            decorator: "text",
            id: "1",
            view: {
              x: 1,
              y: 2,
              width: 3,
              height: 4,
              text: "Text",
            },
          }}
          onDecoratorTextEditing={onDecoratorTextEditing}
          onDecoratorTextChange={onDecoratorTextChange}
        />
      </svg>
    );
    expect(
      container.querySelector(".text-container")?.classList.contains("editing")
    ).toBe(false);

    act(() => {
      fireEvent.doubleClick(container.querySelector(".text-container")!);
    });

    expect(
      container.querySelector(".text-container")?.classList.contains("editing")
    ).toBe(true);
    expect(onDecoratorTextEditing).toHaveBeenCalledWith({
      id: "1",
      editing: true,
    });

    container.querySelector(".text")!.textContent = "Updated";
    act(() => {
      fireEvent.input(container.querySelector(".text")!);
    });
    act(() => {
      fireEvent.blur(container.querySelector(".text")!);
    });
    expect(onDecoratorTextChange).toHaveBeenCalledWith({
      id: "1",
      view: { x: 1, y: 2, width: 0, height: 0, text: "Updated" },
    });
  });
});
