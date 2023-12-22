import React from "react";
import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { render, fireEvent } from "@testing-library/react";
import { initializeI18n } from "@next-core/i18n";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import { LaunchpadApi_listCollectionV2 } from "@next-api-sdk/user-service-sdk";
import { InstanceApi_postSearchV3 } from "@next-api-sdk/cmdb-sdk";
import { Launchpad } from "./Launchpad.js";
import * as runtime from "@next-core/runtime";

jest.mock("@next-core/runtime");
jest.mock("@next-api-sdk/micro-app-standalone-sdk");
jest.mock("@next-api-sdk/user-service-sdk");
jest.mock("@next-api-sdk/cmdb-sdk");

const getFeatureFlags = jest.fn();
jest.spyOn(runtime, "getRuntime").mockReturnValue({
  getFeatureFlags: getFeatureFlags.mockReturnValue({
    "launchpad-show-app-category": true,
  }),
} as any);

const getLaunchpadInfo = LaunchpadApi_getLaunchpadInfo as jest.Mock<any>;
const listCollectionV2 = LaunchpadApi_listCollectionV2 as jest.Mock<any>;
const postSearchV3 = InstanceApi_postSearchV3 as jest.Mock<any>;

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

postSearchV3.mockResolvedValue({
  list: [
    {
      icon: {
        icon: "insert-row-right",
        lib: "antd",
        theme: "outlined",
      },
      id: "cmdb",
      name: "CMDB",
      order: 2,
      platformApps: [
        {
          "@": {
            order: 3,
          },
          _object_id: "_INSTALLED_MICRO_APP",
          appId: "k8s",
          homepage: "/k8s",
          menuIcon: {
            category: "model",
            icon: "kubernetes",
            lib: "easyops",
          },
          name: "K8S集群管理",
        },
        {
          "@": {
            order: 4,
          },
          _object_id: "_INSTALLED_MICRO_APP",
          appId: "message-subscribe",
          homepage: "/message-subscribe",
          locales: {
            en: {
              name: "Message Subscribe",
            },
            zh: {
              name: "消息订阅",
            },
          },
          menuIcon: {
            category: "app",
            icon: "message-subscribe",
            lib: "easyops",
          },
          name: "消息订阅",
        },
        {
          "@": {
            order: 1,
          },
          _object_id: "_INSTALLED_MICRO_APP",
          appId: "container",
          homepage: "/container",
          locales: {},
          menuIcon: {
            category: "app",
            icon: "container",
            lib: "easyops",
          },
          name: "容器部署",
        },
      ],
      platformItems: [
        {
          "@": {
            order: 2,
          },
          _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
          id: "baidu",
          menuIcon: {
            icon: "apple-alt",
            lib: "fa",
            prefix: "fas",
          },
          name: "百度",
          url: "https://baidu.com/",
        },
        {
          "@": {
            order: 6,
          },
          _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
          id: "dev",
          name: "dev",
          url: "https://dev.easyops.local/next/visual-builder",
        },
        {
          "@": {
            order: 5,
          },
          _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
          id: "sit",
          name: "sit",
          url: "https://sit.easyops.local/next/visual-builder",
        },
      ],
      type: "platform",
    },
    {
      icon: {
        icon: "pic-right",
        lib: "antd",
        theme: "outlined",
      },
      id: "lowCode",
      name: "LowCode",
      order: 1,
      platformApps: [
        {
          _object_id: "_INSTALLED_MICRO_APP",
          appId: "monitor-alarm-notice",
          homepage: "/legacy/monitor-alarm-notice",
          menuIcon: {
            category: "app",
            icon: "monitor-alarm-notice",
            lib: "easyops",
          },
          name: "告警事件",
        },
        {
          "@": {
            order: 1,
          },
          _object_id: "_INSTALLED_MICRO_APP",
          appId: "monitor-auto-recovery",
          homepage: "/legacy/monitor-auto-recovery",
          menuIcon: {
            category: "app",
            icon: "monitor-auto-recovery",
            lib: "easyops",
          },
          name: "故障自愈",
        },
        {
          "@": {
            order: 2,
          },
          _object_id: "_INSTALLED_MICRO_APP",
          appId: "monitor-alarm-rule",
          homepage: "/legacy/monitor-alarm-rule",
          menuIcon: {
            category: "app",
            icon: "monitor-alarm-rule",
            lib: "easyops",
          },
          name: "告警策略",
        },
      ],
      platformItems: [],
      type: "platform",
    },
    {
      icon: {
        icon: "right-square",
        lib: "antd",
        theme: "outlined",
      },
      id: "devOps",
      name: "DevOps",
      platformApps: [],
      platformItems: [
        {
          _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
          id: "github",
          name: "github",
          url: "https://github.com",
        },
        {
          "@": {
            order: 1,
          },
          _object_id: "DESKTOP_CUSTOM_ITEM@EASYOPS",
          id: "gitlab",
          name: "gitlab",
          url: "https://gitlab.com",
        },
      ],
      type: "platform",
    },
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

    const { getByText, container, rerender } = render(<Launchpad active />);

    expect(container.querySelectorAll(".spinner").length).toBe(1);
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(container.querySelectorAll(".spinner").length).toBe(0);
    expect(
      container.querySelectorAll(".sidebar-menu.quick-nav-menu > li").length
    ).toBe(3);
    expect(
      container.querySelectorAll(".sidebar-menu.platform-nav-menu > li").length
    ).toBe(4);
    expect(container.querySelectorAll(".menu-groups > li").length).toBe(1);
    expect(container.querySelectorAll(".menu > li").length).toBe(4);
    expect(container.querySelectorAll(".recent-visits > li").length).toBe(2);
    expect(container.querySelectorAll(".platform-items").length).toBe(0);

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

    fireEvent.click(getByText("DevOps"));
    rerender(<Launchpad active />);
    expect(container.querySelectorAll(".platform-items > li").length).toBe(2);

    rerender(<Launchpad active={false} />);

    getLaunchpadInfo.mockReset();
  });
});
