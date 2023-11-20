import React from "react";
import { describe, test, expect, jest } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import { MenuGroup } from "./MenuGroup";
import { DesktopItem } from "../launchpad/interfaces";
import { ConfigMenuGroup } from "./interfaces";

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
    //
  }
);

customElements.define(
  "eo-dropdown-actions",
  class extends WithShadowElement {
    actions: any[] = [];
  }
);

describe("MenuGroup", () => {
  test("basic usage", async () => {
    const group: ConfigMenuGroup = {
      instanceId: "g-1",
      id: "my-group",
      name: "My Group",
      items: [
        {
          instanceId: "i-2",
          type: "app",
          id: "cmdb-instances",
          name: "实例管理",
          url: "/cmdb-instances",
        },
        {
          instanceId: "i-3",
          type: "custom",
          id: "foo",
          name: "Bar",
          url: "/foo",
        },
        {
          instanceId: "i-4",
          type: "dir",
          id: "extends",
          name: "扩展",
          items: [
            {
              instanceId: "i-5",
              type: "app",
              id: "dir-cmdb-app",
              name: "Dir APP",
              url: "/dir-cmdb-app",
            },
            {
              instanceId: "i-6",
              type: "custom",
              id: "dir-cmdb-custom",
              name: "Dir Custom",
              url: "/dir-cmdb-custom",
            },
          ],
        },
      ],
    };
    const actions = [
      {
        event: "add-menu-item",
        text: "Add Menu Item",
      },
    ];
    const onActionClick = jest.fn();

    const getComponent = () => (
      <MenuGroup data={group} actions={actions} onActionClick={onActionClick} />
    );

    const { container, getByText, rerender } = render(getComponent());

    // 文件夹展开/折叠
    expect(getByText("扩展").nextElementSibling).toHaveProperty("icon", "down");
    fireEvent.click(getByText("扩展").parentElement as HTMLElement);
    rerender(getComponent());
    expect(getByText("扩展").nextElementSibling).toHaveProperty("icon", "up");

    expect(
      container
        .querySelector(".folder .menu-config")
        ?.classList.contains("active")
    ).toBe(false);
    fireEvent(
      container.querySelector(".folder eo-dropdown-actions") as HTMLElement,
      new CustomEvent("visible.change", { detail: true })
    );
    rerender(getComponent());
    expect(
      container
        .querySelector(".folder .menu-config")
        ?.classList.contains("active")
    ).toBe(true);

    expect(onActionClick).toBeCalledTimes(0);
    fireEvent(
      container.querySelector(".folder eo-dropdown-actions") as HTMLElement,
      new CustomEvent("action.click")
    );
    expect(onActionClick).toBeCalledTimes(1);
  });
});
