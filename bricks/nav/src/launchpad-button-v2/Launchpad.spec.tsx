import React from "react";
import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { render, fireEvent } from "@testing-library/react";
import { getRuntime } from "@next-core/runtime";
import { initializeI18n } from "@next-core/i18n";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import {
  LaunchpadApi_createCollection,
  LaunchpadApi_deleteCollection,
  LaunchpadApi_listCollection,
} from "@next-api-sdk/user-service-sdk";
import { Launchpad } from "./Launchpad.js";

jest.mock("@next-core/runtime");
jest.mock("@next-api-sdk/micro-app-standalone-sdk");
jest.mock("@next-api-sdk/user-service-sdk");

const getLaunchpadInfo = LaunchpadApi_getLaunchpadInfo as jest.Mock<any>;
const listCollection = LaunchpadApi_listCollection as jest.Mock<any>;
const mockGetRuntime = getRuntime as jest.Mock<any>;

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

listCollection.mockResolvedValue({
  list: [
    {
      microAppId: "instances",
      launchpadCollection: {
        type: "microApp",
      },
    },
    {
      microAppId: "not-existed",
      launchpadCollection: {
        type: "microApp",
      },
    },
    {
      launchpadCollection: {
        type: "microApp",
      },
    },
    {
      launchpadCollection: {
        type: "custom",
      },
    },
  ],
});

describe("Launchpad", () => {
  test("standalone", async () => {
    window.STANDALONE_MICRO_APPS = true;
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
                  id: "unknown",
                },
                {
                  type: "custom",
                  id: "cmdb-extends",
                  name: "CMDB 扩展",
                },
              ],
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
      ],
    });

    const { container, rerender } = render(<Launchpad active />);

    expect(container.querySelectorAll(".spinner").length).toBe(1);
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(container.querySelectorAll(".spinner").length).toBe(0);
    expect(container.querySelectorAll(".sidebar-menu > li").length).toBe(1);
    expect(container.querySelectorAll(".menu-groups > li").length).toBe(1);
    expect(container.querySelectorAll(".menu > li").length).toBe(3);

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
    window.STANDALONE_MICRO_APPS = false;
  });

  test("non-standalone", async () => {
    mockGetRuntime.mockReturnValueOnce({
      getDesktops() {
        return [];
      },
      getCurrentApp() {
        return {
          id: "hello",
          name: "Hello",
        };
      },
    });
    const { container } = render(<Launchpad active />);

    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(container.querySelectorAll(".spinner").length).toBe(0);
  });
});
