import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { getRuntime } from "@next-core/runtime";
import { MicroApp } from "@next-core/types";
import { Launchpad } from "./Launchpad.js";
import { SearchBar } from "../SearchBar/SearchBar.js";
import { DesktopSlider } from "../DesktopSlider/DesktopSlider.js";
import { DesktopData } from "../../launchpad/interfaces.js";

jest.mock("@next-core/runtime");
jest.mock("../SearchBar/SearchBar.js");
jest.mock("../DesktopSlider/DesktopSlider.js");
jest.mock("../FavoriteDesktopCell/FavoriteDesktopCell.js");
jest.mock("../LaunchpadService.js", () => {
  return {
    launchpadService: {
      fetchFavoriteList: (): any[] => [],
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
    },
  };
});

(getRuntime as jest.Mock).mockReturnValue({
  getMicroApp: (): MicroApp => ({
    id: "a",
    name: "a",
    homepage: "/a",
    icons: {
      large: "a.svg",
    },
  }),
  getDesktops: (): DesktopData[] => [
    {
      items: [],
    },
  ],
  getLaunchpadSettings: () => ({
    columns: 5,
    rows: 4,
  }),
});

describe("Launchpad", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle close", () => {
    const handleWillClose = jest.fn();
    const { container } = render(<Launchpad onWillClose={handleWillClose} />);
    fireEvent.click(container.querySelector(".launchpad") as HTMLElement);
    expect(handleWillClose).toBeCalled();
  });

  it("should handle Escape keydown", () => {
    const handleWillClose = jest.fn();
    render(<Launchpad onWillClose={handleWillClose} />);
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "a",
      })
    );
    expect(handleWillClose).not.toBeCalled();
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
      })
    );
    expect(handleWillClose).toBeCalled();
  });
});
