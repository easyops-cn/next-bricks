import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { act } from "react";
import "./";
import type { EoLaunchpadRecentVisits } from "./index.js";
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

describe("eo-launchpad-recent-visits", () => {
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

    const element = document.createElement(
      "eo-launchpad-recent-visits"
    ) as EoLaunchpadRecentVisits;

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll(".recent-visits > li").length
    ).toBe(2);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
