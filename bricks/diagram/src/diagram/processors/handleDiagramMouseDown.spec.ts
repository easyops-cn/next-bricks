import { describe, test, expect, jest } from "@jest/globals";
import type React from "react";
import { fireEvent } from "@testing-library/react";
import { handleDiagramMouseDown } from "./handleDiagramMouseDown";

describe("handleDiagramMouseDown", () => {
  const setConnectLineState = jest.fn();
  const setConnectLineTo = jest.fn();
  const onSwitchActiveNode = jest.fn();
  const onNodesConnect = jest.fn();
  const methods = {
    setConnectLineState,
    setConnectLineTo,
    onSwitchActiveNode,
    onNodesConnect,
  };

  test("no nodesConnect", () => {
    handleDiagramMouseDown({} as React.MouseEvent, {
      nodes: [],
      nodesConnect: undefined,
      nodesRefRepository: null,
      ...methods,
    });
    expect(setConnectLineState).not.toBeCalled();
  });

  test("no nodesRefRepository", () => {
    handleDiagramMouseDown({} as React.MouseEvent, {
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
    handleDiagramMouseDown(
      {
        target: nodeB,
        clientX: 10,
        clientY: 20,
      } as unknown as React.MouseEvent,
      {
        nodes: [{ id: "a" }, { id: "b" }],
        nodesConnect: {},
        nodesRefRepository: new Map([
          ["a", nodeA],
          ["b", nodeB],
        ]),
        ...methods,
      }
    );
    expect(setConnectLineState).toBeCalledWith({
      from: [10, 20],
      options: {
        strokeColor: "var(--palette-gray-5)",
        strokeWidth: 1,
      },
    });
    expect(setConnectLineTo).toBeCalledWith([10, 20]);
    expect(onSwitchActiveNode).toBeCalledWith("b");

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
    handleDiagramMouseDown(
      {
        target: nodeA,
        clientX: 10,
        clientY: 20,
      } as unknown as React.MouseEvent,
      config
    );
    expect(setConnectLineState).not.toBeCalled();

    handleDiagramMouseDown(
      {
        target: nodeB,
        clientX: 10,
        clientY: 20,
      } as unknown as React.MouseEvent,
      config
    );
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
    handleDiagramMouseDown(
      {
        target: nodeB,
        clientX: 10,
        clientY: 20,
      } as unknown as React.MouseEvent,
      config
    );
    expect(setConnectLineState).not.toBeCalled();

    handleDiagramMouseDown(
      {
        target: nodeA,
        clientX: 10,
        clientY: 20,
      } as unknown as React.MouseEvent,
      config
    );
    expect(setConnectLineState).toBeCalledTimes(1);
  });
});
