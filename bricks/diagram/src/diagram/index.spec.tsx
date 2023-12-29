import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoDiagram } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

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
            class="dragger"
          />
          <div
            class="nodes"
            style="left: 0px; top: 0px;"
          />
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
      { source: "a", target: "c", type: "link" },
    ];
    element.lines = [
      { edgeType: "menu", strokeColor: "gray" },
      { edgeType: "link", arrow: true, strokeColor: "blue" },
    ];

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelectorAll(".node").length).toBe(3);
    expect(element.shadowRoot?.childNodes[1]).toMatchInlineSnapshot(`
      <div
        class="diagram"
        tabindex="-1"
      >
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
          class="dragger"
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
      </div>
    `);

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
        id="diagram-line-arrow-2-0"
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
    </defs>
    <g
      transform="translate(-20 -35) scale(1)"
    >
      <path
        d="M17.5,10L15.417,14.167C13.333,18.333,9.167,26.667,7.083,35C5,43.333,5,51.667,5,55.833L5,60"
        fill="none"
        stroke="gray"
        stroke-width="1"
      />
      <path
        d="M22.5,10L24.583,14.167C26.667,18.333,30.833,26.667,32.917,34.167C35,41.667,35,48.333,35,51.667L35,55"
        fill="none"
        marker-end="url(#diagram-line-arrow-2-0)"
        stroke="blue"
        stroke-width="1"
      />
    </g>
  </svg>
  <div
    class="dragger"
  />
  <div
    class="nodes"
    style="left: -20px; top: -35px;"
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
</div>
`);

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
