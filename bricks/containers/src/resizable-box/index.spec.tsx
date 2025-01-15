import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import type { ResizableBox } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

jest
  .spyOn(document.documentElement, "clientWidth", "get")
  .mockImplementation(() => 800);
jest
  .spyOn(document.documentElement, "clientHeight", "get")
  .mockImplementation(() => 600);

window.requestAnimationFrame = jest.fn(
  (fn: Function) => setTimeout(fn, 17) as unknown as number
);

describe("eo-resizable-box", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-resizable-box") as ResizableBox;
    element.syncSizeWithHost = true;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    // Default size
    expect(
      (element.shadowRoot?.querySelector(".box") as HTMLElement).style.width
    ).toBe("200px");

    expect(element.style.width).toBe("200px");

    act(() => {
      fireEvent.mouseDown(element.shadowRoot!.querySelector(".bar"), {
        clientX: 100,
        clientY: 200,
      });
    });
    expect(
      element.shadowRoot?.querySelector(".box")?.classList.contains("resizing")
    ).toBe(true);
    act(() => {
      fireEvent.mouseMove(window, {
        clientX: 120,
        clientY: 250,
      });
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 17)));

    expect(
      (element.shadowRoot?.querySelector(".box") as HTMLElement).style.width
    ).toBe("220px");

    act(() => {
      fireEvent.mouseUp(window);
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("with storageKey", async () => {
    const element = document.createElement("eo-resizable-box") as ResizableBox;
    element.variant = "dashboard";
    element.storageKey = "test";
    element.resizeDirection = "top";
    element.defaultSize = 250;
    element.minSize = 170;
    element.minSpace = 150;
    element.syncSizeWithHost = true;

    act(() => {
      document.body.appendChild(element);
    });
    // Default size
    expect(
      (element.shadowRoot?.querySelector(".box") as HTMLElement).style.height
    ).toBe("250px");

    act(() => {
      fireEvent.mouseDown(element.shadowRoot!.querySelector(".bar"), {
        clientX: 100,
        clientY: 200,
      });
    });
    expect(
      element.shadowRoot?.querySelector(".box")?.classList.contains("resizing")
    ).toBe(true);
    act(() => {
      fireEvent.mouseMove(window, {
        clientX: 120,
        clientY: 175,
      });
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 17)));

    expect(
      (element.shadowRoot?.querySelector(".box") as HTMLElement).style.height
    ).toBe("275px");

    expect(element.style.height).toBe("275px");

    act(() => {
      fireEvent.mouseUp(window);
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("disabled", async () => {
    const element = document.createElement("eo-resizable-box") as ResizableBox;
    element.disabled = true;

    act(() => {
      document.body.appendChild(element);
    });

    act(() => {
      fireEvent.mouseDown(element.shadowRoot!.querySelector(".bar"), {
        clientX: 100,
        clientY: 200,
      });
    });
    expect(
      element.shadowRoot?.querySelector(".box")?.classList.contains("resizing")
    ).toBe(false);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
