import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ".";
import type { EoDirectoryTreeLeaf } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-directory-tree-leaf", () => {
  test("basic usage", async () => {
    const onSelect = jest.fn();
    const element = document.createElement(
      "eo-directory-tree-leaf"
    ) as EoDirectoryTreeLeaf;
    const label = document.createElement("span");
    label.textContent = "label";

    element.appendChild(label);
    element.addEventListener("select", onSelect);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(
          ".tree-item-selectable-content"
        ) as HTMLDivElement
      );
    });
    expect(onSelect).toBeCalled();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
