import React from "react";
import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { render, fireEvent } from "@testing-library/react";
import { initializeI18n } from "@next-core/i18n";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import {
  LaunchpadApi_createCollection,
  LaunchpadApi_deleteCollection,
  LaunchpadApi_listCollectionV2,
} from "@next-api-sdk/user-service-sdk";
import { Launchpad } from "./Launchpad.js";

jest.mock("@next-core/runtime");
jest.mock("@next-api-sdk/micro-app-standalone-sdk");
jest.mock("@next-api-sdk/user-service-sdk");

const getLaunchpadInfo = LaunchpadApi_getLaunchpadInfo as jest.Mock<any>;
const listCollectionV2 = LaunchpadApi_listCollectionV2 as jest.Mock<any>;

initializeI18n();

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

listCollectionV2.mockResolvedValue({
  list: [
    {
      type: "microApp",
      relatedApp: {
        appId: "instances",
        name: "实例",
      },
    },
    {
      type: "customItem",
      relatedCustomItem: {
        name: "Fav Custom",
      },
    },
    {
      type: "link",
      name: "Fav Link",
    },
    {},
  ],
});

describe("Launchpad", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("basic usage", async () => {
    localStorage.setItem(
      "brick-next-launchpad-recent-visits:undefined",
      JSON.stringify([
        { type: "app", id: "hello" },
        { type: "custom", id: "foo" },
      ])
    );
    getLaunchpadInfo.mockResolvedValueOnce({
      desktops: [
        {
          name: "CMDB",
          items: [
            {
              type: "app",
              id: "hello",
            },
            {
              type: "app",
              id: "unknown-1",
            },
            {
              type: "app",
              id: "empty-locales",
            },
            {
              type: "custom",
              id: "foo",
              name: "Bar",
            },
            {
              type: "dir",
              name: "extends",
              items: [
                {
                  type: "app",
                  id: "instances",
                },
                {
                  type: "app",
                  id: "unknown-2",
                },
                {
                  type: "custom",
                  id: "cmdb-extends",
                  name: "CMDB 扩展",
                },
                {
                  type: "unknown",
                },
              ],
            },
          ],
        },
        {
          name: "oops",
          items: [
            {
              type: "dir",
              name: "empty",
              items: [],
            },
          ],
        },
      ],
      storyboards: [
        {
          app: {
            id: "hello",
            name: "Hello",
            locales: {
              en: {
                name: "Hello",
              },
              zh: {
                name: "你好",
              },
            },
          },
        },
        {
          app: {
            id: "instances",
            name: "实例",
          },
        },
        {
          app: {
            id: "empty-locales",
            name: "空",
            locales: {},
          },
        },
      ],
    });

    const { container, rerender } = render(<Launchpad active />);

    expect(container.querySelectorAll(".spinner").length).toBe(1);
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(container.querySelectorAll(".spinner").length).toBe(0);
    expect(container.querySelectorAll(".sidebar-menu > li").length).toBe(3);
    expect(container.querySelectorAll(".menu-groups > li").length).toBe(1);
    expect(container.querySelectorAll(".menu > li").length).toBe(4);
    expect(container.querySelectorAll(".recent-visits > li").length).toBe(2);

    // Push recent visits
    fireEvent.click(
      container.querySelector(".recent-visits eo-link") as HTMLElement
    );

    expect(
      container.querySelector(".search-clear")?.classList.contains("searching")
    ).toBe(false);
    fireEvent.change(
      container.querySelector(".search-input") as HTMLInputElement,
      {
        target: {
          value: "foo",
        },
      }
    );
    rerender(<Launchpad active />);
    expect(
      container.querySelector(".search-clear")?.classList.contains("searching")
    ).toBe(true);

    fireEvent.click(container.querySelector(".search-clear") as HTMLElement);
    rerender(<Launchpad active />);
    expect(
      container.querySelector(".search-clear")?.classList.contains("searching")
    ).toBe(false);

    rerender(<Launchpad active={false} />);

    getLaunchpadInfo.mockReset();
  });
});
