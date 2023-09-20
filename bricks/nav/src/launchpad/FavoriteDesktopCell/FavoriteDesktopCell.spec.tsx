import React from "react";
import { render, fireEvent, createEvent } from "@testing-library/react";
import type { Link } from "@next-bricks/basic/link";
import { FavoriteDesktopCell } from "./FavoriteDesktopCell.js";

jest.mock("../LaunchpadService", () => {
  return {
    launchpadService: {
      pushVisitor: jest.fn(),
      setAsFavorite: jest.fn(),
      isFavorite: () => false,
      setFavoriteAsVisitor: jest.fn(),
    },
  };
});
const spyOnWindowOpen = (window.open = jest.fn());

describe("FavoriteDesktopCell", () => {
  it("should work", () => {
    const item = {
      microAppId: "hello",
      launchpadCollection: {
        type: "microApp",
        instanceId: "hello",
        name: "world",
        link: "/home",
        icon: {
          category: "app",
          icon: "default-app",
          lib: "easyops",
          prefix: "",
          theme: "",
          type: "",
        },
      } as any,
    };
    const { container, rerender } = render(<FavoriteDesktopCell item={item} />);

    expect(container.querySelector("eo-icon")?.getAttribute("icon")).toEqual(
      "default-app"
    );
    expect(container.querySelector(".name")?.innerHTML).toBe("world");

    const mockEvent = createEvent.click(
      container.querySelector("eo-link") as HTMLElement
    );

    fireEvent.click(
      container.querySelector("eo-link") as HTMLElement,
      mockEvent
    );
    expect(
      (container.querySelector("eo-link") as Link).getAttribute("url")
    ).toBe("/home");
    expect(mockEvent.defaultPrevented).toBeFalsy();

    const newItem = {
      customItemId: "custom1",
      launchpadCollection: {
        type: "customItem",
        instanceId: "hello",
        name: "custom item 1",
        link: "https://www.baidu.com",
        icon: {
          category: "app",
          icon: "default-app",
          lib: "easyops",
          prefix: "",
          theme: "",
          type: "",
        },
      } as any,
    };

    rerender(<FavoriteDesktopCell item={newItem} />);
    expect(
      (container.querySelector("eo-link") as Link).getAttribute("url")
    ).toBe("https://www.baidu.com");
    const newMockEvent = createEvent.click(
      container.querySelector("eo-link") as HTMLElement
    );

    fireEvent(container.querySelector("eo-link") as HTMLElement, newMockEvent);

    expect(newMockEvent.defaultPrevented).toBeTruthy();
    expect(spyOnWindowOpen).toHaveBeenCalledWith(
      "https://www.baidu.com",
      "_blank"
    );
  });
});
