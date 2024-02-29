import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/dom";
import { handleMouseDown } from "./handleMouseDown";

describe("handleMouseDown", () => {
  const onNodeMoving = jest.fn();
  const onNodeMoved = jest.fn();
  const methods = {
    onNodeMoving,
    onNodeMoved,
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
    Object.defineProperties(nodeAContainer, {
      x: { value: { baseVal: { value: 3 } } },
      y: { value: { baseVal: { value: 5 } } },
    });
    Object.defineProperties(nodeBContainer, {
      x: { value: { baseVal: { value: 4 } } },
      y: { value: { baseVal: { value: 6 } } },
    });
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

    fireEvent.mouseMove(document, { clientX: 11, clientY: 22 });
    expect(onNodeMoving).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onNodeMoving).toBeCalledWith({ id: "b", x: 19, y: 36 });

    fireEvent.mouseUp(nodeA, { clientX: 26, clientY: 51 });
    expect(onNodeMoved).toBeCalledWith({ id: "b", x: 20, y: 37 });

    expect(nodeBContainer.x.baseVal.value).toBe(20);
    expect(nodeBContainer.y.baseVal.value).toBe(37);

    document.body.replaceChildren();
  });
});
