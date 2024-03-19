import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import type { EoDisplayCanvas } from "./index.js";
import type { NodeBrickCell } from "../draw-canvas/interfaces";

jest.mock("@next-core/theme", () => ({}));
jest.mock("d3-drag");
jest.mock("resize-observer-polyfill", () => ({
  __esModule: true,
  default: function (callback: ResizeObserverCallback) {
    callback([], null!);
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
  },
}));

describe("eo-display-canvas", () => {
  test("hover", async () => {
    const element = document.createElement(
      "eo-display-canvas"
    ) as EoDisplayCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
    element.fadeUnrelatedCells = true;
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
        type: "edge",
        source: "a",
        target: "b",
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

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    // MouseEnter node a
    act(() => {
      fireEvent.mouseEnter(element.shadowRoot!.querySelectorAll(".cell")[2]!);
    });
    expect(
      [...element.shadowRoot!.querySelectorAll(".cells .cell")].map((cell) =>
        cell.classList.contains("faded")
      )
    ).toEqual([true, false, false, false, true]);

    // MouseLeave node b
    act(() => {
      fireEvent.mouseLeave(element.shadowRoot!.querySelectorAll(".cell")[3]!);
    });
    // No effects
    expect(
      element.shadowRoot!.querySelectorAll(".cells .cell.faded").length
    ).toBe(2);

    // MouseLeave node a
    act(() => {
      fireEvent.mouseLeave(element.shadowRoot!.querySelectorAll(".cell")[2]!);
    });
    expect(
      element.shadowRoot!.querySelectorAll(".cells .cell.faded").length
    ).toBe(0);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("context menu", async () => {
    const element = document.createElement(
      "eo-display-canvas"
    ) as EoDisplayCanvas;
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

  test("zoom bar", async () => {
    const element = document.createElement(
      "eo-display-canvas"
    ) as EoDisplayCanvas;
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
    ] as NodeBrickCell[];

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    // Zoom in
    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector(".zoom-button")!);
    });

    // Zoom out
    act(() => {
      fireEvent.click(element.shadowRoot!.querySelectorAll(".zoom-button")[1]);
    });

    // Re-center
    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector(".center-button")!);
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("dagre layout", async () => {
    const element = document.createElement(
      "eo-display-canvas"
    ) as EoDisplayCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
    element.layout = "dagre";
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
        type: "edge",
        source: "a",
        target: "b",
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

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => (global as any).flushPromises());
    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    expect(
      [...element.shadowRoot!.querySelectorAll(".cell")].map((cell) =>
        cell.getAttribute("transform")
      )
    ).toEqual([
      "translate(10 10)",
      null,
      "translate(0 0)",
      "translate(0 50)",
      "translate(150 160)",
    ]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("force layout", async () => {
    const element = document.createElement(
      "eo-display-canvas"
    ) as EoDisplayCanvas;
    element.defaultNodeBricks = [{ useBrick: { brick: "div" } }];
    element.layout = "force";
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
        type: "edge",
        source: "a",
        target: "b",
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

    act(() => {
      document.body.appendChild(element);
    });

    await act(() => (global as any).flushPromises());
    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));

    expect(
      [...element.shadowRoot!.querySelectorAll(".cell")].map((cell) =>
        cell.getAttribute("transform")
      )
    ).toEqual([
      "translate(10 10)",
      null,
      expect.stringMatching(/^translate\(16\.01\d+ -8\.22\d+\)$/),
      expect.stringMatching(/^translate\(-16\.01\d+ 8\.22\d+\)$/),
      "translate(150 160)",
    ]);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
