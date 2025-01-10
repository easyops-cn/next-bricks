import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent } from "@testing-library/react";
import "./";
import type { GenerateSnippetsContextMenu } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const lockBodyScroll = jest.fn();

customElements.define(
  "basic.lock-body-scroll",
  class extends HTMLElement {
    resolve = lockBodyScroll;
  }
);

jest
  .spyOn(document.documentElement, "clientWidth", "get")
  .mockImplementation(() => 800);
jest
  .spyOn(document.documentElement, "clientHeight", "get")
  .mockImplementation(() => 600);

describe("visual-builder.generate-snippets-context-menu", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.generate-snippets-context-menu"
    ) as GenerateSnippetsContextMenu;

    element.options = [
      {
        title: "分类一",
        children: [
          {
            text: "item1",
            tooltip: "选项一",
          },
          {
            text: "item2",
            tooltip: "选项二",
          },
        ],
      },
    ];

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(lockBodyScroll).toBeCalledTimes(1);
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    element.open({ position: [10, 20] });

    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(true);

    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector(".mask")!);
    });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(false);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("fix position", async () => {
    const element = document.createElement(
      "visual-builder.generate-snippets-context-menu"
    ) as GenerateSnippetsContextMenu;

    act(() => {
      document.body.appendChild(element);
    });

    element.shadowRoot!.querySelector(".container")!.getBoundingClientRect =
      jest.fn(() => ({
        width: 180,
        height: 120,
      })) as any;

    element.open({ position: [700, 500] });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(true);

    expect(
      (element.shadowRoot!.querySelector(".container") as HTMLElement).style
    ).toMatchObject({
      left: "512px",
      top: "472px",
      visibility: "visible",
    });

    element.shadowRoot!.querySelector(".container")!.getBoundingClientRect =
      jest.fn(() => ({
        width: 900,
        height: 70,
      })) as any;

    element.open({ position: [700, 500] });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(true);

    expect(
      (element.shadowRoot!.querySelector(".container") as HTMLElement).style
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
    const element = document.createElement(
      "visual-builder.generate-snippets-context-menu"
    ) as GenerateSnippetsContextMenu;

    element.options = [
      {
        title: "分类一",
        children: [
          {
            text: "item",
            dragConf: { format: "text/plain", data: {} },
          },
        ],
      },
    ];

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
      fireEvent.dragStart(element.shadowRoot!.querySelector("eo-menu-item"));
    });
    expect(onItemDragStart).toBeCalledWith({
      text: "item",
      dragConf: { format: "text/plain", data: {} },
    });

    act(() => {
      fireEvent.dragEnd(element.shadowRoot!.querySelector("eo-menu-item"));
    });
    expect(onItemDragEnd).toBeCalledWith({
      text: "item",
      dragConf: { format: "text/plain", data: {} },
    });
  });
});
