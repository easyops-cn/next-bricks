import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./index.jsx";
import { CabinetNode } from "./index.jsx";

describe("data-view.cabinet-node", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.cabinet-node"
    ) as CabinetNode;

    element.type = "container-group";
    element.nodeTitle = "容器组";
    element.status = "faded";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(element.shadowRoot.querySelector(".node-title").textContent).toBe(
      "容器组"
    );
    expect(
      new Set(element.shadowRoot.querySelector(".container").classList).has(
        "type-container-group"
      )
    ).toBe(true);
    expect(
      new Set(element.shadowRoot.querySelector(".container").classList).has(
        "status-faded"
      )
    ).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("isAlert is true", async () => {
    const element = document.createElement(
      "data-view.cabinet-node"
    ) as CabinetNode;

    element.type = "physical-machine";
    element.nodeTitle = "虚拟机";
    element.status = "active";
    element.isAlert = true;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(element.shadowRoot.querySelector(".node-title").textContent).toBe(
      "虚拟机"
    );
    expect(
      new Set(element.shadowRoot.querySelector(".container").classList).has(
        "type-physical-machine"
      )
    ).toBe(true);
    expect(
      new Set(element.shadowRoot.querySelector(".container").classList).has(
        "status-active"
      )
    ).toBe(true);
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
