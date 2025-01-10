import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./index.js";
import { WorkbenchTreeElement } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("visual-builder.workbench-sidebar", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.workbench-tree"
    ) as WorkbenchTreeElement;

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
