import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/dom";
import { handleMouseDown } from "./handleMouseDown";

describe("handleMouseDown", () => {
  const onCellMoving = jest.fn();
  const onCellMoved = jest.fn();
  const onCellResizing = jest.fn();
  const onCellResized = jest.fn();
  const onSwitchActiveTarget = jest.fn();
  const methods = {
    onCellMoving,
    onCellMoved,
    onCellResizing,
    onCellResized,
    onSwitchActiveTarget,
  };

  test("mousedown on edge", () => {
    const noopMouseDown = new MouseEvent("mousedown");
    handleMouseDown(noopMouseDown, {
      cell: { type: "edge", source: "a", target: "b" },
      action: "move",
      ...methods,
    });
    expect(onSwitchActiveTarget).toBeCalledWith({
      type: "edge",
      source: "a",
      target: "b",
    });
  });

  test("move node", () => {
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    handleMouseDown(mousedown, {
      action: "move",
      cell: { type: "node", id: "b", view: { x: 4, y: 6 } } as any,
      ...methods,
    });

    expect(onSwitchActiveTarget).toHaveBeenCalledWith({
      type: "node",
      id: "b",
    });

    fireEvent.mouseMove(document, { clientX: 11, clientY: 22 });
    expect(onCellMoving).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onCellMoving).toBeCalledWith({
      type: "node",
      id: "b",
      x: 19,
      y: 36,
    });

    fireEvent.mouseUp(document, { clientX: 26, clientY: 51 });
    expect(onCellMoved).toBeCalledWith({ type: "node", id: "b", x: 20, y: 37 });

    expect(onSwitchActiveTarget).toHaveBeenCalledTimes(1);

    document.body.replaceChildren();
  });

  test("resize node", () => {
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    handleMouseDown(mousedown, {
      action: "resize",
      cell: {
        type: "decorator",
        id: "b",
        view: { width: 100, height: 60 },
      } as any,
      ...methods,
    });

    expect(onSwitchActiveTarget).toHaveBeenCalledWith({
      type: "decorator",
      id: "b",
    });

    fireEvent.mouseMove(document, { clientX: 11, clientY: 22 });
    expect(onCellResizing).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onCellResizing).toBeCalledWith({
      type: "decorator",
      id: "b",
      width: 115,
      height: 90,
    });

    fireEvent.mouseUp(document, { clientX: 26, clientY: 51 });
    expect(onCellResized).toBeCalledWith({
      type: "decorator",
      id: "b",
      width: 116,
      height: 91,
    });

    expect(onSwitchActiveTarget).toHaveBeenCalledTimes(1);

    document.body.replaceChildren();
  });
});
