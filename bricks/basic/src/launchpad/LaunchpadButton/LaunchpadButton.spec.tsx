import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { getRuntime, getHistory } from "@next-core/runtime";
import { LaunchpadButton } from "./LaunchpadButton.js";
jest.mock("@next-core/runtime");

type ListenerFn = () => void;

const listeners = new Set<ListenerFn>();
const spyOnHistoryUnListen = jest.fn();
const spyOnHistoryListen = jest.fn((listener: ListenerFn): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    spyOnHistoryUnListen();
  };
});
(getHistory as jest.Mock).mockReturnValue({
  listen: spyOnHistoryListen,
});

const spyOnToggleLaunchpadEffect = jest.fn();
const spyOnIsMenuBarCollapsed = jest.fn();
const spyOnIsMenuBarSoftExpanded = jest.fn();
(getRuntime as jest.Mock).mockReturnValue({
  menuBar: {
    isCollapsed: spyOnIsMenuBarCollapsed,
    isSoftExpanded: spyOnIsMenuBarSoftExpanded,
  },
  toggleLaunchpadEffect: spyOnToggleLaunchpadEffect,
});
jest.mock("../LaunchpadService.js", () => {
  return {
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
  };
});

describe("LaunchpadButton", () => {
  it("should work", async () => {
    const { container } = render(<LaunchpadButton />);
    expect(document.body.innerHTML).toEqual(
      '<div><a role="button" class="launchpadLink"><svg class="launchpadIcon" width="16" height="16">launchpad.svg</svg></a></div><div></div>'
    );

    expect(document.querySelector(".launchpadContainer")).toBeFalsy();
    fireEvent.click(container.querySelector("a") as HTMLElement);
    expect(document.querySelector(".launchpadContainer")).toBeTruthy();
  });
});
