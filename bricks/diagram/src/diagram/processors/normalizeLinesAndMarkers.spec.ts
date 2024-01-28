import { describe, test, expect } from "@jest/globals";
import { normalizeLinesAndMarkers } from "./normalizeLinesAndMarkers";
import type { DiagramEdge } from "../interfaces";

describe("normalizeLinesAndMarkers", () => {
  const edges = [
    {
      type: "menu",
      source: "a",
      target: "b",
    },
    {
      type: "menu",
      source: "a",
      target: "c",
    },
    {
      type: "link",
      source: "b",
      target: "d",
    },
    {
      type: "link",
      source: "b",
      target: "e",
    },
  ] as DiagramEdge[];

  test("no line conf", () => {
    const { normalizedLines, markers } = normalizeLinesAndMarkers(
      edges,
      undefined
    );
    expect(normalizedLines).toMatchInlineSnapshot(`
      [
        {
          "activeMarkerIndex": undefined,
          "activeRelatedMarkerIndex": undefined,
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
          "activeMarkerIndex": undefined,
          "activeRelatedMarkerIndex": undefined,
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
          "activeMarkerIndex": undefined,
          "activeRelatedMarkerIndex": undefined,
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
          "activeMarkerIndex": undefined,
          "activeRelatedMarkerIndex": undefined,
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
    const { normalizedLines, markers } = normalizeLinesAndMarkers(edges, [
      { edgeType: "menu", strokeColor: "gray" },
      {
        edgeType: "link",
        arrow: true,
        strokeColor: "blue",
        overrides: {
          active: { strokeColor: "red" },
          activeRelated: { strokeColor: "purple" },
        },
      },
    ]);
    expect(normalizedLines).toMatchInlineSnapshot(`
      [
        {
          "activeMarkerIndex": undefined,
          "activeRelatedMarkerIndex": undefined,
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
          "activeMarkerIndex": undefined,
          "activeRelatedMarkerIndex": undefined,
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
          "activeMarkerIndex": 1,
          "activeRelatedMarkerIndex": 2,
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
            "overrides": {
              "active": {
                "strokeColor": "red",
              },
              "activeRelated": {
                "strokeColor": "purple",
              },
            },
            "strokeColor": "blue",
            "strokeWidth": 1,
          },
          "markerIndex": 0,
        },
        {
          "activeMarkerIndex": 1,
          "activeRelatedMarkerIndex": 2,
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
            "overrides": {
              "active": {
                "strokeColor": "red",
              },
              "activeRelated": {
                "strokeColor": "purple",
              },
            },
            "strokeColor": "blue",
            "strokeWidth": 1,
          },
          "markerIndex": 0,
        },
      ]
    `);
    expect(markers).toEqual([
      { strokeColor: "blue" },
      { strokeColor: "red" },
      { strokeColor: "purple" },
    ]);
  });

  test("no draw", () => {
    const { normalizedLines, markers } = normalizeLinesAndMarkers(edges, [
      { draw: false },
    ]);
    expect(normalizedLines.length).toBe(0);
    expect(markers.length).toBe(0);
  });
});
