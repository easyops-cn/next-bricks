import React from "react";
import "./";
import { act } from "@testing-library/react";
import { LaunchpadButton } from "./index.js";
jest.mock("@next-core/theme", () => ({}));

import { getRuntime, getHistory } from "@next-core/runtime";

jest.mock("@next-core/runtime");

(getRuntime as jest.Mock).mockReturnValue({
  toggleLaunchpadEffect: jest.fn(),
});

(getHistory as jest.Mock).mockReturnValue({
  listen: jest.fn(),
});

jest.mock("./LaunchpadService.js", () => ({
  launchpadService: {
    fetchFavoriteList: () => [],
    preFetchLaunchpadInfo: () => null,
    getAllVisitors: (): any[] => [],
    setMaxVisitorLength: jest.fn(),
    getBaseInfo: () => ({
      settings: {
        columns: 7,
        rows: 4,
      },
      microApps: [],
      desktops: [],
      siteSort: [],
    }),
    init: (): any => ({}),
    getSitemapList: () => [],
  },
}));

describe("launchpad", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "basic.launchpad-button"
    ) as LaunchpadButton;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
