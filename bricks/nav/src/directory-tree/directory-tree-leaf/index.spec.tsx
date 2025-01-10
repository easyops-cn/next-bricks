import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react";
import ".";
import type { EoDirectoryTreeLeaf } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

customElements.define(
  "eo-icon",
  class extends HTMLElement {
    lib: any;
    icon: any;
  }
);

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
        element.shadowRoot?.querySelector(".tree-item") as HTMLDivElement
      );
    });
    expect(onSelect).toBeCalled();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("with icon", async () => {
    const element = document.createElement(
      "eo-directory-tree-leaf"
    ) as EoDirectoryTreeLeaf;
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
