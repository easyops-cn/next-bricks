import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/dom";
import { handleMouseDown } from "./handleMouseDown";

describe("handleMouseDown", () => {
  const onNodeMoving = jest.fn();
  const onNodeMoved = jest.fn();
  const onSwitchActiveTarget = jest.fn();
  const methods = {
    onNodeMoving,
    onNodeMoved,
    onSwitchActiveTarget,
  };

  test("no nodesRefRepository", () => {
    const noopMouseDown = new MouseEvent("mousedown");
    handleMouseDown(noopMouseDown, {
      cells: [],
      nodesRefRepository: null,
      ...methods,
    });
    expect(onNodeMoving).not.toBeCalled();
  });

  test("move node", () => {
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");
    const nodeAContainer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    const nodeBContainer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    nodeAContainer.append(nodeA);
    nodeBContainer.append(nodeB);
    document.body.append(nodeAContainer);
    document.body.append(nodeBContainer);
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    Object.defineProperty(mousedown, "target", {
      value: nodeB,
      enumerable: true,
    });
    handleMouseDown(mousedown, {
      cells: [
        { type: "node", id: "a" },
        { type: "node", id: "b" },
      ] as any[],
      nodesRefRepository: new Map([
        ["a", nodeA],
        ["b", nodeB],
      ]),
      ...methods,
    });

    expect(onSwitchActiveTarget).toHaveBeenCalledWith({
      type: "node",
      id: "b",
    });

    fireEvent.mouseMove(document, { clientX: 11, clientY: 22 });
    expect(onNodeMoving).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onNodeMoving).toBeCalledWith({ id: "b", x: 19, y: 36 });

    fireEvent.mouseUp(nodeA, { clientX: 26, clientY: 51 });
    expect(onNodeMoved).toBeCalledWith({ id: "b", x: 20, y: 37 });

    expect(onSwitchActiveTarget).toHaveBeenCalledTimes(1);

    document.body.replaceChildren();
  });
});
