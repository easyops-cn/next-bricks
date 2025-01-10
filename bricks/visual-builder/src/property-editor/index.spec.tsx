import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { PropertyEditor } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("antd", () => ({}));
jest.mock("@formily/antd-v5", () => ({}));

describe("visual-builder.property-editor", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.property-editor"
    ) as PropertyEditor;

    element.editorName = "eo-button-editor";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.innerHTML).toBe("");

    act(() => {
      document.body.removeChild(element);
    });
  });
});
