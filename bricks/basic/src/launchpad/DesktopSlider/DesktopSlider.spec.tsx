import React from "react";
import {
  render,
  act,
  createEvent,
  fireEvent,
  screen,
} from "@testing-library/react";
import { getRuntime } from "@next-core/runtime";
import { MicroApp } from "@next-core/types";
import { DesktopSlider } from "./DesktopSlider.js";
import { Desktop } from "../Desktop/Desktop.js";
import { MyDesktop } from "../MyDesktop/MyDesktop.js";
import * as context from "../LaunchpadSettingsContext.js";
import { launchpadService } from "../LaunchpadService.js";
import { DesktopData } from "../interfaces.js";
jest.mock("@next-core/runtime", () => ({
  getRuntime: jest.fn(() => ({
    getFeatureFlags: jest.fn(() => ({
      "enable-my-desktop": true,
    })),
  })),
  getHistory: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const mockGetRuntime = getRuntime as jest.Mock;

jest.mock("../MyDesktop/MyDesktop");
jest.mock("../DesktopDirContext", () => {
  return {
    useDesktopDirContext: jest.fn().mockReturnValue({
      setDesktopDir: jest.fn(),
    }),
  };
});
jest.mock("../LaunchpadService.js", () => {
  return {
    launchpadService: {
      setMaxVisitorLength: jest.fn(),
      pushVisitor: jest.fn(),
      setAsFavorite: jest.fn(),
      isFavorite: () => false,
    },
  };
});
jest.spyOn(context, "useLaunchpadSettingsContext").mockReturnValue({
  columns: 2,
  rows: 2,
});

jest.mock("./desktopCursor.js", () => ({
  getRememberedDesktopCursor: () => 0,
  setRememberedDesktopCursor: jest.fn(),
}));

describe("Shallow FavoriteDesktopCell", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should work if props.desktops is undefined", async () => {
    const apps: MicroApp[] = [
      {
        id: "hello",
        name: "世界",
        localeName: "world",
        homepage: "/hello",
      },
      {
        id: "haha",
        name: "呵呵",
        localeName: "hehe",
        homepage: "/xixi",
      },
      {
        id: "oops",
        name: "糟糕",
        localeName: "oops",
        homepage: "/oops",
      },
      {
        id: "a",
        name: "a",
        localeName: "a",
        homepage: "/a",
      },
      {
        id: "b",
        name: "b",
        localeName: "b",
        homepage: "/b",
      },
    ];
    const { container, rerender } = render(
      <DesktopSlider microApps={apps} arrowWidthPercent={9} />
    );
    expect(container.querySelectorAll(".desktop").length).toBe(2);
    expect(await screen.findByText("MyDesktop")).toBeTruthy();
    expect(container.querySelectorAll(".desktopName").length).toBe(3);

    expect(container.querySelector(".arrowLeft")?.classList).not.toContain(
      "available"
    );
    expect(container.querySelector(".arrowRight")?.classList).toContain(
      "available"
    );

    // Slide to right
    const stopPropagation = jest.fn();
    const mockEvent = createEvent.click(
      container.querySelector(".arrowRight") as HTMLElement
    );
    mockEvent.stopPropagation = stopPropagation;
    await act(async () => {
      fireEvent(
        container.querySelector(".arrowRight") as HTMLElement,
        mockEvent
      );
      await jest.advanceTimersByTime(500);
    });
    expect(stopPropagation).toBeCalled();

    expect(container.querySelector(".arrowLeft")?.classList).toContain(
      "available"
    );
    expect(container.querySelector(".arrowRight")?.classList).toContain(
      "available"
    );
    await act(async () => {
      fireEvent.click(container.querySelector(".arrowRight") as HTMLElement);
      await jest.advanceTimersByTime(500);
    });

    expect(container.querySelector(".arrowRight")?.classList).not.toContain(
      "available"
    );

    expect(
      container.querySelector(".desktopList")?.getAttribute("style")
    ).toMatchInlineSnapshot(
      `"width: 300%; margin-left: -200%; transition: margin-left 400ms ease-out;"`
    );

    // // Slide to left when sliding is locked.
    await act(async () => {
      fireEvent.click(container.querySelector(".arrowLeft") as HTMLElement);
      await jest.advanceTimersByTime(500);
    });
    expect(
      container.querySelector(".desktopList")?.getAttribute("style")
    ).toMatchInlineSnapshot(
      `"width: 300%; margin-left: -100%; transition: margin-left 400ms ease-out;"`
    );

    await act(async () => {
      fireEvent.click(container.querySelector(".arrowLeft") as HTMLElement);
      await jest.advanceTimersByTime(500);
    });

    // Slide to left when sliding is unlocked.
    await act(async () => {
      fireEvent.click(container.querySelector(".arrowLeft") as HTMLElement);
      await jest.advanceTimersByTime(500);
    });
    expect(
      container.querySelector(".desktopList")?.getAttribute("style")
    ).toMatchInlineSnapshot(
      `"width: 300%; margin-left: 0%; transition: margin-left 400ms ease-out;"`
    );

    await act(async () => {
      fireEvent.click(container.querySelector(".desktopName") as HTMLElement);
      await jest.advanceTimersByTime(400);
    });
    expect(
      container.querySelector(".desktopList")?.getAttribute("style")
    ).toMatchInlineSnapshot(
      `"width: 300%; margin-left: 0%; transition: margin-left 400ms ease-out;"`
    );

    // Searching.
    rerender(<DesktopSlider microApps={apps} arrowWidthPercent={9} q="heh" />);
    expect(container.querySelector(".desktopSlider")?.classList).toContain(
      "filtered"
    );
    const filteredApps = container.querySelectorAll(
      ".filteredList .cellWrapper"
    );
    expect(filteredApps.length).toBe(1);
    expect(filteredApps[0]).toMatchInlineSnapshot(`
      <div
        class="cellWrapper"
      >
        <div
          class="cellItem undefined active"
        >
          <basic.general-link
            class="appLink undefined square"
            url="/xixi"
          >
            <img
              class="appIcon"
              src="default-app-icon.png"
            />
          </basic.general-link>
          <span
            class="appName"
          >
            hehe
          </span>
        </div>
      </div>
    `);

    // Searching match id too.
    rerender(<DesktopSlider microApps={apps} arrowWidthPercent={9} q="he" />);
    expect(
      container.querySelectorAll(".filteredList .cellWrapper").length
    ).toBe(2);

    // Wheeling
    await act(async () => {
      fireEvent.wheel(
        container.querySelector(".desktopSlider") as HTMLElement,
        {
          deltaX: 0,
          deltaY: 2,
        }
      );

      fireEvent.wheel(
        container.querySelector(".desktopSlider") as HTMLElement,
        {
          deltaX: 0,
          deltaY: 2,
        }
      );

      await jest.advanceTimersByTime(50);

      fireEvent.wheel(
        container.querySelector(".desktopSlider") as HTMLElement,
        {
          deltaX: -40,
          deltaY: 0,
        }
      );
    });

    // Todo(steve): make assertions.
  });

  it("should render desktops", () => {
    const apps: MicroApp[] = [
      {
        id: "hello",
        name: "world",
        homepage: "/hello",
      },
      {
        id: "haha",
        name: "hehe",
        homepage: "/xixi",
      },
      {
        id: "rest",
        name: "rest",
        homepage: "/rest",
      },
    ];
    const desktops: DesktopData[] = [
      {
        name: "MyDesktop One",
        items: [
          {
            type: "app",
            id: "hello",
          },
          {
            type: "app",
            id: "not-existed",
          },
          {
            type: "dir",
            id: "work",
            name: "wow",
            items: [
              {
                type: "app",
                id: "haha",
              },
              {
                type: "app",
                id: "not-existed",
              },
              {
                type: "custom",
                id: "inside-dir",
                name: "Inside Dir",
                url: "/inside/dir",
              },
              {
                type: "not-existed",
              } as any,
            ],
          },
          {
            type: "dir",
            id: "empty-dir",
            name: "Empty Dir",
            items: [],
          },
          {
            type: "custom",
            id: "custom-id",
            name: "Custom Name",
            url: "/custom/url",
          },
          {
            type: "not-existed",
          } as any,
        ],
      },
    ];
    const { container } = render(
      <DesktopSlider
        microApps={apps}
        desktops={desktops}
        arrowWidthPercent={9}
      />
    );
    expect(container.querySelectorAll(".desktop").length).toBe(1);
    expect(container.querySelector(".desktop")?.children.length).toBe(3);
  });
});

