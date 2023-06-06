import React from "react";
import { render } from "@testing-library/react";
import { Desktop } from "./Desktop.js";
import { DesktopData } from "../interfaces.js";
import { MicroApp } from "@next-core/types";

jest.mock("@next-core/runtime", () => {
  return {
    getRuntime: () => ({
      getMicroApps: (): MicroApp => ({
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
    }),
    getAuth: jest.fn().mockReturnValue({ org: "8888" }),
  };
});
jest.mock("../LaunchpadService", () => {
  return {
    launchpadService: {},
  };
});
describe("Desktop", () => {
  it("should work", () => {
    const desktopData: DesktopData = {
      items: [
        {
          type: "app",
          id: "hello",
          app: {
            id: "hello",
            name: "world",
            localeName: "world",
          },
        },
        {
          type: "app",
          id: "nihap",
          app: {
            id: "nihap",
            name: "shijie",
            localeName: "shijie",
          },
        },
      ],
    } as any;
    const { container } = render(
      <Desktop
        desktop={desktopData}
        desktopCount={2}
        arrowWidthPercent={9}
        activeIndex={1}
      />
    );
    expect(
      container.querySelectorAll(".cellWrapper")[0]?.innerHTML
    ).toMatchInlineSnapshot(
      `"<div class="cellItem undefined"><basic.general-link class="appLink undefined square"><img class="appIcon" src="default-app-icon.png"></basic.general-link><span class="appName">world</span></div>"`
    );
    expect(
      container.querySelectorAll(".cellWrapper")[1]?.innerHTML
    ).toMatchInlineSnapshot(
      `"<div class="cellItem undefined active"><basic.general-link class="appLink undefined square"><img class="appIcon" src="default-app-icon.png"></basic.general-link><span class="appName">shijie</span></div>"`
    );
  });
});
