import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import ".";
import type { EoLaunchpadQuickAccess } from "./index.jsx";
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
  desktops: [],
  storyboards: [],
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

describe("eo-launchpad-quick-access", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-launchpad-quick-access"
    ) as EoLaunchpadQuickAccess;

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelectorAll(".sidebar-menu-item").length
    ).toBe(3);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
