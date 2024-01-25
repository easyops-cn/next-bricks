import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { WorkbenchSidebar } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("visual-builder.workbench-sidebar", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.workbench-sidebar"
    ) as WorkbenchSidebar;

    const span1 = document.createElement("span");
    span1.setAttribute("slot", "");
    (span1 as any).active = true;

    const span2 = document.createElement("span");
    span2.setAttribute("slot", "");

    element.appendChild(span1);
    element.appendChild(span2);
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      element.titleLabel = "title";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(span1.style.flex).toEqual("1");
    expect(span2.style.flex).toEqual("0 1 auto");

    act(() => {
      document.body.removeChild(element);
    });
  });
});
