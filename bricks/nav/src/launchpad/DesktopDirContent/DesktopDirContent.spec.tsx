import React from "react";
import { render, act, createEvent, fireEvent } from "@testing-library/react";
import { DesktopDirContent } from "./DesktopDirContent.js";
import { NormalizedDesktopDir } from "../interfaces.js";
import * as desktopDirContext from "../DesktopDirContext.js";
import * as launchpadSettingsContext from "../LaunchpadSettingsContext.js";

const mockHistoryPush = jest.fn();
jest.mock("@next-core/runtime", () => ({
  getHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const spyOnSetDesktopDir = jest.fn();
jest.spyOn(desktopDirContext, "useDesktopDirContext").mockReturnValue({
  setDesktopDir: spyOnSetDesktopDir,
});
jest.mock("../LaunchpadService", () => {
  return {
    launchpadService: {
      isFavorite: () => true,
    },
  };
});
jest
  .spyOn(launchpadSettingsContext, "useLaunchpadSettingsContext")
  .mockReturnValue({
    columns: 2,
    rows: 2,
  });
describe("Shallow DesktopDirContent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should work", () => {
    const dir: NormalizedDesktopDir = {
      name: "hello",
      items: [
        {
          type: "app",
          id: "hello",
          app: {
            id: "hello",
            name: "world",
          } as any,
        },
      ],
    };
    const { container } = render(
      <DesktopDirContent
        dir={dir}
        coordinates={{ x: 1, y: 2 }}
        arrowWidthPercent={9}
        activeIndex={-1}
      />
    );
    expect(container.querySelectorAll(".cellWrapper").length).toBe(1);

    const stopPropagation = jest.fn();
    const mockEvent = createEvent.click(
      container.querySelector(".dirContainer") as HTMLElement
    );
    mockEvent.stopPropagation = stopPropagation;
    act(() => {
      fireEvent(
        container.querySelector(".dirContainer") as HTMLElement,
        mockEvent
      );
    });

    expect(stopPropagation).toBeCalled();
    expect(spyOnSetDesktopDir).toBeCalledWith(undefined);
  });
});

describe("Mount DesktopDirContent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const props = {
    dir: {
      name: "hello",
      items: [
        {
          type: "app",
          id: "a",
          app: {
            id: "a",
            name: "A",
          },
        },
        {
          type: "app",
          id: "b",
          app: {
            id: "b",
            name: "B",
          },
        },
        {
          type: "custom",
          id: "c",
          name: "C",
          url: "/c",
        },
      ],
    },
    coordinates: { x: 1, y: 2 },
    arrowWidthPercent: 9,
  } as any;

  it.each<[number, string, number]>([
    [-1, "ArrowRight", 0],
    [-1, "ArrowDown", 0],
    [-1, "ArrowLeft", 2],
    [-1, "ArrowUp", 2],
    [0, "a", 0],
    [1, "ArrowRight", 2],
    [1, "ArrowDown", 1],
    [1, "ArrowLeft", 0],
    [1, "ArrowUp", 1],
  ])(
    "when active index is %d and press %s, new active should be %d",
    (activeIndex, key, index) => {
      const { container, rerender } = render(
        <DesktopDirContent {...props} activeIndex={activeIndex} />
      );
      act(() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key,
          })
        );
      });
      rerender(<DesktopDirContent {...props} activeIndex={activeIndex} />);
      expect(
        container
          .querySelectorAll(".cellItem")
          [index].classList.contains("active")
      ).toBe(true);
    }
  );

  // Todo(steve): isolated document event listeners.
  /* it("should handle Enter keydown", () => {
    mount(
      <DesktopDirContent
        {...props}
        activeIndex={-1}
      />
    );
    document.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter"
    }));
    expect(spyOnHistoryPush).not.toBeCalled();
  }); */

  it("should handle Escape keydown", () => {
    render(<DesktopDirContent {...props} activeIndex={-1} />);
    const escapeKeyDown = new KeyboardEvent("keydown", {
      key: "Escape",
    });
    const stopPropagation = jest.spyOn(escapeKeyDown, "stopPropagation");
    const preventDefault = jest.spyOn(escapeKeyDown, "preventDefault");
    document.dispatchEvent(escapeKeyDown);
    expect(stopPropagation).toBeCalled();
    expect(preventDefault).toBeCalled();
    expect(spyOnSetDesktopDir).toBeCalledWith(undefined);
  });
});
