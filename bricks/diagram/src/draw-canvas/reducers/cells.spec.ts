import { describe, test, expect } from "@jest/globals";
import { cells } from "./cells";
import { SYMBOL_FOR_SIZE_INITIALIZED } from "../constants";

describe("cells reducer", () => {
  test("drop node", () => {
    expect(
      cells([], { type: "drop-node", payload: { id: "1" } as any })
    ).toEqual([{ id: "1" }]);
  });

  test("add nodes", () => {
    expect(
      cells([{ id: "2" } as any], {
        type: "add-nodes",
        payload: [{ id: "3" }] as any,
      })
    ).toEqual([{ id: "2" }, { id: "3" }]);
  });

  test("add edge", () => {
    const newCells = cells([{ type: "node", id: "2" } as any], {
      type: "add-edge",
      payload: { type: "edge", source: "1", target: "2" },
    });
    expect(newCells).toEqual([
      {
        source: "1",
        target: "2",
        type: "edge",
      },
      {
        id: "2",
        type: "node",
      },
    ]);
    expect(
      cells(newCells, {
        type: "add-edge",
        payload: { type: "edge", source: "1", target: "3" },
      })
    ).toEqual([
      {
        source: "1",
        target: "2",
        type: "edge",
      },
      {
        source: "1",
        target: "3",
        type: "edge",
      },
      {
        id: "2",
        type: "node",
      },
    ]);
  });

  test("add edge which is existed", () => {
    const newCells = cells(
      [
        { type: "edge", source: "1", target: "2" },
        { type: "node", id: "2" } as any,
      ],
      {
        type: "add-edge",
        payload: {
          type: "edge",
          source: "1",
          target: "2",
          view: { exitPosition: { x: 0, y: 0.5 } },
        },
      }
    );
    expect(newCells).toEqual([
      {
        source: "1",
        target: "2",
        type: "edge",
        view: { exitPosition: { x: 0, y: 0.5 } },
      },
      {
        id: "2",
        type: "node",
      },
    ]);
  });

  test("change edge view", () => {
    const newCells = cells(
      [
        { type: "edge", source: "1", target: "2" },
        { type: "node", id: "2" } as any,
      ],
      {
        type: "change-edge-view",
        payload: {
          source: "1",
          target: "2",
          view: { exitPosition: { x: 0, y: 0.5 } },
        },
      }
    );
    expect(newCells).toEqual([
      {
        source: "1",
        target: "2",
        type: "edge",
        view: { exitPosition: { x: 0, y: 0.5 } },
      },
      {
        id: "2",
        type: "node",
      },
    ]);
  });

  test("change edge view which is not existed", () => {
    const newCells = cells(
      [
        { type: "edge", source: "1", target: "2" },
        { type: "node", id: "2" } as any,
      ],
      {
        type: "change-edge-view",
        payload: {
          source: "1",
          target: "3",
          view: { exitPosition: { x: 0, y: 0.5 } },
        },
      }
    );
    expect(newCells).toEqual([
      {
        source: "1",
        target: "2",
        type: "edge",
      },
      {
        id: "2",
        type: "node",
      },
    ]);
  });

  test("add decorator area", () => {
    const newCells = cells([{ type: "edge", source: "1", target: "2" }], {
      type: "drop-decorator",
      payload: { type: "decorator", decorator: "area", id: "area-a" } as any,
    });
    expect(newCells).toEqual([
      { type: "decorator", decorator: "area", id: "area-a" },
      {
        source: "1",
        target: "2",
        type: "edge",
      },
    ]);
    expect(
      cells(newCells, {
        type: "drop-decorator",
        payload: { type: "decorator", decorator: "area", id: "area-b" } as any,
      })
    ).toEqual([
      { type: "decorator", decorator: "area", id: "area-a" },
      { type: "decorator", decorator: "area", id: "area-b" },
      {
        source: "1",
        target: "2",
        type: "edge",
      },
    ]);
  });

  test("add decorator text", () => {
    const newCells = cells([{ type: "node", id: "1" } as any], {
      type: "drop-decorator",
      payload: { type: "decorator", decorator: "text", id: "text-a" } as any,
    });
    expect(newCells).toEqual([
      { type: "node", id: "1" },
      { type: "decorator", decorator: "text", id: "text-a" },
    ]);
    expect(
      cells(newCells, {
        type: "drop-decorator",
        payload: { type: "decorator", decorator: "text", id: "text-b" } as any,
      })
    ).toEqual([
      { type: "node", id: "1" },
      { type: "decorator", decorator: "text", id: "text-a" },
      { type: "decorator", decorator: "text", id: "text-b" },
    ]);
  });

  test("move node", () => {
    const newCells = cells(
      [{ id: "2", type: "node", view: { x: 0, y: 0 } } as any],
      {
        type: "move-cells",
        payload: [{ type: "node", id: "2", x: 1, y: 2, guideLines: [] }],
      }
    );
    expect(newCells).toEqual([
      {
        id: "2",
        type: "node",
        view: { x: 1, y: 2 },
      },
    ]);
  });

  test("move a not found cell", () => {
    const newCells = cells(
      [{ id: "2", type: "node", view: { x: 0, y: 0 } } as any],
      {
        type: "move-cells",
        payload: [{ type: "node", id: "3", x: 1, y: 2, guideLines: [] }],
      }
    );
    expect(newCells).toEqual([
      {
        id: "2",
        type: "node",
        view: { x: 0, y: 0 },
      },
    ]);
  });

  test("resize node", () => {
    const newCells = cells(
      [{ id: "2", type: "node", view: { width: 100, height: 60 } } as any],
      {
        type: "resize-cell",
        payload: { type: "node", id: "2", width: 120, height: 80 },
      }
    );
    expect(newCells).toEqual([
      {
        id: "2",
        type: "node",
        view: { width: 120, height: 80 },
      },
    ]);
  });

  test("resize a not found node", () => {
    const newCells = cells(
      [{ id: "2", type: "node", view: { width: 100, height: 60 } } as any],
      {
        type: "resize-cell",
        payload: { type: "node", id: "3", width: 120, height: 80 },
      }
    );
    expect(newCells).toEqual([
      {
        id: "2",
        type: "node",
        view: { width: 100, height: 60 },
      },
    ]);
  });

  test("update all", () => {
    const newCells = cells(
      [{ id: "2", type: "node", view: { width: 100, height: 60 } } as any],
      {
        type: "update-cells",
        payload: [
          { id: "3", type: "node", view: { width: 120, height: 80 } } as any,
        ],
      }
    );
    expect(newCells).toEqual([
      {
        id: "3",
        type: "node",
        view: { width: 120, height: 80 },
      },
    ]);
  });

  test("update-node-size", () => {
    const newCells = cells(
      [
        { source: "1", target: "2", type: "edge" },
        { id: "1", type: "node", view: { width: 100, height: 60 } },
        { id: "2", type: "node", view: { width: 100, height: 60 } },
      ] as any,
      {
        type: "update-node-size",
        payload: { id: "2", size: [120, 80] },
        layoutKey: 0,
      }
    );
    expect(newCells).toEqual([
      { source: "1", target: "2", type: "edge" },
      { id: "1", type: "node", view: { width: 100, height: 60 } },
      {
        id: "2",
        type: "node",
        view: { width: 120, height: 80 },
        [SYMBOL_FOR_SIZE_INITIALIZED]: true,
      },
    ]);
  });

  test("unknown actions", () => {
    expect(
      cells([{ id: "x" } as any], {
        type: "unknown",
        payload: { id: "z" },
      } as any)
    ).toEqual([{ id: "x" }]);
  });
});
