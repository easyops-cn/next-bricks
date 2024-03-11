import { describe, test, expect } from "@jest/globals";
import { updateCells } from "./updateCells";

describe("updateCells", () => {
  test("add related nodes on right side of siblings", () => {
    expect(
      updateCells({
        cells: [
          {
            type: "decorator",
            decorator: "area",
            id: "area-a",
            view: {
              x: 1,
              y: 2,
              width: 3,
              height: 4,
            },
          },
          {
            type: "edge",
            source: "1",
            target: "2",
          },
          {
            type: "edge",
            source: "1",
            target: "3",
          },
          {
            type: "edge",
            source: "1",
            target: "4",
          },
          {
            id: "1",
            type: "node",
            view: {
              x: 100,
              y: 30,
            },
          },
          {
            id: "2",
            type: "node",
            view: {
              x: 160,
              y: 100,
            },
          },
          {
            id: "3",
            type: "node",
            view: {
              x: 20,
              y: 100,
            },
          },
          {
            id: "4",
            type: "node",
          },
        ],
        defaultNodeSize: [120, 80],
        canvasHeight: 600,
        transform: { k: 1, x: 0, y: 0 },
        reason: "add-related-nodes",
        parent: "1",
      })
    ).toEqual({
      cells: [
        {
          type: "decorator",
          decorator: "area",
          id: "area-a",
          view: {
            x: 1,
            y: 2,
            width: 3,
            height: 4,
          },
        },
        {
          type: "edge",
          source: "1",
          target: "2",
        },
        {
          type: "edge",
          source: "1",
          target: "3",
        },
        {
          type: "edge",
          source: "1",
          target: "4",
        },
        {
          id: "1",
          type: "node",
          view: {
            x: 100,
            y: 30,
            height: 80,
            width: 120,
          },
        },
        {
          id: "2",
          type: "node",
          view: {
            x: 160,
            y: 100,
            height: 80,
            width: 120,
          },
        },
        {
          id: "3",
          type: "node",
          view: {
            x: 20,
            y: 100,
            height: 80,
            width: 120,
          },
        },
        {
          id: "4",
          type: "node",
          view: {
            x: 316,
            y: 100,
            height: 80,
            width: 120,
          },
        },
      ],
      updated: [
        {
          id: "4",
          type: "node",
          view: {
            x: 316,
            y: 100,
            height: 80,
            width: 120,
          },
        },
      ],
    });
  });

  test("add related nodes below parent", () => {
    expect(
      updateCells({
        cells: [
          {
            type: "edge",
            source: "1",
            target: "2",
          },
          {
            type: "edge",
            source: "2",
            target: "3",
          },
          {
            id: "1",
            type: "node",
            view: {
              x: 100,
              y: 30,
            },
          },
          {
            id: "2",
            type: "node",
            view: {
              x: 20,
              y: 100,
            },
          },
          {
            id: "3",
            type: "node",
          },
        ],
        defaultNodeSize: [120, 80],
        canvasHeight: 600,
        transform: { k: 1, x: 0, y: 0 },
        reason: "add-related-nodes",
        parent: "2",
      })
    ).toEqual({
      cells: [
        {
          type: "edge",
          source: "1",
          target: "2",
        },
        {
          type: "edge",
          source: "2",
          target: "3",
        },
        {
          id: "1",
          type: "node",
          view: {
            x: 100,
            y: 30,
            height: 80,
            width: 120,
          },
        },
        {
          id: "2",
          type: "node",
          view: {
            x: 20,
            y: 100,
            height: 80,
            width: 120,
          },
        },
        {
          id: "3",
          type: "node",
          view: {
            x: 20,
            y: 216,
            height: 80,
            width: 120,
          },
        },
      ],
      updated: [
        {
          id: "3",
          type: "node",
          view: {
            x: 20,
            y: 216,
            height: 80,
            width: 120,
          },
        },
      ],
    });
  });

  test("no reason", () => {
    expect(
      updateCells({
        cells: [
          {
            id: "1",
            type: "node",
          },
          {
            id: "2",
            type: "node",
          },
        ],
        defaultNodeSize: [120, 80],
        canvasHeight: 600,
        transform: { k: 1, x: 0, y: 0 },
      })
    ).toEqual({
      cells: [
        {
          id: "1",
          type: "node",
          view: {
            height: 80,
            width: 120,
            x: 18,
            y: 18,
          },
        },
        {
          id: "2",
          type: "node",
          view: {
            height: 80,
            width: 120,
            x: 18,
            y: 134,
          },
        },
      ],
      updated: expect.objectContaining({ length: 2 }),
    });
  });

  test("parent unpositioned", () => {
    expect(
      updateCells({
        cells: [
          {
            id: "1",
            type: "node",
          },
          {
            id: "2",
            type: "node",
          },
        ],
        defaultNodeSize: [120, 80],
        canvasHeight: 600,
        transform: { k: 1, x: 0, y: 0 },
        reason: "add-related-nodes",
        parent: "1",
      })
    ).toEqual({
      cells: [
        {
          id: "1",
          type: "node",
          view: {
            height: 80,
            width: 120,
            x: 18,
            y: 18,
          },
        },
        {
          id: "2",
          type: "node",
          view: {
            height: 80,
            width: 120,
            x: 18,
            y: 134,
          },
        },
      ],
      updated: expect.objectContaining({ length: 2 }),
    });
  });

  test("all positioned", () => {
    expect(
      updateCells({
        cells: [
          {
            id: "1",
            type: "node",
            view: {
              x: 100,
              y: 30,
            },
          },
          {
            id: "2",
            type: "node",
            view: {
              x: 300,
              y: 30,
            },
          },
        ],
        defaultNodeSize: [120, 80],
        canvasHeight: 600,
        transform: { k: 1, x: 0, y: 0 },
        reason: "add-related-nodes",
        parent: "1",
      })
    ).toEqual({
      cells: [
        {
          id: "1",
          type: "node",
          view: {
            x: 100,
            y: 30,
            height: 80,
            width: 120,
          },
        },
        {
          id: "2",
          type: "node",
          view: {
            x: 300,
            y: 30,
            height: 80,
            width: 120,
          },
        },
      ],
      updated: [],
    });
  });
});
