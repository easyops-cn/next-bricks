import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/dom";
import "./";
import type { EoDrawCanvas } from "./index.js";
import type { NodeBrickCell } from "./interfaces";
import * as _handleMouseDown from "./processors/handleMouseDown";

jest.mock("@next-core/theme", () => ({}));
jest.mock("d3-drag");

const handleMouseDown = jest.spyOn(_handleMouseDown, "handleMouseDown");

document.elementsFromPoint = jest.fn(() => []);

const lockBodyScroll = jest.fn();
customElements.define(
  "basic.lock-body-scroll",
  class extends HTMLElement {
    resolve = lockBodyScroll;
  }
);

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
    expect(element.shadowRoot?.childNodes.length).toBe(0);
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
            x: 20,
            y: 20,
          },
        },
        {
          data: {},
          id: "add-2",
          type: "node",
          view: {
            height: 20,
            width: 20,
            x: 20,
            y: 240,
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
            x: 20,
            y: 20,
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
            x: 20,
            y: 60,
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
    element.defaultEdgeLines = [
      { if: "<% DATA.edge.data?.virtual %>", dashed: true },
    ];
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
      "text",
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
      "text",
    ]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("active target", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
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

    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector(".cells")!);
    });
    expect(onActiveTargetChange).toHaveBeenCalledTimes(2);
    expect(onActiveTargetChange).toHaveBeenNthCalledWith(2, null);

    act(() => {
      document.body.removeChild(element);
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
        decorator: "area",
        position: [800, 600],
      });
      expect(dropResult2).toEqual({
        type: "decorator",
        decorator: "area",
        id: expect.any(String),
        view: {
          x: 620,
          y: 480,
          width: 100,
          height: 60,
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
              height="20"
              style="overflow: visible;"
              width="20"
            >
              <div>
                a
              </div>
            </foreignobject>
          </g>
        </g>,
      ]
    `);

    act(() => {
      element.updateCells([
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

    if (element.shadowRoot?.querySelectorAll("div").length === 1) {
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
                height="20"
                style="overflow: visible;"
                width="20"
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
                height="20"
                style="overflow: visible;"
                width="20"
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
              height="20"
              style="overflow: visible;"
              width="20"
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
              height="20"
              style="overflow: visible;"
              width="20"
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
              y: 70,
            },
          },
        ],
      });
    });

    act(() => {
      document.body.removeChild(element);
    });
  });
});
