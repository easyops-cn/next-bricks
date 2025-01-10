import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent } from "@testing-library/react";
import "./";
import type { EoContextMenu } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const lockBodyScroll = jest.fn();

customElements.define(
  "basic.lock-body-scroll",
  class extends HTMLElement {
    resolve = lockBodyScroll;
  }
);

customElements.define(
  "eo-actions",
  class extends HTMLElement {
    actions?: unknown[];
  }
);

jest
  .spyOn(document.documentElement, "clientWidth", "get")
  .mockImplementation(() => 800);
jest
  .spyOn(document.documentElement, "clientHeight", "get")
  .mockImplementation(() => 600);

describe("eo-context-menu", () => {
  test("basic usage", async () => {
    const onActionClick = jest.fn();
    const element = document.createElement("eo-context-menu") as EoContextMenu;
    element.addEventListener("action.click", (e: Event) =>
      onActionClick((e as CustomEvent).detail)
    );

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(lockBodyScroll).toBeCalledTimes(1);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(1, element, false);

    element.open({ position: [10, 20] });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(true);
    expect(lockBodyScroll).toBeCalledTimes(2);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(2, element, true);

    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style
        .left
    ).toBe("10px");
    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style.top
    ).toBe("20px");

    // Click on an action
    act(() => {
      fireEvent(
        element.shadowRoot!.querySelector("eo-actions")!,
        new CustomEvent("action.click", { detail: { event: "a.click" } })
      );
    });
    expect(onActionClick).toBeCalledWith({
      event: "a.click",
    });

    // Closed after action click
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(false);
    expect(lockBodyScroll).toBeCalledTimes(3);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(3, element, false);

    // Re-open again
    element.open({ position: [20, 30] });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(true);
    expect(lockBodyScroll).toBeCalledTimes(4);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(4, element, true);

    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style
        .left
    ).toBe("20px");
    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style.top
    ).toBe("30px");

    // Closed after mask click
    // Click on an action
    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector(".mask")!);
    });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(false);
    expect(lockBodyScroll).toBeCalledTimes(5);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(5, element, false);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("fix position", async () => {
    const element = document.createElement("eo-context-menu") as EoContextMenu;

    act(() => {
      document.body.appendChild(element);
    });

    element.shadowRoot!.querySelector("eo-actions")!.getBoundingClientRect =
      jest.fn(() => ({
        width: 180,
        height: 120,
      })) as any;

    element.open({ position: [700, 500] });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(true);

    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style
    ).toMatchObject({
      left: "512px",
      top: "472px",
      visibility: "visible",
    });

    element.shadowRoot!.querySelector("eo-actions")!.getBoundingClientRect =
      jest.fn(() => ({
        width: 900,
        height: 70,
      })) as any;

    element.open({ position: [700, 500] });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(true);

    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style
    ).toMatchObject({
      left: "700px",
      top: "500px",
      visibility: "visible",
    });

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("item draggable", async () => {
    const onItemDragStart = jest.fn();
    const onItemDragEnd = jest.fn();
    const element = document.createElement("eo-context-menu") as EoContextMenu;
    element.addEventListener("item.drag.start", (e: Event) =>
      onItemDragStart((e as CustomEvent).detail)
    );

    element.addEventListener("item.drag.end", (e: Event) =>
      onItemDragEnd((e as CustomEvent).detail)
    );

    act(() => {
      document.body.appendChild(element);
    });

    act(() => {
      fireEvent(
        element.shadowRoot!.querySelector("eo-actions")!,
        new CustomEvent("item.drag.start", {
          detail: { text: "item", dragConf: { key: "text", data: {} } },
        })
      );
    });
    expect(onItemDragStart).toBeCalledWith({
      text: "item",
      dragConf: { key: "text", data: {} },
    });

    act(() => {
      fireEvent(
        element.shadowRoot!.querySelector("eo-actions")!,
        new CustomEvent("item.drag.end", {
          detail: { text: "item", dragConf: { key: "text", data: {} } },
        })
      );
    });
    expect(onItemDragEnd).toBeCalledWith({
      text: "item",
      dragConf: { key: "text", data: {} },
    });
  });
});
