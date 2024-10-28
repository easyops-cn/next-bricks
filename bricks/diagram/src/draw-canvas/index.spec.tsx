import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import ResizeObserver from "resize-observer-polyfill";
import "./";
import type { EoDrawCanvas } from "./index.js";
import type { Cell, NodeBrickCell } from "./interfaces";
import * as _handleMouseDown from "./processors/handleMouseDown";

jest.mock("@next-core/theme", () => ({}));
jest.mock("d3-drag");
jest.mock("resize-observer-polyfill");

const handleMouseDown = jest.spyOn(_handleMouseDown, "handleMouseDown");

document.elementsFromPoint = jest.fn(() => []);

const lockBodyScroll = jest.fn();
customElements.define(
  "basic.lock-body-scroll",
  class extends HTMLElement {
    resolve = lockBodyScroll;
  }
);

let observerCallback: ResizeObserverCallback | undefined;

(ResizeObserver as jest.Mock).mockImplementation(function (
  callback: ResizeObserverCallback
) {
  observerCallback = callback;
  return {
    observe: jest.fn(),
    disconnect: jest.fn(),
  };
} as any);

describe("eo-draw-canvas", () => {
  test("drop node", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.cells = [
      {
        type: "decorator",
        decorator: "text",
        id: "text-1",
        view: {
          x: 150,
          y: 160,
        },
      } as any,
    ];

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    element.getBoundingClientRect = jest.fn(() => ({
      left: 180,
      top: 120,
    })) as any;

    await act(async () => {
      const dropResult1 = await element.dropNode({
        id: "test",
        position: [800, 600],
        size: [100, 200],
        data: {},
        useBrick: { brick: "div" },
      });
      expect(dropResult1).toBe(null);
    });

    const originalElementsFromPoint = document.elementsFromPoint;
    document.elementsFromPoint = jest.fn(() => [element]);
    await act(async () => {
      const dropResult2 = await element.dropNode({
        id: "test",
        position: [800, 600],
        data: {},
        useBrick: { brick: "div" },
      });
      expect(dropResult2).toEqual({
        type: "node",
        id: "test",
        data: {},
        useBrick: {
          brick: "div",
        },
        view: {
          x: 620,
          y: 480,
          width: 20,
          height: 20,
        },
      });
    });
    document.elementsFromPoint = originalElementsFromPoint;

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("drop node with force layout", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.cells = [
      {
        type: "decorator",
        decorator: "text",
        id: "text-1",
        view: {
          x: 150,
          y: 160,
        },
      } as any,
    ];
    element.layout = "force";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    element.getBoundingClientRect = jest.fn(() => ({
      left: 180,
      top: 120,
    })) as any;

    await act(async () => {
      const dropResult1 = await element.dropNode({
        id: "test",
        position: [800, 600],
        size: [100, 200],
        data: {},
        useBrick: { brick: "div" },
      });
      expect(dropResult1).toBe(null);
    });

    const originalElementsFromPoint = document.elementsFromPoint;
    document.elementsFromPoint = jest.fn(() => [element]);
    await act(async () => {
      const dropResult2 = await element.dropNode({
        id: "test",
        position: [800, 600],
        data: {},
        useBrick: { brick: "div" },
      });
      expect(dropResult2).toEqual({
        type: "node",
        id: "test",
        data: {},
        useBrick: {
          brick: "div",
        },
        view: {
          width: 20,
          height: 20,
        },
      });
    });
    document.elementsFromPoint = originalElementsFromPoint;

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    act(() => {
      observerCallback?.([], null!);
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("add nodes", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
    element.cells = [
      {
        type: "decorator",
        decorator: "text",
        id: "text-1",
        view: {
          x: 150,
          y: 160,
        },
      } as any,
    ];

    act(() => {
      document.body.appendChild(element);
    });

    await act(async () => {
      const result = await element.addNodes([]);
      expect(result).toEqual([]);
    });

    await act(async () => {
      const result = await element.addNodes([
        {
          id: "add-1",
          size: [100, 200],
          data: {},
        },
        {
          id: "add-2",
          data: {},
        },
      ]);
      expect(result).toEqual([
        {
          data: {},
          id: "add-1",
          type: "node",
          view: {
            height: 200,
            width: 100,
            x: 50,
            y: 100,
          },
        },
        {
          data: {},
          id: "add-2",
          type: "node",
          view: {
            height: 20,
            width: 20,
            x: 160,
            y: 100,
          },
        },
      ]);
    });

    // Test when the first node has no size
    await act(async () => {
      const result = await element.addNodes([
        {
          id: "add-3",
          data: {},
          useBrick: { brick: "div" },
        },
        {
          id: "add-4",
          size: [100, 200],
          data: {},
          useBrick: { brick: "div" },
        },
      ]);
      expect(result).toEqual([
        {
          data: {},
          id: "add-3",
          type: "node",
          useBrick: {
            brick: "div",
          },
          view: {
            height: 20,
            width: 20,
            x: expect.closeTo(73.7, 1),
            y: expect.closeTo(-60.2, 1),
          },
        },
        {
          data: {},
          id: "add-4",
          type: "node",
          useBrick: {
            brick: "div",
          },
          view: {
            height: 200,
            width: 100,
            x: expect.closeTo(-73.1, 1),
            y: expect.closeTo(-128.5, 1),
          },
        },
      ]);
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("add edge", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeSize = [180, 120];
    element.defaultEdgeLines = `<%
      [
        {
          if: DATA.edge.data?.virtual,
          dashed: true
        }
      ]
    %>` as any;
    element.cells = [
      {
        // This edge will be ignored since source node is not found
        type: "edge",
        source: "oops",
        target: "x",
      },
      {
        type: "node",
        id: "x",
        view: {
          x: 20,
          y: 20,
        },
        useBrick: { brick: "div" },
      },
      {
        type: "node",
        id: "y",
        view: {
          x: 20,
          y: 320,
        },
        useBrick: { brick: "div" },
      },
      {
        type: "node",
        id: "z",
        view: {
          x: 320,
          y: 320,
        },
        useBrick: { brick: "div" },
      },
      {
        type: "decorator",
        decorator: "text",
        id: "text-1",
        view: {
          x: 150,
          y: 160,
        },
      },
    ] as NodeBrickCell[];

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelectorAll(".line").length).toBe(0);

    await act(async () => {
      const result = await element.addEdge({
        source: "x",
        target: "y",
      });
      expect(result).toEqual({
        type: "edge",
        source: "x",
        target: "y",
      });
    });

    const getCellTagNames = () =>
      [...element.shadowRoot!.querySelectorAll(".cell > *")].map((node) =>
        (node as Element).tagName.toLowerCase()
      );

    expect(
      element.shadowRoot
        ?.querySelectorAll(".line")[0]
        .classList.contains("dashed")
    ).toBe(false);

    // Edges are adding to just next to the previous last edge,
    // If no previous edge, add to the start.
    expect(getCellTagNames()).toEqual([
      "path",
      "path",
      "path",
      "foreignobject",
      "foreignobject",
      "foreignobject",
      "foreignobject",
    ]);

    await act(async () => {
      const result = await element.addEdge({
        source: "x",
        target: "z",
        data: {
          virtual: true,
        },
      });
      expect(result).toEqual({
        type: "edge",
        source: "x",
        target: "z",
        data: {
          virtual: true,
        },
      });
    });

    expect(
      element.shadowRoot
        ?.querySelectorAll(".line")[1]
        .classList.contains("dashed")
    ).toBe(true);

    expect(getCellTagNames()).toEqual([
      "path",
      "path",
      "path",
      "path",
      "path",
      "path",
      "foreignobject",
      "foreignobject",
      "foreignobject",
      "foreignobject",
    ]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("active target", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
    element.fadeUnrelatedCells = true;
    element.doNotResetActiveTargetForSelector = "#omit-target";
    element.cells = [
      {
        type: "decorator",
        decorator: "area",
        id: "area-1",
        view: {
          x: 10,
          y: 10,
        },
      },
      {
        type: "node",
        id: "a",
        view: {
          x: 20,
          y: 20,
        },
      },
      {
        type: "node",
        id: "b",
        view: {
          x: 20,
          y: 320,
        },
      },
      {
        type: "decorator",
        decorator: "text",
        id: "text-1",
        view: {
          x: 150,
          y: 160,
        },
      },
    ] as NodeBrickCell[];

    const onActiveTargetChange = jest.fn();
    element.addEventListener("activeTarget.change", (e) =>
      onActiveTargetChange((e as CustomEvent).detail)
    );
    const onCellDelete = jest.fn();
    element.addEventListener("cell.delete", (e) =>
      onCellDelete((e as CustomEvent).detail)
    );

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    act(() => {
      fireEvent.mouseDown(element.shadowRoot!.querySelector(".cells div")!);
    });
    expect(handleMouseDown).toBeCalled();

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    expect(onActiveTargetChange).toHaveBeenCalledWith({
      type: "node",
      id: "a",
    });
    expect(
      [...element.shadowRoot!.querySelectorAll(".cells .cell")].map((cell) =>
        cell.classList.contains("faded")
      )
    ).toEqual([true, false, true, true]);

    // Set active target to the same node
    element.activeTarget = { type: "node", id: "a" };
    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    expect(onActiveTargetChange).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(element.shadowRoot!.querySelector("svg")!, {
      key: "Backspace",
    });
    expect(onCellDelete).toBeCalledWith({
      type: "node",
      id: "a",
      view: { x: 20, y: 20, width: 20, height: 20 },
    });

    const omitTarget = document.createElement("div");
    omitTarget.id = "omit-target";
    document.body.appendChild(omitTarget);
    act(() => {
      fireEvent.click(omitTarget);
    });
    expect(onActiveTargetChange).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector("svg")!);
    });
    expect(onActiveTargetChange).toHaveBeenCalledTimes(2);
    expect(onActiveTargetChange).toHaveBeenNthCalledWith(2, null);

    act(() => {
      document.body.removeChild(element);
      document.body.removeChild(omitTarget);
    });
  });

  test("drop decorator", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;

    act(() => {
      document.body.appendChild(element);
    });

    element.getBoundingClientRect = jest.fn(() => ({
      left: 180,
      top: 120,
    })) as any;

    await act(async () => {
      const dropResult1 = await element.dropDecorator({
        decorator: "area",
        position: [800, 600],
      });
      expect(dropResult1).toBe(null);
    });

    const originalElementsFromPoint = document.elementsFromPoint;
    document.elementsFromPoint = jest.fn(() => [element]);
    await act(async () => {
      const dropResult2 = await element.dropDecorator({
        decorator: "text",
        position: [800, 600],
        text: "Hello",
      });
      expect(dropResult2).toEqual({
        type: "decorator",
        decorator: "text",
        id: expect.any(String),
        view: {
          x: 620,
          y: 480,
          width: 180,
          height: 120,
          text: "Hello",
          direction: undefined,
        },
      });
    });
    await act(async () => {
      const dropResult3 = await element.dropDecorator({
        decorator: "container",
        position: [800, 600],
        text: "上层服务",
      });
      expect(dropResult3).toEqual({
        type: "decorator",
        decorator: "container",
        id: expect.any(String),
        view: {
          x: 620,
          y: 480,
          width: 180,
          height: 120,
          text: "上层服务",
          direction: undefined,
        },
      });
    });
    document.elementsFromPoint = originalElementsFromPoint;

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("context menu", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
    element.cells = [
      {
        type: "node",
        id: "a",
        view: {
          x: 20,
          y: 20,
        },
      },
      {
        type: "node",
        id: "b",
        view: {
          x: 20,
          y: 320,
        },
      },
    ] as NodeBrickCell[];

    const onActiveTargetChange = jest.fn();
    element.addEventListener("activeTarget.change", (e) =>
      onActiveTargetChange((e as CustomEvent).detail)
    );
    const onCellContextMenu = jest.fn();
    element.addEventListener("cell.contextmenu", (e) =>
      onCellContextMenu((e as CustomEvent).detail)
    );

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    act(() => {
      fireEvent.contextMenu(element.shadowRoot!.querySelector(".cell")!, {
        clientX: 100,
        clientY: 200,
      });
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    expect(onActiveTargetChange).toHaveBeenCalledWith({
      type: "node",
      id: "a",
    });

    expect(onCellContextMenu).toHaveBeenCalledWith({
      cell: {
        type: "node",
        id: "a",
        view: { x: 20, y: 20, width: 20, height: 20 },
      },
      clientX: 100,
      clientY: 200,
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("manually connect nodes", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
    element.defaultNodeSize = [20, 20];
    element.cells = [
      {
        type: "node",
        id: "a",
        view: {
          x: 20,
          y: 20,
        },
      },
      {
        type: "node",
        id: "b",
        view: {
          x: 20,
          y: 320,
        },
      },
    ];

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    // Case 1: Connect from an unknown node
    expect(() => element.manuallyConnectNodes("x")).rejects.toBe(null);

    // Case 2: Click on outside of any nodes
    let promiseWillFail: Promise<unknown> | undefined;
    act(() => {
      promiseWillFail = element.manuallyConnectNodes("a");
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    act(() => {
      fireEvent.click(document, { clientX: 15, clientY: 325 });
    });

    expect(promiseWillFail).rejects.toBe(null);

    // Case 3: successful connection
    let promise: Promise<unknown> | undefined;
    act(() => {
      promise = element.manuallyConnectNodes("a");
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    act(() => {
      fireEvent.click(document, { clientX: 25, clientY: 325 });
    });

    const result = await promise;

    expect(result).toMatchObject({
      source: expect.objectContaining({
        id: "a",
      }),
      target: expect.objectContaining({
        id: "b",
      }),
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("update cells", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeBricks = [
      {
        useBrick: {
          brick: "div",
          properties: { textContent: "<% DATA.node.id %>" },
        },
      },
    ];
    element.defaultNodeSize = [20, 20];
    element.cells = [
      {
        type: "node",
        id: "a",
        view: {
          x: 20,
          y: 20,
        },
      },
    ];

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    expect(element.shadowRoot?.querySelectorAll(".cells"))
      .toMatchInlineSnapshot(`
      NodeList [
        <g
          class="cells"
        >
          <g
            class="cell"
            transform="translate(20 20)"
          >
            <foreignobject
              class="node"
              height="9999"
              width="9999"
            >
              <div>
                a
              </div>
            </foreignobject>
          </g>
        </g>,
      ]
    `);

    await act(async () => {
      await element.updateCells([
        {
          type: "node",
          id: "a",
          view: {
            x: 20,
            y: 20,
          },
        },
        {
          type: "node",
          id: "b",
          view: {
            x: 20,
            y: 320,
          },
        },
      ]);
    });

    if (element.shadowRoot?.querySelectorAll("svg div").length === 1) {
      expect(element.shadowRoot?.querySelectorAll(".cells"))
        .toMatchInlineSnapshot(`
        NodeList [
          <g
            class="cells"
          >
            <g
              class="cell"
              transform="translate(20 20)"
            >
              <foreignobject
                class="node"
                height="9999"
                width="9999"
              >
                <div>
                  a
                </div>
              </foreignobject>
            </g>
            <g
              class="cell"
              transform="translate(20 320)"
            >
              <foreignobject
                class="node"
                height="9999"
                width="9999"
              />
            </g>
          </g>,
        ]
      `);

      await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    }

    expect(element.shadowRoot?.querySelectorAll(".cells"))
      .toMatchInlineSnapshot(`
      NodeList [
        <g
          class="cells"
        >
          <g
            class="cell"
            transform="translate(20 20)"
          >
            <foreignobject
              class="node"
              height="9999"
              width="9999"
            >
              <div>
                a
              </div>
            </foreignobject>
          </g>
          <g
            class="cell"
            transform="translate(20 320)"
          >
            <foreignobject
              class="node"
              height="9999"
              width="9999"
            >
              <div>
                b
              </div>
            </foreignobject>
          </g>
        </g>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("update cells", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
    element.cells = [
      {
        type: "node",
        id: "x",
        view: {
          x: 20,
          y: 30,
        },
      },
    ];

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    await act(async () => {
      const result = await element.updateCells(
        [
          {
            type: "edge",
            source: "x",
            target: "y",
          },
          {
            type: "node",
            id: "x",
            view: {
              x: 20,
              y: 30,
            },
          },
          {
            type: "node",
            id: "y",
          },
        ],
        { reason: "add-related-nodes", parent: "x" }
      );
      expect(result).toEqual({
        updated: [
          {
            type: "node",
            id: "y",
            view: {
              height: 20,
              width: 20,
              x: 20,
              y: 100,
            },
          },
        ],
      });
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("edit decorator text", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.cells = [
      {
        type: "decorator",
        decorator: "text",
        id: "x",
        view: {
          x: 20,
          y: 30,
        },
      } as Cell,
    ];

    const onDecoratorTextChange = jest.fn();
    element.addEventListener("decorator.text.change", (e) =>
      onDecoratorTextChange((e as CustomEvent).detail)
    );

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    act(() => {
      fireEvent.doubleClick(
        element.shadowRoot!.querySelector(".decorator-text .text-container")!
      );
    });

    element.shadowRoot!.querySelector(".decorator-text .text")!.textContent =
      "Updated";
    act(() => {
      fireEvent.input(
        element.shadowRoot!.querySelector(".decorator-text .text")!
      );
    });
    act(() => {
      fireEvent.blur(
        element.shadowRoot!.querySelector(".decorator-text .text")!
      );
    });
    expect(onDecoratorTextChange).toHaveBeenCalledWith({
      id: "x",
      view: { x: 20, y: 30, height: 0, width: 0, text: "Updated" },
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("edit decorator container", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.cells = [
      {
        type: "decorator",
        decorator: "container",
        id: "container-1",
        view: {
          x: 50,
          y: 400,
          width: 280,
          height: 120,
          text: "上层服务",
        },
      } as Cell,
      {
        type: "decorator",
        decorator: "container",
        id: "container-2",
        view: {
          x: 50,
          y: 400,
          width: 80,
          height: 60,
          direction: "right",
          text: "上游系统",
        },
      } as Cell,
      {
        type: "decorator",
        decorator: "container",
        id: "container-3",
        view: {
          x: 50,
          y: 400,
          width: 80,
          height: 60,
          direction: "bottom",
          text: "中台层",
        },
      } as Cell,
      {
        type: "decorator",
        decorator: "container",
        id: "container-4",
        view: {
          x: 500,
          y: 200,
          width: 380,
          height: 120,
          direction: "left",
          text: "接入层",
        },
      } as Cell,
    ];

    const onDecoratorTextChange = jest.fn();
    element.addEventListener("decorator.text.change", (e) =>
      onDecoratorTextChange((e as CustomEvent).detail)
    );

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    act(() => {
      fireEvent.doubleClick(
        element.shadowRoot!.querySelector(
          ".decorator-container .text-container"
        )!
      );
    });

    element.shadowRoot!.querySelector(
      ".decorator-container .text"
    )!.textContent = "Updated";
    act(() => {
      fireEvent.input(
        element.shadowRoot!.querySelector(".decorator-container .text")!
      );
    });
    act(() => {
      fireEvent.blur(
        element.shadowRoot!.querySelector(".decorator-container .text")!
      );
    });
    expect(onDecoratorTextChange).toHaveBeenCalledWith({
      id: "container-1",
      view: {
        x: 50,
        y: 400,
        width: 280,
        height: 120,
        text: "Updated",
      },
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("zoom bar", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
    element.cells = [
      {
        type: "node",
        id: "a",
        view: {
          x: 20,
          y: 20,
        },
      },
    ] as NodeBrickCell[];

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    // Zoom in
    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector(".zoom-button")!);
    });

    // Zoom out
    act(() => {
      fireEvent.click(element.shadowRoot!.querySelectorAll(".zoom-button")[1]);
    });

    // Re-center
    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector(".center-button")!);
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("degraded diagram", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "strong" } }];
    element.degradedThreshold = 50;
    element.cells = new Array(40).fill(null).map((_, i) => ({
      type: "node",
      id: `node-${i}`,
      view: {
        x: 20 + (i % 20) * 20,
        y: 20 + Math.floor(i / 20) * 20,
        width: 16,
        height: 16,
      },
    }));
    element.lineConnector = true;

    act(() => {
      document.body.appendChild(element);
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    expect(element.shadowRoot?.querySelectorAll(".degraded").length).toBe(0);
    expect(element.shadowRoot?.querySelectorAll("strong").length).toBe(40);

    act(() => {
      fireEvent.mouseEnter(element.shadowRoot!.querySelector(".cell")!);
    });
    act(() => {
      fireEvent.mouseLeave(element.shadowRoot!.querySelector(".cell")!);
    });

    await act(async () => {
      await element.addNodes(
        new Array(10).fill(null).map((_, i) => ({
          type: "node",
          id: `node-${i + 40}`,
        }))
      );
    });

    expect(element.shadowRoot?.querySelectorAll(".degraded").length).toBe(50);
    expect(element.shadowRoot?.querySelectorAll("strong").length).toBe(0);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
