import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import type { LaunchpadConfig } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

class WithShadowElement extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    shadow.append(slot);
  }
}

customElements.define(
  "eo-icon",
  class extends HTMLElement {
    lib: any;
    icon: any;
    theme: any;
    prefix: any;
    category: any;
  }
);

customElements.define(
  "eo-link",
  class extends WithShadowElement {
    url: any;
  }
);

customElements.define(
  "eo-dropdown-actions",
  class extends WithShadowElement {
    actions: any[] = [];
  }
);

describe("nav.launchpad-config", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "nav.launchpad-config"
    ) as LaunchpadConfig;
    element.menuGroups = [
      {
        instanceId: "g-1",
        name: "My Group",
        items: [
          {
            instanceId: "i-2",
            type: "app",
            name: "My App",
          },
        ],
      },
    ] as any;
    element.actions = [
      {
        event: "add-menu-item",
        text: "Add Menu Item",
      },
    ];
    const onActionClick = jest.fn();
    element.addEventListener("action.click", onActionClick);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    fireEvent(
      element.shadowRoot?.querySelector("eo-dropdown-actions") as HTMLElement,
      new CustomEvent("visible.change", { detail: true })
    );
    expect(onActionClick).toBeCalledTimes(0);
    fireEvent(
      element.shadowRoot?.querySelector("eo-dropdown-actions") as HTMLElement,
      new CustomEvent("action.click")
    );
    expect(onActionClick).toBeCalledTimes(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("menu config", async () => {
    const element = document.createElement(
      "nav.launchpad-config"
    ) as LaunchpadConfig;
    element.menuGroups = [
      {
        instanceId: "g-1",
        name: "My Group",
        items: [
          {
            instanceId: "i-2",
            id: "my-app",
            type: "app",
            name: "My App",
          },
          {
            instanceId: "i-3",
            id: "my-custom",
            type: "custom",
            name: "My Custom",
            url: "http://localhost/next/my-custom",
          },
          {
            instanceId: "i-4",
            id: "my-custom-2",
            type: "custom",
            name: "My External Custom",
            url: "http://example.com/next/external-custom",
          },
        ],
      },
    ] as any;
    element.variant = "menu-config";
    element.urlTemplate = "/test/{{ id }}";
    element.customUrlTemplate = "/custom?url={{ __pathname }}";
    act(() => {
      document.body.appendChild(element);
    });

    expect(
      element.shadowRoot?.querySelectorAll("eo-dropdown-actions").length
    ).toBe(0);
    expect(
      element.shadowRoot
        ?.querySelectorAll(".menu-item")[0]
        .classList.contains("disabled")
    ).toBe(false);
    expect(
      element.shadowRoot
        ?.querySelectorAll(".menu-item")[1]
        .classList.contains("disabled")
    ).toBe(false);
    expect(
      element.shadowRoot
        ?.querySelectorAll(".menu-item")[2]
        .classList.contains("disabled")
    ).toBe(true);
    expect(
      element.shadowRoot?.querySelectorAll(".menu-item eo-link")[0]
    ).toHaveProperty("url", "/test/my-app");
    expect(
      element.shadowRoot?.querySelectorAll(".menu-item eo-link")[1]
    ).toHaveProperty("url", "/custom?url=%2Fnext%2Fmy-custom");
    expect(
      element.shadowRoot?.querySelectorAll(".menu-item eo-link")[2]
    ).toHaveProperty("url", "");

    act(() => {
      document.body.removeChild(element);
    });
  });
});
