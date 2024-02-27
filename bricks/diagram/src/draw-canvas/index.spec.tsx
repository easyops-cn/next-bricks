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
});
