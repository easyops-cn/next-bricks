import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
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

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.innerHTML).toBe("<div>无数据</div>");

    act(() => {
      document.body.removeChild(element);
    });
  });
});
