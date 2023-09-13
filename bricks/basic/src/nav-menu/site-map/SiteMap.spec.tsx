import React from "react";
import { describe, expect } from "@jest/globals";

import { act, render, screen, fireEvent } from "@testing-library/react";
import {
  SiteMapItem,
  isValidDragAction,
  findDropElement,
} from "./SiteMapItem.js";
import { collectService } from "./CollectService.js";
import { SidebarMenuGroup } from "@next-shared/general/types";
jest.useFakeTimers();

jest.mock("./CollectService.js", () => ({
  collectService: {
    getFavoritesById: jest.fn(),
    isCollected: jest.fn(() => false),
  },
}));

describe("siteMap test", () => {
  (window as any).ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
  it("should work with no favorites data", () => {
    (collectService.getFavoritesById as jest.Mock).mockReturnValueOnce([]);
    const menuGroup = {
      title: "服务",
      type: "group",
      groupId: "resource",
      childLayout: "siteMap",
      items: [
        {
          type: "group",
          title: "网络",
          items: [
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              defaultExpanded: false,
              exact: false,
              icon: {
                category: "second-menu",
                icon: "loadbalance-second-menu",
                lib: "easyops",
              },
              instanceId: "6026b7c20c8cf",
              sort: 0,
              text: "负载均衡策略",
              to: "/network-resource-monitor/loadbalance",
              type: "default",
              children: [],
              key: "1.2.0",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              defaultExpanded: false,
              exact: false,
              icon: {
                category: "second-menu",
                icon: "alibaba-cloud-elastic-public-ip-second-menu",
                lib: "easyops",
              },
              instanceId: "6026b7c20c933",
              sort: 0,
              text: "阿里云・弹性公网IP",
              to: "/network-resource-monitor/ali-eip",
              type: "default",
              children: [],
              key: "1.2.1",
            },
          ],
          key: "1.2",
        },
        {
          type: "group",
          title: "网络设备",
          items: [
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              exact: false,
              instanceId: "6026b8b05e892",
              sort: 10,
              text: "交换机",
              to: "/network-device-resource-monitor/switch",
              type: "default",
              children: [],
              key: "1.3.0",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              exact: false,
              instanceId: "6026b8b05e8f6",
              sort: 20,
              text: "路由器",
              to: "/network-device-resource-monitor/router",
              type: "default",
              children: [],
              key: "1.3.1",
            },
          ],
          key: "1.3",
        },
        {
          type: "group",
          title: "自定义监控",
          groupFrom: "monitor",
          items: [
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              exact: false,
              instanceId: "6026b8b05e892",
              sort: 10,
              text: "主机",
              to: "/network-device-resource-monitor/host",
              type: "default",
              children: [],
              key: "1.4.0",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              exact: false,
              instanceId: "6026b8b05e8f6",
              sort: 20,
              text: "报文",
              to: "/network-device-resource-monitor/message",
              type: "default",
              children: [],
              key: "1.4.1",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              exact: false,
              instanceId: "6026b8b05e891",
              sort: 30,
              text: "EasyCore",
              to: "/network-device-resource-monitor/EasyCore",
              type: "default",
              children: [],
              key: "1.4.2",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              exact: false,
              instanceId: "6026b8b05e8f7",
              sort: 40,
              text: "视图",
              to: "/network-device-resource-monitor/view",
              type: "default",
              children: [],
              key: "1.4.3",
            },
          ],
          key: "1.4",
        },
      ] as any as SidebarMenuGroup[],
    } as SidebarMenuGroup;
    render(<SiteMapItem menuGroup={menuGroup} />);

    expect(screen.getByText("NO_DATA_TIPS_IN_QUICK_ACCESS")).toBeTruthy();
  });

  it("should work with search", async () => {
    (collectService.getFavoritesById as jest.Mock).mockReturnValueOnce([
      { text: "主机", to: "/host" },
    ]);

    const menuGroup = {
      title: "服务",
      type: "group",
      groupId: "resource",
      childLayout: "siteMap",
      items: [
        {
          type: "group",
          title: "网络",
          items: [
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              defaultExpanded: false,
              exact: false,
              icon: {
                category: "second-menu",
                icon: "loadbalance-second-menu",
                lib: "easyops",
              },
              instanceId: "6026b7c20c8cf",
              sort: 0,
              text: "负载均衡策略",
              to: "/network-resource-monitor/loadbalance",
              type: "default",
              children: [],
              key: "1.2.0",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              defaultExpanded: false,
              exact: false,
              icon: {
                category: "second-menu",
                icon: "alibaba-cloud-elastic-public-ip-second-menu",
                lib: "easyops",
              },
              instanceId: "6026b7c20c933",
              sort: 0,
              text: "阿里云・弹性公网IP",
              to: "/network-resource-monitor/ali-eip",
              type: "default",
              children: [],
              key: "1.2.1",
            },
          ],
          key: "1.2",
        },
        {
          type: "group",
          title: "网络设备",
          items: [
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              defaultExpanded: false,
              exact: false,
              instanceId: "6026b8b05e892",
              sort: 10,
              text: "交换机",
              to: "/network-device-resource-monitor/switch",
              type: "default",
              children: [],
              key: "1.3.0",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              defaultExpanded: false,
              exact: false,
              instanceId: "6026b8b05e8f6",
              sort: 20,
              text: "路由器",
              to: "/network-device-resource-monitor/router",
              type: "default",
              children: [],
              key: "1.3.1",
            },
          ],
          key: "1.3",
        },
        {
          type: "group",
          title: "自定义监控",
          groupFrom: "monitor",
          items: [
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              exact: false,
              instanceId: "6026b8b05e892",
              sort: 10,
              text: "主机",
              to: "/network-device-resource-monitor/host",
              type: "default",
              children: [],
              key: "1.4.0",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              exact: false,
              instanceId: "6026b8b05e8f6",
              sort: 20,
              text: "报文",
              to: "/network-device-resource-monitor/message",
              type: "default",
              children: [],
              key: "1.4.1",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              defaultExpanded: false,
              exact: false,
              instanceId: "6026b8b05e891",
              sort: 30,
              text: "EasyCore",
              to: "/network-device-resource-monitor/EasyCore",
              type: "default",
              children: [],
              key: "1.4.2",
            },
            {
              activeExcludes: [],
              activeIncludes: [],
              activeMatchSearch: false,
              defaultExpanded: false,
              exact: false,
              instanceId: "6026b8b05e8f7",
              sort: 40,
              text: "视图",
              to: "/network-device-resource-monitor/view",
              type: "default",
              children: [],
              key: "1.4.3",
            },
          ],
          key: "1.4",
        },
      ] as any as SidebarMenuGroup[],
    } as SidebarMenuGroup;
    const { container } = render(<SiteMapItem menuGroup={menuGroup} />);

    const input = container.querySelector("eo-input") as Element;

    act(() => {
      fireEvent(input, new CustomEvent("change", { detail: "主机" }));
    });

    expect(container.querySelector(".tag-text")?.textContent).toEqual("主机");

    act(() => {
      fireEvent(input, new CustomEvent("change", { detail: "notExited" }));
    });

    jest.advanceTimersByTime(500);

    expect(container.querySelector(".no-data-tips")?.textContent).toEqual(
      undefined
    );
  });

  it("test drag action", async () => {
    const div = document.createElement("div");
    div.dataset.text = "主机";
    div.dataset.to = "/cmdb";

    const div2 = document.createElement("div");
    div2.dataset.text = "监控";
    div2.dataset.to = "/custom";

    expect(isValidDragAction(div, div2)).toEqual(true);

    div2.dataset.text = "主机";
    div2.dataset.to = "/cmdb";

    expect(isValidDragAction(div, div2)).toEqual(false);
  });

  it("test findDropElement", () => {
    const div = document.createElement("div");
    div.draggable = true;

    const span = document.createElement("span");
    div.appendChild(span);

    expect(findDropElement(span)).toEqual(div);
  });
});
