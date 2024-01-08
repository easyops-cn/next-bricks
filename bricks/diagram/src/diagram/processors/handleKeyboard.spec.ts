import { describe, test, expect } from "@jest/globals";
import { handleKeyboard } from "./handleKeyboard";
import type { RenderedEdge, RenderedNode } from "../interfaces";

describe("handleKeyboard", () => {
  // Nodes map:
  //
  // ```
  //       a
  //      ↙ ↘
  //     b   c
  //   ↙ ↓ ↘
  // d   e   f
  // ```
  const renderedNodes = [
    {
      id: "a",
      data: {
        id: "a",
      },
      x: 150,
      y: 0,
    },
    {
      id: "b",
      data: {
        id: "b",
      },
      x: 100,
      y: 100,
    },
    {
      id: "c",
      data: {
        id: "c",
      },
      x: 200,
      y: 100,
    },
    {
      id: "d",
      data: {
        id: "d",
      },
      x: 0,
      y: 200,
    },
    {
      id: "e",
      data: {
        id: "e",
      },
      x: 100,
      y: 200,
    },
    {
      id: "f",
      data: {
        id: "f",
      },
      x: 200,
      y: 200,
    },
  ] as unknown as RenderedNode[];

  const renderedEdges = [
    {
      data: { source: "a", target: "b" },
    },
    {
      data: { source: "a", target: "c" },
    },
    {
      data: { source: "b", target: "d" },
    },
    {
      data: { source: "b", target: "e" },
    },
    {
      data: { source: "b", target: "f" },
    },
  ] as RenderedEdge[];

  test("delete node", () => {
    const action = handleKeyboard(
      new KeyboardEvent("keydown", { key: "Backspace" }),
      {
        renderedNodes,
        renderedEdges,
        activeTarget: {
          type: "node",
          nodeId: "a",
        },
      }
    );
    expect(action).toEqual({
      action: "delete-node",
      node: { id: "a" },
    });
  });

  test("delete edge", () => {
    const action = handleKeyboard(
      new KeyboardEvent("keydown", { key: "Backspace" }),
      {
        renderedNodes,
        renderedEdges,
        activeTarget: {
          type: "edge",
          edge: { source: "a", target: "b" },
        },
      }
    );
    expect(action).toEqual({
      action: "delete-edge",
      edge: { source: "a", target: "b" },
    });
  });

  test.each<
    [activeNodeId: string, key: string, resultNodeId: string | undefined]
  >([
    ["a", "ArrowDown", "b"],
    ["b", "ArrowRight", "c"],
    ["b", "ArrowUp", "a"],
    ["c", "ArrowUp", "a"],
    ["c", "ArrowDown", undefined],
    ["b", "ArrowDown", "e"],
    ["f", "ArrowUp", "b"],
    ["f", "ArrowLeft", "e"],
  ])("switch active node", (activeNodeId, key, resultNodeId) => {
    const action = handleKeyboard(new KeyboardEvent("keydown", { key }), {
      renderedNodes,
      renderedEdges,
      activeTarget: {
        type: "node",
        nodeId: activeNodeId,
      },
    });
    expect(action).toEqual({
      action: "switch-active-node",
      node: resultNodeId ? { id: resultNodeId } : undefined,
    });
  });

  test("node actions but with active edge", () => {
    const action = handleKeyboard(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
      {
        renderedNodes,
        renderedEdges,
        activeTarget: {
          type: "edge",
          edge: { source: "a", target: "b" },
        },
      }
    );
    expect(action).toBe(undefined);
  });

  test("no active node", () => {
    const action = handleKeyboard(
      new KeyboardEvent("keydown", { key: "Backspace" }),
      {
        renderedNodes,
        renderedEdges,
        activeTarget: undefined,
      }
    );
    expect(action).toBe(undefined);
  });

  test("unknown key", () => {
    const action = handleKeyboard(
      new KeyboardEvent("keydown", { key: "Escape" }),
      {
        renderedNodes,
        renderedEdges,
        activeTarget: {
          type: "node",
          nodeId: "a",
        },
      }
    );
    expect(action).toBe(undefined);
  });
});
