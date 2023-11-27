import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import type { EoSearchLaunchpad } from "./index.js";
import { initializeI18n } from "@next-core/i18n";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import { LaunchpadApi_listCollectionV2 } from "@next-api-sdk/user-service-sdk";

jest.mock("@next-core/theme", () => ({}));
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

getLaunchpadInfo.mockResolvedValue({
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

describe("eo-search-launchpad", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-search-launchpad"
    ) as EoSearchLaunchpad;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelectorAll(".spinner").length).toBe(1);

    await act(async () => {
      fireEvent.focus(
        element.shadowRoot?.querySelector(".search-input") as HTMLInputElement
      );
      await (global as any).flushPromises();
    });
    expect(element.shadowRoot?.querySelectorAll(".spinner").length).toBe(0);
    expect(
      element.shadowRoot?.querySelectorAll(".menu-groups > li").length
    ).toBe(1);
    expect(element.shadowRoot?.querySelectorAll(".menu > li").length).toBe(4);
    expect(
      element.shadowRoot
        ?.querySelector(".search-clear")
        ?.classList.contains("searching")
    ).toBe(false);

    act(() => {
      fireEvent.change(
        element.shadowRoot?.querySelector(".search-input") as HTMLInputElement,
        {
          target: {
            value: "foo",
          },
        }
      );
    });
    expect(
      element.shadowRoot
        ?.querySelector(".search-clear")
        ?.classList.contains("searching")
    ).toBe(true);

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".search-clear") as HTMLElement
      );
    });
    expect(
      element.shadowRoot
        ?.querySelector(".search-clear")
        ?.classList.contains("searching")
    ).toBe(false);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
