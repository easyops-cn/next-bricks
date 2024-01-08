import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ".";
import type { EoDirectoryTreeInternalNode } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

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
        element.shadowRoot?.querySelector(
          ".tree-item-expandable-content"
        ) as HTMLDivElement
      );
    });
    expect(onExpand).toBeCalledWith(
      expect.objectContaining({
        detail: true,
      })
    );
    expect(element.expanded).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
