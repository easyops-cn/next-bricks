import { describe, test, expect } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./index.js";
import { WorkbenchAction } from "./index.js";

describe("visual-builder.workbench-action", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.workbench-action"
    ) as WorkbenchAction;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.icon = {
        lib: "antd",
        icon: "search",
      };
      element.active = true;
      element.to = "/test";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(element.shadowRoot.querySelector(".active")).toBeTruthy();
  });
});
