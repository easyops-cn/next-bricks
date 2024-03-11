import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { TreeSelectBrick } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/react-runtime");

describe("eo-tree-select", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-tree-select") as TreeSelectBrick;
    expect(element.shadowRoot).toBeFalsy();

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
