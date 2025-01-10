import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./index.jsx";
import { AppWallRelationLine } from "./index.jsx";

describe("data-view.app-wall-relation-line", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.app-wall-relation-line"
    ) as AppWallRelationLine;

    element.lightColor = "purple";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(new Set(element.shadowRoot.querySelector(".relation-line").classList).has("light-color-purple")).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
