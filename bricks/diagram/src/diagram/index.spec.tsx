import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import type { EoDiagram } from "./index.js";
import { handleDiagramMouseDown } from "./processors/handleDiagramMouseDown";

jest.mock("@next-core/theme", () => ({}));
jest.mock("./processors/handleDiagramMouseDown");

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
          class="diagram"
          tabindex="-1"
        >
          <div
            class="dragger"
          />
          <svg
            class="lines"
            height="100%"
            width="100%"
          >
            <defs />
            <g
              transform="translate(0 0) scale(1)"
            />
          </svg>
          <div
            class="line-labels"
            style="left: 0px; top: 0px;"
          />
          <div
            class="nodes"
            style="left: 0px; top: 0px;"
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
    element.activeNodeId = "b";
    const onNodeDelete = jest.fn();
    element.addEventListener("node.delete", (e) =>
      onNodeDelete((e as CustomEvent).detail)
    );
    const onActiveNodeChange = jest.fn();
    element.addEventListener("activeNode.change", (e) =>
      onActiveNodeChange((e as CustomEvent).detail)
    );

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelectorAll(".node").length).toBe(3);
    expect(element.shadowRoot?.childNodes[1]).toMatchInlineSnapshot(`
      <div
        class="diagram"
        tabindex="-1"
      >
        <div
          class="dragger"
        />
        <svg
          class="lines"
          height="100%"
          width="100%"
        >
          <defs />
          <g
            transform="translate(0 0) scale(1)"
          />
        </svg>
        <div
          class="line-labels"
          style="left: 0px; top: 0px;"
        />
        <div
          class="nodes"
          style="left: 0px; top: 0px;"
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
              id="diagram-2-line-arrow-connect-line"
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
    expect(element.shadowRoot?.childNodes[1]).toMatchInlineSnapshot(`
      <div
        class="diagram ready"
        tabindex="-1"
      >
        <div
          class="dragger"
        />
        <svg
          class="lines"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="diagram-2-line-arrow-0"
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
              id="diagram-2-clip-path-line-4"
            >
              <polygon
                points="-3,3 3,3 3,-3 -3,-3 -3,-980 1310,-980 1310,1420 -990,1420 -990,-980 -3,-980"
              />
            </clippath>
          </defs>
          <g
            transform="translate(-35 -35) scale(1)"
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
            </g>
            <g
              class="line"
            >
              <path
                clip-path="url(#diagram-2-clip-path-line-4)"
                d="M40,10L44.167,14.167C48.333,18.333,56.667,26.667,60.833,34.167C65,41.667,65,48.333,65,51.667L65,55"
                fill="none"
                marker-end="url(#diagram-2-line-arrow-0)"
                stroke="blue"
                stroke-width="1"
              />
            </g>
          </g>
        </svg>
        <div
          class="line-labels"
          style="left: -35px; top: -35px;"
        >
          <div
            class="line-label"
            style="left: 50px; top: 50px;"
          >
            Go
          </div>
        </div>
        <div
          class="nodes"
          style="left: -35px; top: -35px;"
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
              id="diagram-2-line-arrow-connect-line"
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

    fireEvent.mouseDown(element.shadowRoot!.querySelector(".diagram")!);
    expect(handleDiagramMouseDown).toBeCalled();

    // `Enter` keydown is ignored
    fireEvent.keyDown(element.shadowRoot!.querySelector(".diagram")!, {
      key: "Enter",
    });
    expect(onNodeDelete).not.toBeCalled();
    expect(onActiveNodeChange).not.toBeCalled();

    fireEvent.keyDown(element.shadowRoot!.querySelector(".diagram")!, {
      key: "Backspace",
    });
    expect(onNodeDelete).toBeCalledWith({ id: "b" });

    fireEvent.keyDown(element.shadowRoot!.querySelector(".diagram")!, {
      key: "ArrowUp",
    });
    await act(() => (global as any).flushPromises());
    expect(onActiveNodeChange).toBeCalledWith({ id: "a" });

    element.activeNodeId = undefined;
    await act(() => (global as any).flushPromises());
    expect(onActiveNodeChange).toBeCalledWith(null);

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
        <div
          class="dragger"
        />
        <svg
          class="lines"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="diagram-5-line-arrow-0"
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
              id="diagram-5-clip-path-line-7"
            >
              <polygon
                points="-3,3 3,3 3,-3 -3,-3 -3,-980 1310,-980 1310,1420 -990,1420 -990,-980 -3,-980"
              />
            </clippath>
          </defs>
          <g
            transform="translate(-35 -35) scale(1)"
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
            </g>
            <g
              class="line interactable"
            >
              <path
                clip-path="url(#diagram-5-clip-path-line-7)"
                d="M40,10L44.167,14.167C48.333,18.333,56.667,26.667,60.833,34.167C65,41.667,65,48.333,65,51.667L65,55"
                fill="none"
                marker-end="url(#diagram-5-line-arrow-0)"
                stroke="blue"
                stroke-width="1"
              />
              <path
                d="M40,10L44.167,14.167C48.333,18.333,56.667,26.667,60.833,34.167C65,41.667,65,48.333,65,51.667L65,55"
                fill="none"
                stroke="transparent"
                stroke-width="20"
              />
            </g>
          </g>
        </svg>
        <div
          class="line-labels"
          style="left: -35px; top: -35px;"
        >
          <div
            class="line-label"
            style="left: 50px; top: 50px;"
          >
            <div>
              Go
            </div>
          </div>
        </div>
        <div
          class="nodes"
          style="left: -35px; top: -35px;"
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
              id="diagram-5-line-arrow-connect-line"
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

    fireEvent.dblClick(
      element.shadowRoot!.querySelector(".line.interactable")!
    );
    expect(onLineDoubleClick).toBeCalledWith({
      id: "line-7",
      edge: expect.objectContaining({ source: "a", target: "c" }),
    });

    element.callOnLineLabel("line-7", "addEventListener", "click", jest.fn());

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("not dagre layout", async () => {
    const element = document.createElement("eo-diagram") as EoDiagram;
    element.layout = "force" as any;

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes[1]).toMatchInlineSnapshot(`
      <div>
        Diagram layout not supported: "force"
      </div>
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
