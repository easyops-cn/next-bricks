import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/dom";
import { handleNodesMouseDown } from "./handleNodesMouseDown";

describe("handleNodesMouseDown", () => {
  const setConnectLineState = jest.fn();
  const setConnectLineTo = jest.fn();
  const onSwitchActiveTarget = jest.fn();
  const onNodesConnect = jest.fn();
  const methods = {
    setConnectLineState,
    setConnectLineTo,
    onSwitchActiveTarget,
    onNodesConnect,
  };
  const noopMouseDown = new MouseEvent("mousedown");

  test("no nodesConnect", () => {
    handleNodesMouseDown(noopMouseDown, {
      nodes: [],
      nodesConnect: undefined,
      nodesRefRepository: null,
      ...methods,
    });
    expect(setConnectLineState).not.toBeCalled();
  });

  test("no nodesRefRepository", () => {
    handleNodesMouseDown(noopMouseDown, {
      nodes: [],
      nodesConnect: {},
      nodesRefRepository: null,
      ...methods,
    });
    expect(setConnectLineState).not.toBeCalled();
  });

  test("default nodesConnect", () => {
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");
    document.body.append(nodeA);
    document.body.append(nodeB);
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    Object.defineProperty(mousedown, "target", {
      value: nodeB,
      enumerable: true,
    });
    handleNodesMouseDown(mousedown, {
      nodes: [{ id: "a" }, { id: "b" }],
      nodesConnect: {},
      nodesRefRepository: new Map([
        ["a", nodeA],
        ["b", nodeB],
      ]),
      ...methods,
    });
    expect(setConnectLineState).toBeCalledWith({
      from: [10, 20],
      options: {
        strokeColor: "var(--palette-gray-5)",
        strokeWidth: 1,
      },
    });
    expect(setConnectLineTo).toBeCalledWith([10, 20]);
    expect(onSwitchActiveTarget).toBeCalledWith({ type: "node", nodeId: "b" });

    fireEvent.mouseMove(document, { clientX: 300, clientY: 400 });
    expect(setConnectLineTo).toBeCalledWith([300, 400]);

    fireEvent.mouseUp(nodeA);
    expect(onNodesConnect).toBeCalledWith({
      source: { id: "b" },
      target: { id: "a" },
    });

    document.body.replaceChildren();
  });

  test("filter by sourceType", () => {
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");
    document.body.append(nodeA);
    document.body.append(nodeB);
    const config = {
      nodes: [
        { id: "a", type: "board" },
        { id: "b", type: "page" },
      ],
      nodesConnect: { sourceType: "page" },
      nodesRefRepository: new Map([
        ["a", nodeA],
        ["b", nodeB],
      ]),
      ...methods,
    };
    const mousedownA = new MouseEvent("mousedown", {
      clientX: 10,
      clientY: 20,
    });
    Object.defineProperty(mousedownA, "target", {
      value: nodeA,
      enumerable: true,
    });
    handleNodesMouseDown(mousedownA, config);
    expect(setConnectLineState).not.toBeCalled();

    const mousedownB = new MouseEvent("mousedown", {
      clientX: 10,
      clientY: 20,
    });
    Object.defineProperty(mousedownB, "target", {
      value: nodeB,
      enumerable: true,
    });
    handleNodesMouseDown(mousedownB, config);
    expect(setConnectLineState).toBeCalledTimes(1);

    // It will be ignored if mouseup on the same node.
    fireEvent.mouseUp(nodeB);
    expect(onNodesConnect).not.toBeCalled();
  });

  test("filter by if", () => {
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");
    document.body.append(nodeA);
    document.body.append(nodeB);
    const config = {
      nodes: [
        { id: "a", type: "board" },
        { id: "b", type: "page" },
      ],
      nodesConnect: { if: '<% DATA.source.type === "board" %>' },
      nodesRefRepository: new Map([
        ["a", nodeA],
        ["b", nodeB],
      ]),
      ...methods,
    };
    const mousedownB = new MouseEvent("mousedown", {
      clientX: 10,
      clientY: 20,
    });
    Object.defineProperty(mousedownB, "target", {
      value: nodeB,
      enumerable: true,
    });
    handleNodesMouseDown(mousedownB, config);
    expect(setConnectLineState).not.toBeCalled();

    const mousedownA = new MouseEvent("mousedown", {
      clientX: 10,
      clientY: 20,
    });
    Object.defineProperty(mousedownA, "target", {
      value: nodeA,
      enumerable: true,
    });
    handleNodesMouseDown(mousedownA, config);
    expect(setConnectLineState).toBeCalledTimes(1);
  });
});
