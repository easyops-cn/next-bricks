import { describe, test, expect } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react";
import "./index.js";
import { WorkbenchPane } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("visual-builder.workbench-pane", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.workbench-pane"
    ) as WorkbenchPane;
    const spyOnDispatchEvent = jest.spyOn(element, "dispatchEvent");
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.badge = 3;
      element.active = true;
      element.titleLabel = "title";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(element.shadowRoot.querySelector(".badge").textContent).toEqual("3");

    act(() => {
      fireEvent.click(element.shadowRoot.querySelector(".pane-header"));
    });

    expect(element.active).toEqual(false);

    act(() => {
      fireEvent.click(element.shadowRoot.querySelector(".pane-header"));
    });

    expect((spyOnDispatchEvent.mock.calls[0][0] as CustomEvent).type).toEqual(
      "active.change"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });
});
