import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MoreOption } from "./MoreOption";
import { act } from "react";

describe("MoreOption", () => {
  it("should work", async () => {
    const { container } = render(<MoreOption />);
    expect(container.querySelector("span").textContent).toBe("20 ");
  });

  it("should work with props", async () => {
    const mockClickFn = jest.fn();
    const { container } = render(
      <MoreOption itemsCount={10} onBlur={mockClickFn} />
    );

    await act(async () => {
      await fireEvent.click(container.querySelector("eo-icon"));
    });

    await act(async () => {
      await fireEvent(
        container.querySelector("eo-input"),
        new CustomEvent("change", { detail: 100 })
      );
    });

    await act(async () => {
      await fireEvent.blur(container.querySelector("eo-input"));
    });

    expect(mockClickFn).toHaveBeenCalledWith(100);
  });
});
