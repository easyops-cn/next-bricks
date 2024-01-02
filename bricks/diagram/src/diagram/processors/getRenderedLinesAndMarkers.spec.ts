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
          "data": {
            "source": "a",
            "target": "b",
            "type": "menu",
          },
          "line": {
            "curveType": "curveBasis",
            "strokeColor": "var(--palette-gray-5)",
            "strokeWidth": 1,
          },
          "markerIndex": undefined,
        },
        {
          "data": {
            "source": "a",
            "target": "c",
            "type": "menu",
          },
          "line": {
            "curveType": "curveBasis",
            "strokeColor": "var(--palette-gray-5)",
            "strokeWidth": 1,
          },
          "markerIndex": undefined,
        },
        {
          "data": {
            "source": "b",
            "target": "d",
            "type": "link",
          },
          "line": {
            "curveType": "curveBasis",
            "strokeColor": "var(--palette-gray-5)",
            "strokeWidth": 1,
          },
          "markerIndex": undefined,
        },
        {
          "data": {
            "source": "b",
            "target": "e",
            "type": "link",
          },
          "line": {
            "curveType": "curveBasis",
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
          "data": {
            "source": "a",
            "target": "b",
            "type": "menu",
          },
          "line": {
            "curveType": "curveBasis",
            "edgeType": "menu",
            "strokeColor": "gray",
            "strokeWidth": 1,
          },
          "markerIndex": undefined,
        },
        {
          "data": {
            "source": "a",
            "target": "c",
            "type": "menu",
          },
          "line": {
            "curveType": "curveBasis",
            "edgeType": "menu",
            "strokeColor": "gray",
            "strokeWidth": 1,
          },
          "markerIndex": undefined,
        },
        {
          "data": {
            "source": "b",
            "target": "d",
            "type": "link",
          },
          "line": {
            "arrow": true,
            "curveType": "curveBasis",
            "edgeType": "link",
            "strokeColor": "blue",
            "strokeWidth": 1,
          },
          "markerIndex": 0,
        },
        {
          "data": {
            "source": "b",
            "target": "e",
            "type": "link",
          },
          "line": {
            "arrow": true,
            "curveType": "curveBasis",
            "edgeType": "link",
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
