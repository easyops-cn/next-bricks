import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoDrawCanvas } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

document.elementsFromPoint = jest.fn(() => []);

describe("eo-draw-canvas", () => {
  test("drop node", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    element.getBoundingClientRect = jest.fn(() => ({
      left: 180,
      top: 120,
    })) as any;

    await act(async () => {
      const dropResult1 = await element.dropNode({
        id: "test",
        position: [800, 600],
        size: [100, 200],
        data: {},
        useBrick: { brick: "div" },
      });
      expect(dropResult1).toBe(null);
    });

    const originalElementsFromPoint = document.elementsFromPoint;
    document.elementsFromPoint = jest.fn(() => [element]);
    await act(async () => {
      const dropResult2 = await element.dropNode({
        id: "test",
        position: [800, 600],
        size: [100, 200],
        data: {},
        useBrick: { brick: "div" },
      });
      expect(dropResult2).toEqual({
        type: "node",
        id: "test",
        data: {},
        useBrick: {
          brick: "div",
        },
        view: {
          x: 620,
          y: 480,
          width: 100,
          height: 200,
        },
      });
    });
    document.elementsFromPoint = originalElementsFromPoint;

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("add nodes", async () => {
    const element = document.createElement("eo-draw-canvas") as EoDrawCanvas;

    act(() => {
      document.body.appendChild(element);
    });

    await act(async () => {
      const result = await element.addNodes([]);
      expect(result).toEqual([]);
    });

    await act(async () => {
      const result = await element.addNodes([
        {
          id: "add-1",
          size: [100, 200],
          data: {},
          useBrick: { brick: "div" },
        },
        {
          id: "add-2",
          data: {},
          useBrick: { brick: "div" },
        },
      ]);
      expect(result).toEqual([
        {
          data: {},
          id: "add-1",
          type: "node",
          useBrick: {
            brick: "div",
          },
          view: {
            height: 200,
            width: 100,
            x: 20,
            y: 20,
          },
        },
        {
          data: {},
          id: "add-2",
          type: "node",
          useBrick: {
            brick: "div",
          },
          view: {
            height: 20,
            width: 20,
            x: 20,
            y: 240,
          },
        },
      ]);
    });

    // Test when the first node has no size
    await act(async () => {
      const result = await element.addNodes([
        {
          id: "add-3",
          data: {},
          useBrick: { brick: "div" },
        },
        {
          id: "add-4",
          size: [100, 200],
          data: {},
          useBrick: { brick: "div" },
        },
      ]);
      expect(result).toEqual([
        {
          data: {},
          id: "add-3",
          type: "node",
          useBrick: {
            brick: "div",
          },
          view: {
            height: 20,
            width: 20,
            x: 20,
            y: 20,
          },
        },
        {
          data: {},
          id: "add-4",
          type: "node",
          useBrick: {
            brick: "div",
          },
          view: {
            height: 200,
            width: 100,
            x: 20,
            y: 60,
          },
        },
      ]);
    });

    act(() => {
      document.body.removeChild(element);
    });
  });
});
