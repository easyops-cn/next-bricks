import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/dom";
import { handleNodesMouseDown } from "./handleNodesMouseDown";

describe("handleNodesMouseDown", () => {
  const setConnectLineState = jest.fn();
  const setConnectLineTo = jest.fn();
  const setManualLayoutStatus = jest.fn();
  const setNodeMovement = jest.fn();
  const onSwitchActiveTarget = jest.fn();
  const onNodesConnect = jest.fn();
  const methods = {
    setConnectLineState,
    setConnectLineTo,
    setManualLayoutStatus,
    setNodeMovement,
    onSwitchActiveTarget,
    onNodesConnect,
  };
  const noopMouseDown = new MouseEvent("mousedown");

  test("no connectNodes", () => {
    handleNodesMouseDown(noopMouseDown, {
      nodes: [],
      connectNodes: undefined,
      dragNodes: undefined,
      nodesRefRepository: null,
      scale: 1,
      ...methods,
    });
    expect(setConnectLineState).not.toBeCalled();
  });

  test("no nodesRefRepository", () => {
    handleNodesMouseDown(noopMouseDown, {
      nodes: [],
      connectNodes: {},
      dragNodes: undefined,
      nodesRefRepository: null,
      scale: 1,
      ...methods,
    });
    expect(setConnectLineState).not.toBeCalled();
  });

  test("default connectNodes", () => {
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
      connectNodes: {},
      dragNodes: undefined,
      nodesRefRepository: new Map([
        ["a", nodeA],
        ["b", nodeB],
      ]),
      scale: 1,
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
      connectNodes: { sourceType: "page" },
      dragNodes: undefined,
      nodesRefRepository: new Map([
        ["a", nodeA],
        ["b", nodeB],
      ]),
      scale: 1,
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
      connectNodes: { if: '<% DATA.source.type === "board" %>' },
      dragNodes: undefined,
      nodesRefRepository: new Map([
        ["a", nodeA],
        ["b", nodeB],
      ]),
      scale: 1,
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

  test("default dragNodes", () => {
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
      connectNodes: undefined,
      dragNodes: {},
      nodesRefRepository: new Map([
        ["a", nodeA],
        ["b", nodeB],
      ]),
      scale: 0.75,
      ...methods,
    });
    expect(onSwitchActiveTarget).toBeCalledWith({ type: "node", nodeId: "b" });

    fireEvent.mouseMove(document, { clientX: 11, clientY: 22 });
    expect(setManualLayoutStatus).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(setManualLayoutStatus).toBeCalledWith("started");
    expect(setNodeMovement).toBeCalledWith({ id: "b", move: [20, 40] });

    fireEvent.mouseUp(nodeA);
    expect(setNodeMovement).toHaveBeenLastCalledWith(null);
    expect(setManualLayoutStatus).toBeCalledWith("finished");

    document.body.replaceChildren();
  });
});
