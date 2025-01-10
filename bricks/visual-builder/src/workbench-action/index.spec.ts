import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./index.js";
import type { WorkbenchAction } from "./index.js";

class WithShadowElement extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    shadow.append(slot);
  }
}

customElements.define("eo-link", class extends WithShadowElement {});
customElements.define("eo-icon", class extends HTMLElement {});

describe("visual-builder.workbench-action", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "visual-builder.workbench-action"
    ) as WorkbenchAction;

    element.icon = {
      lib: "antd",
      icon: "search",
    };
    element.active = true;
    element.to = "/test";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot.querySelector(".active")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });

    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
