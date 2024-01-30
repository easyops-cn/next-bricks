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
            "type": "auto",
          },
          "markers": [],
        },
        {
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
            "type": "auto",
          },
          "markers": [],
        },
        {
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
            "type": "auto",
          },
          "markers": [],
        },
        {
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
            "type": "auto",
          },
          "markers": [],
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
            "type": "auto",
          },
          "markers": [],
        },
        {
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
            "type": "auto",
          },
          "markers": [],
        },
        {
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
            "type": "auto",
          },
          "markers": [
            {
              "index": 0,
              "offset": 1,
              "placement": "end",
              "type": "arrow",
              "variant": "default",
            },
            {
              "index": 1,
              "offset": 1,
              "placement": "end",
              "type": "arrow",
              "variant": "active",
            },
            {
              "index": 2,
              "offset": 1,
              "placement": "end",
              "type": "arrow",
              "variant": "active-related",
            },
          ],
        },
        {
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
            "type": "auto",
          },
          "markers": [
            {
              "index": 0,
              "offset": 1,
              "placement": "end",
              "type": "arrow",
              "variant": "default",
            },
            {
              "index": 1,
              "offset": 1,
              "placement": "end",
              "type": "arrow",
              "variant": "active",
            },
            {
              "index": 2,
              "offset": 1,
              "placement": "end",
              "type": "arrow",
              "variant": "active-related",
            },
          ],
        },
      ]
    `);
    expect(markers).toEqual([
      { type: "arrow", strokeColor: "blue" },
      { type: "arrow", strokeColor: "red" },
      { type: "arrow", strokeColor: "purple" },
    ]);
  });

  test("custom markers", () => {
    const { normalizedLines, markers } = normalizeLinesAndMarkers(edges, [
      { edgeType: "menu", strokeColor: "gray" },
      {
        edgeType: "link",
        strokeColor: "blue",
        markers: [
          {
            type: "0..1",
            placement: "start",
          },
          {
            type: "0..N",
            placement: "end",
          },
        ],
      },
    ]);
    expect(normalizedLines).toMatchInlineSnapshot(`
      [
        {
          "edge": {
            "source": "a",
            "target": "b",
            "type": "menu",
          },
          "line": {
            "$id": "line-9",
            "curveType": "curveBasis",
            "edgeType": "menu",
            "interactStrokeWidth": 20,
            "label": undefined,
            "strokeColor": "gray",
            "strokeWidth": 1,
            "type": "auto",
          },
          "markers": [],
        },
        {
          "edge": {
            "source": "a",
            "target": "c",
            "type": "menu",
          },
          "line": {
            "$id": "line-10",
            "curveType": "curveBasis",
            "edgeType": "menu",
            "interactStrokeWidth": 20,
            "label": undefined,
            "strokeColor": "gray",
            "strokeWidth": 1,
            "type": "auto",
          },
          "markers": [],
        },
        {
          "edge": {
            "source": "b",
            "target": "d",
            "type": "link",
          },
          "line": {
            "$id": "line-11",
            "curveType": "curveBasis",
            "edgeType": "link",
            "interactStrokeWidth": 20,
            "label": undefined,
            "markers": [
              {
                "placement": "start",
                "type": "0..1",
              },
              {
                "placement": "end",
                "type": "0..N",
              },
            ],
            "strokeColor": "blue",
            "strokeWidth": 1,
            "type": "auto",
          },
          "markers": [
            {
              "index": 0,
              "offset": 21,
              "placement": "start",
              "type": "0..1",
              "variant": "default",
            },
            {
              "index": 0,
              "offset": 21,
              "placement": "start",
              "type": "0..1",
              "variant": "active",
            },
            {
              "index": 0,
              "offset": 21,
              "placement": "start",
              "type": "0..1",
              "variant": "active-related",
            },
            {
              "index": 1,
              "offset": 21,
              "placement": "end",
              "type": "0..N",
              "variant": "default",
            },
            {
              "index": 1,
              "offset": 21,
              "placement": "end",
              "type": "0..N",
              "variant": "active",
            },
            {
              "index": 1,
              "offset": 21,
              "placement": "end",
              "type": "0..N",
              "variant": "active-related",
            },
          ],
        },
        {
          "edge": {
            "source": "b",
            "target": "e",
            "type": "link",
          },
          "line": {
            "$id": "line-12",
            "curveType": "curveBasis",
            "edgeType": "link",
            "interactStrokeWidth": 20,
            "label": undefined,
            "markers": [
              {
                "placement": "start",
                "type": "0..1",
              },
              {
                "placement": "end",
                "type": "0..N",
              },
            ],
            "strokeColor": "blue",
            "strokeWidth": 1,
            "type": "auto",
          },
          "markers": [
            {
              "index": 0,
              "offset": 21,
              "placement": "start",
              "type": "0..1",
              "variant": "default",
            },
            {
              "index": 0,
              "offset": 21,
              "placement": "start",
              "type": "0..1",
              "variant": "active",
            },
            {
              "index": 0,
              "offset": 21,
              "placement": "start",
              "type": "0..1",
              "variant": "active-related",
            },
            {
              "index": 1,
              "offset": 21,
              "placement": "end",
              "type": "0..N",
              "variant": "default",
            },
            {
              "index": 1,
              "offset": 21,
              "placement": "end",
              "type": "0..N",
              "variant": "active",
            },
            {
              "index": 1,
              "offset": 21,
              "placement": "end",
              "type": "0..N",
              "variant": "active-related",
            },
          ],
        },
      ]
    `);
    expect(markers).toEqual([
      { type: "0..1", strokeColor: "blue" },
      { type: "0..N", strokeColor: "blue" },
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
