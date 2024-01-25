import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import type { EoDiagram } from "./index.js";
import * as _handleNodesMouseDown from "./processors/handleNodesMouseDown";

jest.mock("@next-core/theme", () => ({}));
jest.mock("d3-drag");
jest.mock(
  "resize-observer-polyfill",
  () =>
    class {
      #callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.#callback = callback;
      }
      disconnect() {}
      observe() {
        (this.#callback as () => void)();
      }
      unobserve() {}
    }
);
const handleNodesMouseDown = jest.spyOn(
  _handleNodesMouseDown,
  "handleNodesMouseDown"
);

describe("eo-diagram", () => {
  test("empty nodes", async () => {
    const element = document.createElement("eo-diagram") as EoDiagram;
    element.layout = "dagre";
    element.nodes = [];
    element.edges = [];

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <div
          class="diagram pannable"
          tabindex="-1"
        >
          <svg
            class="lines"
            height="100%"
            width="100%"
          >
            <defs>
              <marker
                id="diagram-1-active-line-start"
                markerHeight="8"
                markerWidth="8"
                orient="auto"
                refX="4"
                refY="4"
                viewBox="0 0 8 8"
              >
                <path
                  d="M 0.5 0.5 H 7.5 V 7.5 H 0.5 Z"
                  fill="var(--palette-gray-1)"
                  stroke="var(--palette-gray-7)"
                  stroke-width="1"
                />
              </marker>
              <marker
                id="diagram-1-active-line-end"
                markerHeight="8"
                markerWidth="14"
                orient="auto"
                refX="3"
                refY="4"
                viewBox="0 0 14 8"
              >
                <path
                  d="M 0.5 1.5 L 5.5 4 L 0.5 6.5 z"
                  fill="var(--palette-blue-3)"
                  stroke="var(--palette-blue-3)"
                  stroke-width="1"
                />
                <path
                  d="M 6.5 0.5 H 13.5 V 7.5 H 6.5 Z"
                  fill="var(--palette-gray-1)"
                  stroke="var(--palette-gray-7)"
                  stroke-width="1"
                />
              </marker>
            </defs>
            <g
              transform="translate(0 0) scale(1)"
            />
          </svg>
          <div
            class="line-labels ready"
            style="left: 0px; top: 0px; transform: scale(1);"
          />
          <div
            class="nodes"
            style="left: 0px; top: 0px; transform: scale(1);"
          />
          <svg
            class="connect-line"
            height="100%"
            width="100%"
          >
            <defs>
              <marker
                id="diagram-1-line-arrow-connect-line"
                markerHeight="6"
                markerWidth="6"
                orient="auto"
                refX="3"
                refY="3"
                viewBox="0 0 6 6"
              >
                <path
                  d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                  stroke-width="1"
                />
              </marker>
            </defs>
            <path
              d=""
              fill="none"
            />
          </svg>
        </div>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("basic usage", async () => {
    const element = document.createElement("eo-diagram") as EoDiagram;
    element.layout = "dagre";
    element.nodes = [{ id: "a" }, { id: "b" }, { id: "c" }];
    element.edges = [
      { source: "a", target: "b", type: "menu" },
      { source: "a", target: "c", type: "link", description: "Go" },
    ];
    element.lines = [
      { edgeType: "menu", strokeColor: "gray" },
      {
        edgeType: "link",
        arrow: true,
        strokeColor: "blue",
        text: "<% DATA.edge.description ? {content: DATA.edge.description} : null %>" as any,
      },
    ];
    element.nodeBricks = [
      {
        useBrick: {
          brick: "span",
          properties: { textContent: "<% DATA.node.id %>" },
        },
      },
    ];
    element.activeTarget = { type: "node", nodeId: "b" };
    element.connectNodes = {};
    const onNodeDelete = jest.fn();
    element.addEventListener("node.delete", (e) =>
      onNodeDelete((e as CustomEvent).detail)
    );
    const onEdgeDelete = jest.fn();
    element.addEventListener("edge.delete", (e) =>
      onEdgeDelete((e as CustomEvent).detail)
    );
    const onActiveTargetChange = jest.fn();
    element.addEventListener("activeTarget.change", (e) =>
      onActiveTargetChange((e as CustomEvent).detail)
    );

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelectorAll(".node").length).toBe(3);
    expect(element.shadowRoot?.childNodes[1]).toMatchInlineSnapshot(`
      <div
        class="diagram pannable"
        tabindex="-1"
      >
        <svg
          class="lines"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="diagram-4-line-arrow-0"
              markerHeight="6"
              markerWidth="6"
              orient="auto"
              refX="3"
              refY="3"
              viewBox="0 0 6 6"
            >
              <path
                d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                fill="blue"
                stroke="blue"
                stroke-width="1"
              />
            </marker>
            <marker
              id="diagram-4-active-line-start"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="4"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path
                d="M 0.5 0.5 H 7.5 V 7.5 H 0.5 Z"
                fill="var(--palette-gray-1)"
                stroke="var(--palette-gray-7)"
                stroke-width="1"
              />
            </marker>
            <marker
              id="diagram-4-active-line-end"
              markerHeight="8"
              markerWidth="14"
              orient="auto"
              refX="3"
              refY="4"
              viewBox="0 0 14 8"
            >
              <path
                d="M 0.5 1.5 L 5.5 4 L 0.5 6.5 z"
                fill="var(--palette-blue-3)"
                stroke="var(--palette-blue-3)"
                stroke-width="1"
              />
              <path
                d="M 6.5 0.5 H 13.5 V 7.5 H 6.5 Z"
                fill="var(--palette-gray-1)"
                stroke="var(--palette-gray-7)"
                stroke-width="1"
              />
            </marker>
          </defs>
          <g
            transform="translate(0 0) scale(1)"
          />
        </svg>
        <div
          class="line-labels ready"
          style="left: 0px; top: 0px; transform: scale(1);"
        >
          <div
            class="line-label"
          >
            Go
          </div>
        </div>
        <div
          class="nodes"
          style="left: 0px; top: 0px; transform: scale(1);"
        >
          <div
            class="node"
          />
          <div
            class="node"
          />
          <div
            class="node"
          />
        </div>
        <svg
          class="connect-line"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="diagram-4-line-arrow-connect-line"
              markerHeight="6"
              markerWidth="6"
              orient="auto"
              refX="3"
              refY="3"
              viewBox="0 0 6 6"
            >
              <path
                d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                stroke-width="1"
              />
            </marker>
          </defs>
          <path
            d=""
            fill="none"
          />
        </svg>
      </div>
    `);

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    // It maybe advanced to `ready` earlier than expected
    if (!element.shadowRoot?.children[1]?.classList.contains("ready")) {
      expect(element.shadowRoot?.children[1]).toMatchInlineSnapshot(`
        <div
          class="diagram pannable"
          tabindex="-1"
        >
          <svg
            class="lines"
            height="100%"
            width="100%"
          >
            <defs>
              <marker
                id="diagram-4-line-arrow-0"
                markerHeight="6"
                markerWidth="6"
                orient="auto"
                refX="3"
                refY="3"
                viewBox="0 0 6 6"
              >
                <path
                  d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                  fill="blue"
                  stroke="blue"
                  stroke-width="1"
                />
              </marker>
              <marker
                id="diagram-4-active-line-start"
                markerHeight="8"
                markerWidth="8"
                orient="auto"
                refX="4"
                refY="4"
                viewBox="0 0 8 8"
              >
                <path
                  d="M 0.5 0.5 H 7.5 V 7.5 H 0.5 Z"
                  fill="var(--palette-gray-1)"
                  stroke="var(--palette-gray-7)"
                  stroke-width="1"
                />
              </marker>
              <marker
                id="diagram-4-active-line-end"
                markerHeight="8"
                markerWidth="14"
                orient="auto"
                refX="3"
                refY="4"
                viewBox="0 0 14 8"
              >
                <path
                  d="M 0.5 1.5 L 5.5 4 L 0.5 6.5 z"
                  fill="var(--palette-blue-3)"
                  stroke="var(--palette-blue-3)"
                  stroke-width="1"
                />
                <path
                  d="M 6.5 0.5 H 13.5 V 7.5 H 6.5 Z"
                  fill="var(--palette-gray-1)"
                  stroke="var(--palette-gray-7)"
                  stroke-width="1"
                />
              </marker>
            </defs>
            <g
              transform="translate(0 0) scale(1)"
            />
          </svg>
          <div
            class="line-labels ready"
            style="left: 0px; top: 0px; transform: scale(1);"
          >
            <div
              class="line-label"
            >
              Go
            </div>
          </div>
          <div
            class="nodes"
            style="left: 0px; top: 0px; transform: scale(1);"
          >
            <div
              class="node"
            >
              <span>
                a
              </span>
            </div>
            <div
              class="node"
            >
              <span>
                b
              </span>
            </div>
            <div
              class="node"
            >
              <span>
                c
              </span>
            </div>
          </div>
          <svg
            class="connect-line"
            height="100%"
            width="100%"
          >
            <defs>
              <marker
                id="diagram-4-line-arrow-connect-line"
                markerHeight="6"
                markerWidth="6"
                orient="auto"
                refX="3"
                refY="3"
                viewBox="0 0 6 6"
              >
                <path
                  d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                  stroke-width="1"
                />
              </marker>
            </defs>
            <path
              d=""
              fill="none"
            />
          </svg>
        </div>
      `);

      await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    } else {
      expect(element.shadowRoot?.children[1]).toMatchInlineSnapshot(`
      <div
        class="diagram ready pannable"
        tabindex="-1"
      >
        <svg
          class="lines"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="diagram-4-line-arrow-0"
              markerHeight="6"
              markerWidth="6"
              orient="auto"
              refX="3"
              refY="3"
              viewBox="0 0 6 6"
            >
              <path
                d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                fill="blue"
                stroke="blue"
                stroke-width="1"
              />
            </marker>
            <clippath
              id="diagram-4-clip-path-line-3"
            >
              <polygon
                points="-3,3 3,3 3,-3 -3,-3 -3,-980 1310,-980 1310,1420 -990,1420 -990,-980 -3,-980"
              />
            </clippath>
            <marker
              id="diagram-4-active-line-start"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="4"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path
                d="M 0.5 0.5 H 7.5 V 7.5 H 0.5 Z"
                fill="var(--palette-gray-1)"
                stroke="var(--palette-gray-7)"
                stroke-width="1"
              />
            </marker>
            <marker
              id="diagram-4-active-line-end"
              markerHeight="8"
              markerWidth="14"
              orient="auto"
              refX="3"
              refY="4"
              viewBox="0 0 14 8"
            >
              <path
                d="M 0.5 1.5 L 5.5 4 L 0.5 6.5 z"
                fill="var(--palette-blue-3)"
                stroke="var(--palette-blue-3)"
                stroke-width="1"
              />
              <path
                d="M 6.5 0.5 H 13.5 V 7.5 H 6.5 Z"
                fill="var(--palette-gray-1)"
                stroke="var(--palette-gray-7)"
                stroke-width="1"
              />
            </marker>
          </defs>
          <g
            transform="translate(-12.5 -12.5) scale(0.5)"
          >
            <g
              class="line"
            >
              <path
                d="M25,0L20.833,4.167C16.667,8.333,8.333,16.667,4.167,NaNC0,NaN,0,NaN,0,NaNL0,NaN"
                fill="none"
                stroke="gray"
                stroke-width="1"
              />
              <path
                class="active-bg"
                d="M25,0L20.833,4.167C16.667,8.333,8.333,16.667,4.167,NaNC0,NaN,0,NaN,0,NaNL0,NaN"
                fill="none"
                marker-end="url(#diagram-4-active-line-end)"
                marker-start="url(#diagram-4-active-line-start)"
                stroke="var(--palette-blue-3)"
                stroke-width="1"
              />
            </g>
            <g
              class="line"
            >
              <path
                clip-path="url(#diagram-4-clip-path-line-3)"
                d="M25,0L29.167,4.167C33.333,8.333,41.667,16.667,NaN,NaNCNaN,NaN,NaN,NaN,NaN,NaNLNaN,NaN"
                fill="none"
                marker-end="url(#diagram-4-line-arrow-0)"
                stroke="blue"
                stroke-width="1"
              />
              <path
                class="active-bg"
                clip-path="url(#diagram-4-clip-path-line-3)"
                d="M25,0L29.167,4.167C33.333,8.333,41.667,16.667,NaN,NaNCNaN,NaN,NaN,NaN,NaN,NaNLNaN,NaN"
                fill="none"
                marker-end="url(#diagram-4-active-line-end)"
                marker-start="url(#diagram-4-active-line-start)"
                stroke="var(--palette-blue-3)"
                stroke-width="1"
              />
            </g>
          </g>
        </svg>
        <div
          class="line-labels ready"
          style="left: -12.5px; top: -12.5px; transform: scale(0.5);"
        >
          <div
            class="line-label"
            style="left: 50px; top: 50px; visibility: visible;"
          >
            Go
          </div>
        </div>
        <div
          class="nodes"
          style="left: -12.5px; top: -12.5px; transform: scale(0.5);"
        >
          <div
            class="node"
            style="left: 25px; top: 0px; visibility: visible;"
          >
            <span>
              a
            </span>
          </div>
          <div
            class="node"
            style="left: 0px; top: 50px; visibility: visible;"
          >
            <span>
              b
            </span>
          </div>
          <div
            class="node"
            style="left: 50px; top: 50px; visibility: visible;"
          >
            <span>
              c
            </span>
          </div>
        </div>
        <svg
          class="connect-line"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="diagram-4-line-arrow-connect-line"
              markerHeight="6"
              markerWidth="6"
              orient="auto"
              refX="3"
              refY="3"
              viewBox="0 0 6 6"
            >
              <path
                d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                stroke-width="1"
              />
            </marker>
          </defs>
          <path
            d=""
            fill="none"
          />
        </svg>
      </div>
      `);
    }

    fireEvent.mouseDown(element.shadowRoot!.querySelector(".nodes")!);
    expect(handleNodesMouseDown).toBeCalled();

    // `Enter` keydown is ignored
    fireEvent.keyDown(element.shadowRoot!.querySelector(".diagram")!, {
      key: "Enter",
    });
    expect(onNodeDelete).not.toBeCalled();
    expect(onActiveTargetChange).not.toBeCalled();

    fireEvent.keyDown(element.shadowRoot!.querySelector(".diagram")!, {
      key: "Backspace",
    });
    expect(onNodeDelete).toBeCalledWith({ id: "b" });

    fireEvent.keyDown(element.shadowRoot!.querySelector(".diagram")!, {
      key: "ArrowUp",
    });
    await act(() => (global as any).flushPromises());
    expect(onActiveTargetChange).toBeCalledWith({ type: "node", nodeId: "a" });

    const nodeA =
      element.shadowRoot!.querySelectorAll(".node")[0]!.firstElementChild!;
    act(() => {
      fireEvent.mouseDown(nodeA);
    });
    expect(onActiveTargetChange).toBeCalledTimes(1);
    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    act(() => {
      fireEvent.mouseUp(nodeA);
    });

    element.activeTarget = { type: "edge", edge: { source: "a", target: "b" } };
    await act(() => (global as any).flushPromises());
    fireEvent.keyDown(element.shadowRoot!.querySelector(".diagram")!, {
      key: "Delete",
    });
    expect(onActiveTargetChange).toHaveBeenNthCalledWith(2, {
      type: "edge",
      edge: { source: "a", target: "b" },
    });
    expect(onEdgeDelete).toBeCalledWith({ source: "a", target: "b" });

    element.activeTarget = null;
    await act(() => (global as any).flushPromises());
    expect(onActiveTargetChange).toHaveBeenNthCalledWith(3, null);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("with line label", async () => {
    const element = document.createElement("eo-diagram") as EoDiagram;
    element.layout = "dagre";
    element.nodes = [{ id: "a" }, { id: "b" }, { id: "c" }];
    element.edges = [
      { source: "a", target: "b", type: "menu" },
      { source: "a", target: "c", type: "link", description: "Go" },
    ];
    element.lines = [
      { edgeType: "menu", strokeColor: "gray" },
      {
        edgeType: "link",
        arrow: true,
        strokeColor: "blue",
        interactable: true,
        label: {
          if: "<% !!DATA.edge.description %>",
          useBrick: {
            brick: "div",
            properties: {
              textContent: "<% DATA.edge.description %>",
            },
          },
        },
      },
    ];
    element.pannable = false;
    const onLineClick = jest.fn();
    element.addEventListener("line.click", (e) =>
      onLineClick((e as CustomEvent).detail)
    );
    const onLineDoubleClick = jest.fn();
    element.addEventListener("line.dblclick", (e) =>
      onLineDoubleClick((e as CustomEvent).detail)
    );

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelectorAll(".node").length).toBe(3);

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    expect(element.shadowRoot?.childNodes[1]).toMatchInlineSnapshot(`
      <div
        class="diagram ready"
        tabindex="-1"
      >
        <svg
          class="lines"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="diagram-7-line-arrow-0"
              markerHeight="6"
              markerWidth="6"
              orient="auto"
              refX="3"
              refY="3"
              viewBox="0 0 6 6"
            >
              <path
                d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                fill="blue"
                stroke="blue"
                stroke-width="1"
              />
            </marker>
            <clippath
              id="diagram-7-clip-path-line-6"
            >
              <polygon
                points="-3,3 3,3 3,-3 -3,-3 -3,-980 1310,-980 1310,1420 -990,1420 -990,-980 -3,-980"
              />
            </clippath>
            <marker
              id="diagram-7-active-line-start"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="4"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path
                d="M 0.5 0.5 H 7.5 V 7.5 H 0.5 Z"
                fill="var(--palette-gray-1)"
                stroke="var(--palette-gray-7)"
                stroke-width="1"
              />
            </marker>
            <marker
              id="diagram-7-active-line-end"
              markerHeight="8"
              markerWidth="14"
              orient="auto"
              refX="3"
              refY="4"
              viewBox="0 0 14 8"
            >
              <path
                d="M 0.5 1.5 L 5.5 4 L 0.5 6.5 z"
                fill="var(--palette-blue-3)"
                stroke="var(--palette-blue-3)"
                stroke-width="1"
              />
              <path
                d="M 6.5 0.5 H 13.5 V 7.5 H 6.5 Z"
                fill="var(--palette-gray-1)"
                stroke="var(--palette-gray-7)"
                stroke-width="1"
              />
            </marker>
          </defs>
          <g
            transform="translate(-17.5 -17.5) scale(0.5)"
          >
            <g
              class="line"
            >
              <path
                d="M30,10L25.833,14.167C21.667,18.333,13.333,26.667,9.167,35C5,43.333,5,51.667,5,55.833L5,60"
                fill="none"
                stroke="gray"
                stroke-width="1"
              />
              <path
                class="active-bg"
                d="M30,10L25.833,14.167C21.667,18.333,13.333,26.667,9.167,35C5,43.333,5,51.667,5,55.833L5,60"
                fill="none"
                marker-end="url(#diagram-7-active-line-end)"
                marker-start="url(#diagram-7-active-line-start)"
                stroke="var(--palette-blue-3)"
                stroke-width="1"
              />
            </g>
            <g
              class="line interactable"
            >
              <path
                d="M40,10L44.167,14.167C48.333,18.333,56.667,26.667,60.833,34.167C65,41.667,65,48.333,65,51.667L65,55"
                fill="none"
                stroke="transparent"
                stroke-width="20"
              />
              <path
                clip-path="url(#diagram-7-clip-path-line-6)"
                d="M40,10L44.167,14.167C48.333,18.333,56.667,26.667,60.833,34.167C65,41.667,65,48.333,65,51.667L65,55"
                fill="none"
                marker-end="url(#diagram-7-line-arrow-0)"
                stroke="blue"
                stroke-width="1"
              />
              <path
                class="active-bg"
                clip-path="url(#diagram-7-clip-path-line-6)"
                d="M40,10L44.167,14.167C48.333,18.333,56.667,26.667,60.833,34.167C65,41.667,65,48.333,65,51.667L65,55"
                fill="none"
                marker-end="url(#diagram-7-active-line-end)"
                marker-start="url(#diagram-7-active-line-start)"
                stroke="var(--palette-blue-3)"
                stroke-width="1"
              />
            </g>
          </g>
        </svg>
        <div
          class="line-labels ready"
          style="left: -17.5px; top: -17.5px; transform: scale(0.5);"
        >
          <div
            class="line-label"
            style="left: 50px; top: 50px; visibility: visible;"
          >
            <div>
              Go
            </div>
          </div>
        </div>
        <div
          class="nodes"
          style="left: -17.5px; top: -17.5px; transform: scale(0.5);"
        >
          <div
            class="node"
          />
          <div
            class="node"
          />
          <div
            class="node"
          />
        </div>
        <svg
          class="connect-line"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="diagram-7-line-arrow-connect-line"
              markerHeight="6"
              markerWidth="6"
              orient="auto"
              refX="3"
              refY="3"
              viewBox="0 0 6 6"
            >
              <path
                d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                stroke-width="1"
              />
            </marker>
          </defs>
          <path
            d=""
            fill="none"
          />
        </svg>
      </div>
    `);

    fireEvent.click(element.shadowRoot!.querySelector(".line.interactable")!);
    expect(onLineClick).toBeCalledWith({
      id: "line-6",
      edge: expect.objectContaining({ source: "a", target: "c" }),
    });

    fireEvent.dblClick(
      element.shadowRoot!.querySelector(".line.interactable")!
    );
    expect(onLineDoubleClick).toBeCalledWith({
      id: "line-6",
      edge: expect.objectContaining({ source: "a", target: "c" }),
    });

    element.callOnLineLabel("line-6", "addEventListener", "click", jest.fn());

    element.zoomable = false;
    element.scrollable = false;
    await act(() => (global as any).flushPromises());

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("unknown layout", async () => {
    const element = document.createElement("eo-diagram") as EoDiagram;
    element.layout = "unknown" as any;

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes[1]).toMatchInlineSnapshot(`
      <div>
        Diagram layout not supported: "unknown"
      </div>
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
