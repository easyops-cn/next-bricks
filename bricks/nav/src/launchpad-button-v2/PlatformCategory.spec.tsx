import React from "react";
import { describe, test, expect, jest } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import {
  PlatformCategorySidebarMenuItem,
  PlatformItem,
} from "./PlatformCategory.jsx";

class WithShadowElement extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    shadow.append(slot);
  }
}

customElements.define(
  "eo-icon",
  class extends WithShadowElement {
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
    //
  }
);

describe("PlatformCategory", () => {
  test("PlatformCategorySidebarMenuItem", async () => {
    const onClick = jest.fn();

    const { container } = render(
      <PlatformCategorySidebarMenuItem
        item={{
          id: "cmdb",
          name: "CMDB",
          icon: {
            lib: "easyops",
            category: "app",
            icon: "all-cmdb",
          },
          items: [],
        }}
        active
        onClick={onClick}
      />
    );
    expect(
      container.querySelector("eo-link")?.classList.contains("active")
    ).toBe(true);

    fireEvent.click(container.querySelector("eo-link") as HTMLElement);
    expect(onClick).toBeCalled();
  });

  test("PlatformItem", async () => {
    const { container } = render(
      <PlatformItem
        item={{
          type: "app",
          id: "visual-builder",
          name: "Visual Builder",
          menuIcon: {
            lib: "easyops",
            category: "app",
            icon: "visual-builder",
          },
          description: "description",
          instanceId: "instanceId",
          url: "/visual-builder",
        }}
      />
    );
    expect(container.querySelector("eo-link")?.getAttribute("url")).toBe(
      "/visual-builder"
    );
  });
});
