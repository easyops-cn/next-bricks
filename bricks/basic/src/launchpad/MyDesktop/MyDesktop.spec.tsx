import React from "react";
import { act } from "react-dom/test-utils";
import { render, fireEvent } from "@testing-library/react";
import { MyDesktop } from "./MyDesktop.js";
import { launchpadService } from "../LaunchpadService.js";

jest.mock("../LaunchpadService", () => {
  return {
    launchpadService: {
      fetchFavoriteList: jest.fn(),
      isFavorite: () => true,
      deleteFavorite: jest.fn(),
      getAllVisitors: () => {
        return [
          {
            id: "search",
            app: {
              name: "搜索中心",
              icons: { large: "icons/large.png" },
              localeName: "搜索中心",
              id: "search",
              homepage: "/search",
            },
            type: "app",
          },
          {
            id: "architecture",
            app: {
              name: "业务架构图",
              icons: null,
              localeName: "业务架构图",
              id: "architecture",
              homepage: "/architecture",
            },
            type: "app",
          },
          {
            id: "message-subscribe",
            app: {
              name: "消息订阅",
              icons: { large: "icons/large.png" },
              localeName: "消息订阅",
              id: "message-subscribe",
              homepage: "/message-subscribe",
            },
            type: "app",
          },
          {
            id: "developers",
            app: {
              name: "开发者中心",
              icons: { large: "icons/large.png" },
              localeName: "开发者中心",
              id: "developers",
              homepage: "/developers",
            },
            type: "app",
          },
          {
            type: "custom",
            id: "testnew",
            name: "新自定义项",
            position: 0,
            url: "https://www.yuque.com/uwintech",
            items: [],
          },
        ];
      },
      getSitemapList: () => [{ name: "资源管理", apps: [] }] as any,
    },
  };
});

describe("MyDesktop", () => {
  it("should work with favorite tab", async () => {
    (launchpadService.fetchFavoriteList as jest.Mock).mockReturnValueOnce([
      {
        launchpadCollection: {
          instanceId: "5b8ee4e5c352c",
          type: "microApp",
          name: "开发者中心",
          icon: {
            type: "",
            theme: "",
            icon: "developers",
            lib: "easyops",
            category: "app",
            prefix: "",
          },
          link: "/developers",
        },
        microAppId: "developers",
        customItemId: "",
      },
    ]);
    const { container } = render(
      <MyDesktop desktopCount={2} arrowWidthPercent={9} />
    );
    await act(async () => {
      fireEvent.click(container.querySelector(".modeIcon") as HTMLElement);
      await (global as any).flushPromises();
    });
    expect(container.querySelectorAll(".cellWrapper").length).toBe(6);
    expect(
      container.querySelector(".cellWrapper")?.innerHTML
    ).toMatchInlineSnapshot(
      `"<div class="cellItem small"><basic.general-link class="appLink small square" url="/search"><img class="appIcon" src="micro-apps/search/icons/large.png"></basic.general-link><span class="appName">搜索中心</span></div>"`
    );

    await act(async () => {
      await (global as any).flushPromises();
    });

    expect(
      container.querySelectorAll(".favoriteContainer .cellWrapper").length
    ).toBe(1);

    act(() => {
      fireEvent.click(container.querySelector(".modeIcon") as HTMLElement);
    });
    expect(container.querySelector(".header .title")?.textContent).toEqual(
      "系统地图"
    );

    // wrapper.find(DesktopCell).at(0).invoke("onSetAsFavorite")();
    // await act(async () => {
    //   await (global as any).flushPromises();
    // });
    // expect(launchpadService.fetchFavoriteList).toHaveBeenCalled();
  });

  it("should show prompt if empty favoriteList", async () => {
    (launchpadService.fetchFavoriteList as jest.Mock).mockReturnValueOnce([]);
    const { container } = render(
      <MyDesktop desktopCount={2} arrowWidthPercent={9} />
    );
    await act(async () => {
      fireEvent.click(container.querySelector(".modeIcon") as HTMLElement);
      await (global as any).flushPromises();
    });

    expect(container.querySelector(".emptyTips")?.innerHTML).toEqual(
      expect.stringContaining("把常用的页面链接加入收藏夹，方便快速访问 ~")
    );
  });
});
