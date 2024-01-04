import { describe, test, expect } from "@jest/globals";
import { getRenderedLinesAndMarkers } from "./getRenderedLinesAndMarkers";
import type { RenderedEdge } from "../interfaces";

describe("getRenderedLinesAndMarkers", () => {
  const renderedEdges = [
    {
      data: {
        type: "menu",
        source: "a",
        target: "b",
      },
    },
    {
      data: {
        type: "menu",
        source: "a",
        target: "c",
      },
    },
    {
      data: {
        type: "link",
        source: "b",
        target: "d",
      },
    },
    {
      data: {
        type: "link",
        source: "b",
        target: "e",
      },
    },
  ] as RenderedEdge[];

  test("no line conf", () => {
    const { renderedLines, markers } = getRenderedLinesAndMarkers(
      renderedEdges,
      undefined
    );
    expect(renderedLines).toMatchInlineSnapshot(`
[
  {
    "d": "",
    "edge": {
      "source": "a",
      "target": "b",
      "type": "menu",
    },
    "line": {
      "$id": "line-1",
      "curveType": "curveBasis",
      "interactStrokeWidth": 20,
      "label": undefined,
      "strokeColor": "var(--palette-gray-5)",
      "strokeWidth": 1,
    },
    "markerIndex": undefined,
  },
  {
    "d": "",
    "edge": {
      "source": "a",
      "target": "c",
      "type": "menu",
    },
    "line": {
      "$id": "line-2",
      "curveType": "curveBasis",
      "interactStrokeWidth": 20,
      "label": undefined,
      "strokeColor": "var(--palette-gray-5)",
      "strokeWidth": 1,
    },
    "markerIndex": undefined,
  },
  {
    "d": "",
    "edge": {
      "source": "b",
      "target": "d",
      "type": "link",
    },
    "line": {
      "$id": "line-3",
      "curveType": "curveBasis",
      "interactStrokeWidth": 20,
      "label": undefined,
      "strokeColor": "var(--palette-gray-5)",
      "strokeWidth": 1,
    },
    "markerIndex": undefined,
  },
  {
    "d": "",
    "edge": {
      "source": "b",
      "target": "e",
      "type": "link",
    },
    "line": {
      "$id": "line-4",
      "curveType": "curveBasis",
      "interactStrokeWidth": 20,
      "label": undefined,
      "strokeColor": "var(--palette-gray-5)",
      "strokeWidth": 1,
    },
    "markerIndex": undefined,
  },
]
`);
    expect(markers).toEqual([]);
  });

  test("colored lines with filter", () => {
    const { renderedLines, markers } = getRenderedLinesAndMarkers(
      renderedEdges,
      [
        { edgeType: "menu", strokeColor: "gray" },
        { edgeType: "link", arrow: true, strokeColor: "blue" },
      ]
    );
    expect(renderedLines).toMatchInlineSnapshot(`
[
  {
    "d": "",
    "edge": {
      "source": "a",
      "target": "b",
      "type": "menu",
    },
    "line": {
      "$id": "line-5",
      "curveType": "curveBasis",
      "edgeType": "menu",
      "interactStrokeWidth": 20,
      "label": undefined,
      "strokeColor": "gray",
      "strokeWidth": 1,
    },
    "markerIndex": undefined,
  },
  {
    "d": "",
    "edge": {
      "source": "a",
      "target": "c",
      "type": "menu",
    },
    "line": {
      "$id": "line-6",
      "curveType": "curveBasis",
      "edgeType": "menu",
      "interactStrokeWidth": 20,
      "label": undefined,
      "strokeColor": "gray",
      "strokeWidth": 1,
    },
    "markerIndex": undefined,
  },
  {
    "d": "",
    "edge": {
      "source": "b",
      "target": "d",
      "type": "link",
    },
    "line": {
      "$id": "line-7",
      "arrow": true,
      "curveType": "curveBasis",
      "edgeType": "link",
      "interactStrokeWidth": 20,
      "label": undefined,
      "strokeColor": "blue",
      "strokeWidth": 1,
    },
    "markerIndex": 0,
  },
  {
    "d": "",
    "edge": {
      "source": "b",
      "target": "e",
      "type": "link",
    },
    "line": {
      "$id": "line-8",
      "arrow": true,
      "curveType": "curveBasis",
      "edgeType": "link",
      "interactStrokeWidth": 20,
      "label": undefined,
      "strokeColor": "blue",
      "strokeWidth": 1,
    },
    "markerIndex": 0,
  },
]
`);
    expect(markers).toEqual([{ strokeColor: "blue" }]);
  });

  test("no draw", () => {
    const { renderedLines, markers } = getRenderedLinesAndMarkers(
      renderedEdges,
      [{ draw: false }]
    );
    expect(renderedLines.length).toBe(0);
    expect(markers.length).toBe(0);
  });
});
