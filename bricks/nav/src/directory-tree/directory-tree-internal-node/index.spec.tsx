import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react";
import ".";
import type { EoDirectoryTreeInternalNode } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

customElements.define(
  "eo-icon",
  class extends HTMLElement {
    lib: any;
    icon: any;
  }
);

describe("eo-directory-tree-internal-node", () => {
  test("basic usage", async () => {
    const onExpand = jest.fn();
    const element = document.createElement(
      "eo-directory-tree-internal-node"
    ) as EoDirectoryTreeInternalNode;
    const label = document.createElement("span");
    label.textContent = "label";
    label.slot = "label";
    const children = document.createElement("span");
    children.textContent = "children";

    element.appendChild(label);
    element.appendChild(children);
    element.addEventListener("expand", onExpand);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".tree-item") as HTMLDivElement
      );
    });
    expect(onExpand).toBeCalledWith(
      expect.objectContaining({
        detail: true,
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("selectable", async () => {
    const onExpand = jest.fn();
    const onSelect = jest.fn();
    const element = document.createElement(
      "eo-directory-tree-internal-node"
    ) as EoDirectoryTreeInternalNode;
    element.selectable = true;

    const label = document.createElement("span");
    label.textContent = "label";
    label.slot = "label";
    const children = document.createElement("span");
    children.textContent = "children";

    element.appendChild(label);
    element.appendChild(children);
    element.addEventListener("expand", onExpand);
    element.addEventListener("select", onSelect);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".tree-item") as HTMLDivElement
      );
    });
    expect(onSelect).toBeCalled();

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(
          ".tree-item-expand-button"
        ) as HTMLDivElement
      );
    });
    expect(onExpand).toBeCalledWith(
      expect.objectContaining({
        detail: true,
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("with icon", async () => {
    const element = document.createElement(
      "eo-directory-tree-internal-node"
    ) as EoDirectoryTreeInternalNode;
    element.textContent = "Label A";
    element.icon = {
      lib: "antd",
      icon: "plus",
    };

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelector("eo-icon")).toHaveProperty(
      "icon",
      "plus"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });
});