describe("Mount DesktopSlider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const apps: MicroApp[] = [
    {
      id: "hello",
      name: "世界",
      localeName: "world",
      homepage: "/hello",
    },
    {
      id: "haha",
      name: "呵呵",
      localeName: "hehe",
      homepage: "/xixi",
    },
    {
      id: "rest",
      name: "其它",
      localeName: "rest",
      homepage: "/rest",
    },
  ];
  const desktops: DesktopData[] = [
    {
      items: [
        {
          type: "app",
          id: "hello",
        },
        {
          type: "dir",
          id: "work",
          name: "wow",
          items: [
            {
              type: "app",
              id: "haha",
            },
          ],
        },
        {
          type: "app",
          id: "rest",
        },
      ],
    },
  ];

  it("active item with enter hotkey", () => {
    mockGetRuntime.mockReturnValue({
      getFeatureFlags: () => ({ "enable-my-desktop": true }),
      resetWorkspaceStack: jest.fn(),
    } as any);

    render(
      <DesktopSlider
        microApps={apps}
        desktops={desktops}
        arrowWidthPercent={9}
        q="hello"
      />
    );
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
        })
      );
    });
    expect(launchpadService.pushVisitor).toBeCalled();
  });

  it("query custom item should work", () => {
    const desktops: DesktopData[] = [
      {
        items: [
          {
            type: "app",
            id: "hello",
          },
          {
            type: "dir",
            id: "work",
            name: "wow",
            items: [
              {
                type: "app",
                id: "haha",
              },
              {
                type: "custom",
                id: "sailor",
                name: "测试一",
                url: "/sailor-test",
              },
            ],
          },
          {
            type: "app",
            id: "rest",
          },
        ],
      },
    ];

    const { container } = render(
      <DesktopSlider
        microApps={apps}
        desktops={desktops}
        q="sailor"
        arrowWidthPercent={9}
      />
    );

    expect(container.querySelector(".desktop")?.lastChild)
      .toMatchInlineSnapshot(`
      <div
        class="cellWrapper"
      >
        <div
          class="cellItem undefined"
        >
          <basic.general-link
            class="appLink undefined square"
            url="/rest"
          >
            <img
              class="appIcon"
              src="default-app-icon.png"
            />
          </basic.general-link>
          <span
            class="appName"
          >
            rest
          </span>
        </div>
      </div>
    `);
  });
});
