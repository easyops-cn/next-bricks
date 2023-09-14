import React from "react";
import { describe, expect } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import { GroupView } from "./GroupItem.js";
import { SidebarMenuGroup } from "@next-shared/general/types";

describe("component test", () => {
  describe("GroupView", () => {
    it("should work", () => {
      (window as any).ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
      }));
      const groups = [
        {
          type: "group",
          title: "网络",
          items: [
            {
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
              instanceId: "6026b8b05e892",
              sort: 10,
              text: "交换机",
              to: "/network-device-resource-monitor/switch",
              type: "default",
              children: [],
              key: "1.3.0",
            },
            {
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
              instanceId: "6026b8b05e892",
              sort: 10,
              text: "主机",
              to: "/network-device-resource-monitor/host",
              type: "default",
              children: [],
              key: "1.4.0",
            },
            {
              instanceId: "6026b8b05e8f6",
              sort: 20,
              text: "报文",
              to: "/network-device-resource-monitor/message",
              type: "default",
              children: [],
              key: "1.4.1",
            },
            {
              instanceId: "6026b8b05e891",
              sort: 30,
              text: "EasyCore",
              to: "/network-device-resource-monitor/EasyCore",
              type: "default",
              children: [],
              key: "1.4.2",
            },
            {
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
      ];

      const onFavoriteFn = jest.fn();
      const { container } = render(
        <GroupView
          groupId="monitor"
          groups={groups as SidebarMenuGroup[]}
          onFavorite={onFavoriteFn}
        />
      );

      expect(container.querySelectorAll(".group").length).toEqual(1);

      expect(container.querySelectorAll(".custom-group").length).toEqual(1);
    });
  });
});
