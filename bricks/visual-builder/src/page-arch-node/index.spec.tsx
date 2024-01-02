import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./";
import type { PageArchNode } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("visual-builder.page-arch-node", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.page-arch-node"
    ) as PageArchNode;
    element.label = "Page A";
    const onLabelEditingChange = jest.fn();
    element.addEventListener("label.editing.change", (e) =>
      onLabelEditingChange((e as CustomEvent).detail)
    );
    const onLabelChange = jest.fn();
    element.addEventListener("label.change", (e) =>
      onLabelChange((e as CustomEvent).detail)
    );
    const onChildAppend = jest.fn();
    element.addEventListener("child.append", (e) =>
      onChildAppend((e as CustomEvent).detail)
    );

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <div
          class="node page"
        >
          <input
            class="label-input"
            value="Page A"
          />
          <div
            class="label"
          >
            Page A
          </div>
          <div
            class="thumbnail-container"
          >
            <eo-icon
              icon="ellipsis"
              lib="antd"
            />
          </div>
        </div>,
        <div
          class="add-button"
          role="button"
        >
          <eo-icon
            icon="plus"
            lib="fa"
          />
        </div>,
      ]
    `);

    // Enable editing label
    expect(
      element.shadowRoot
        ?.querySelector(".node")
        ?.classList.contains("editing-label")
    ).toBe(false);
    act(() => {
      fireEvent.dblClick(element.shadowRoot?.querySelector(".label"));
    });
    expect(
      element.shadowRoot
        ?.querySelector(".node")
        ?.classList.contains("editing-label")
    ).toBe(true);
    expect(onLabelEditingChange).toBeCalledTimes(1);
    expect(onLabelEditingChange).toBeCalledWith(true);

    // Rename label
    act(() => {
      fireEvent.change(element.shadowRoot?.querySelector(".label-input"), {
        target: { value: "New Name" },
      });
    });
    expect(element.shadowRoot?.querySelector(".label")?.textContent).toBe(
      "New Name"
    );

    // Unrelated keydown
    act(() => {
      fireEvent.keyDown(element.shadowRoot?.querySelector(".label-input"), {
        key: "ArrowRight",
      });
    });
    expect(onLabelChange).toBeCalledTimes(0);

    act(() => {
      fireEvent.keyDown(element.shadowRoot?.querySelector(".label-input"), {
        key: "Enter",
      });
    });
    expect(onLabelChange).toBeCalledTimes(1);
    expect(onLabelChange).toBeCalledWith("New Name");

    act(() => {
      fireEvent.click(element.shadowRoot?.querySelector(".add-button"));
    });
    expect(onChildAppend).toBeCalledTimes(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
  test("type board", async () => {
    const element = document.createElement(
      "visual-builder.page-arch-node"
    ) as PageArchNode;
    element.type = "board";
    element.label = "Board B";
    element.autoFocusOnce = "id-1";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot?.querySelector(".node")?.classList.contains("board")
    ).toBe(true);

    // Auto focus
    await act(() => new Promise((resolve) => setTimeout(resolve, 1)));
    expect(
      element.shadowRoot
        ?.querySelector(".node")
        ?.classList.contains("editing-label")
    ).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
