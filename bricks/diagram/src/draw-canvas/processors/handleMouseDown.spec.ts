import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/dom";
import { handleMouseDown } from "./handleMouseDown";
import type { Cell } from "../interfaces";

describe("handleMouseDown", () => {
  const onCellsMoving = jest.fn();
  const onCellsMoved = jest.fn();
  const onCellResizing = jest.fn();
  const onCellResized = jest.fn();
  const onSwitchActiveTarget = jest.fn();
  const methods = {
    onCellsMoving,
    onCellsMoved,
    onCellResizing,
    onCellResized,
    onSwitchActiveTarget,
    scale: 1,
    cells: [],
    activeTarget: null,
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
    expect(onCellsMoving).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onCellsMoving).toBeCalledWith([
      {
        type: "node",
        id: "b",
        x: 19,
        y: 36,
      },
    ]);

    fireEvent.mouseUp(document, { clientX: 26, clientY: 51 });
    expect(onCellsMoved).toBeCalledWith([
      { type: "node", id: "b", x: 20, y: 37 },
    ]);

    expect(onSwitchActiveTarget).toHaveBeenCalledTimes(1);

    document.body.replaceChildren();
  });

  test("move container node", () => {
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    handleMouseDown(mousedown, {
      action: "move",
      cell: {
        type: "decorator",
        id: "container-1",
        decorator: "container",
        view: { x: 4, y: 6 },
      } as any,
      ...methods,
      cells: [
        {
          type: "node",
          id: "a",
          containerId: "container-1",
          view: {
            x: 20,
            y: 50,
            width: 60,
            height: 60,
          },
        },
        {
          type: "decorator",
          id: "container-1",
          decorator: "container",
          view: {
            x: 50,
            y: 400,
            width: 280,
            height: 120,
            direction: "top",
            text: " 上层服务",
          },
        },
      ],
    });

    expect(onSwitchActiveTarget).toHaveBeenCalledWith({
      type: "decorator",
      id: "container-1",
    });

    fireEvent.mouseMove(document, { clientX: 11, clientY: 22 });
    expect(onCellsMoving).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onCellsMoving).toBeCalledWith([
      {
        decorator: "container",
        height: undefined,
        id: "container-1",
        type: "decorator",
        width: undefined,
        x: 19,
        y: 36,
      },
      {
        decorator: undefined,
        height: 60,
        id: "a",
        type: "node",
        width: 60,
        x: 35,
        y: 80,
      },
    ]);

    fireEvent.mouseUp(document, { clientX: 26, clientY: 51 });
    expect(onCellsMoved).toBeCalledWith([
      {
        decorator: "container",
        height: undefined,
        id: "container-1",
        type: "decorator",
        width: undefined,
        x: 20,
        y: 37,
      },
      {
        id: "a",
        type: "node",
        decorator: undefined,
        width: 60,
        height: 60,
        x: 36,
        y: 81,
      },
    ]);

    expect(onSwitchActiveTarget).toHaveBeenCalledTimes(1);

    document.body.replaceChildren();
  });

  test("move node and snap to grid", () => {
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    handleMouseDown(mousedown, {
      action: "move",
      cell: { type: "node", id: "b", view: { x: 4, y: 6 } } as any,
      layoutOptions: {
        snapToGrid: true,
      },
      ...methods,
    });

    expect(onSwitchActiveTarget).toHaveBeenCalledWith({
      type: "node",
      id: "b",
    });

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onCellsMoving).toBeCalledWith([
      {
        type: "node",
        id: "b",
        x: 20,
        y: 40,
      },
    ]);

    fireEvent.mouseUp(document, { clientX: 26, clientY: 51 });
    expect(onCellsMoved).toBeCalledWith([
      { type: "node", id: "b", x: 20, y: 40 },
    ]);

    expect(onSwitchActiveTarget).toHaveBeenCalledTimes(1);

    document.body.replaceChildren();
  });

  test("move multi nodes", () => {
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    handleMouseDown(mousedown, {
      action: "move",
      cell: { type: "node", id: "b", view: { x: 4, y: 6 } } as any,
      ...methods,
      cells: [
        { type: "node", id: "a", view: { x: 44, y: 46 } } as any,
        { type: "node", id: "b", view: { x: 4, y: 6 } } as any,
        { type: "node", id: "c", view: { x: 144, y: 146 } } as any,
      ],
      activeTarget: {
        type: "multi",
        targets: [
          {
            type: "node",
            id: "b",
          },
          {
            type: "node",
            id: "c",
          },
        ],
      },
    });

    fireEvent.mouseMove(document, { clientX: 11, clientY: 22 });
    expect(onCellsMoving).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onCellsMoving).toBeCalledWith([
      {
        type: "node",
        id: "b",
        x: 19,
        y: 36,
      },
      {
        type: "node",
        id: "c",
        x: 159,
        y: 176,
      },
    ]);

    fireEvent.mouseUp(document, { clientX: 26, clientY: 51 });
    expect(onCellsMoved).toBeCalledWith([
      { type: "node", id: "b", x: 20, y: 37 },
      { type: "node", id: "c", x: 160, y: 177 },
    ]);

    expect(onSwitchActiveTarget).not.toHaveBeenCalled();

    document.body.replaceChildren();
  });

  test("no movable nodes", () => {
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    handleMouseDown(mousedown, {
      action: "move",
      cell: { type: "node", id: "b", view: { x: 4, y: 6 } } as any,
      ...methods,
      layout: "force",
      cells: [
        { type: "node", id: "a", view: { x: 44, y: 46 } } as any,
        { type: "node", id: "b", view: { x: 4, y: 6 } } as any,
        { type: "node", id: "c", view: { x: 144, y: 146 } } as any,
      ],
      activeTarget: {
        type: "multi",
        targets: [
          {
            type: "node",
            id: "b",
          },
          {
            type: "node",
            id: "c",
          },
        ],
      },
    });

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onCellsMoving).not.toBeCalled();
    expect(onSwitchActiveTarget).not.toHaveBeenCalled();

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

  test("mousedown on node with force layout", () => {
    const noopMouseDown = new MouseEvent("mousedown");
    handleMouseDown(noopMouseDown, {
      cell: { type: "node", id: "a" } as Cell,
      action: "move",
      layout: "force",
      ...methods,
    });
    expect(onSwitchActiveTarget).toBeCalledWith({
      type: "node",
      id: "a",
    });
  });
});
