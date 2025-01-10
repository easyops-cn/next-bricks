import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { DesktopCell } from "./DesktopCell.js";
import { DesktopCustom } from "../DesktopCustom/DesktopCustom.js";
import { launchpadService } from "../LaunchpadService.js";
import { DesktopApp } from "../DesktopApp/DesktopApp.js";
import type { DesktopItem, DesktopItemCustom } from "../interfaces.js";
import { act } from "react";
import { MicroApp } from "@next-core/types";

jest.mock("../LaunchpadService", () => {
  return {
    launchpadService: {
      pushVisitor: jest.fn(),
      setAsFavorite: jest.fn(),
      isFavorite: () => false,
      getFavoritesLength: () => 16,
    },
  };
});
describe("DesktopCell", () => {
  it("should work with app", () => {
    const item: DesktopItem = {
      type: "app",
      id: "hello",
      app: {
        id: "hello",
        name: "world",
        localeName: "world",
      } as any,
    };
    const { container } = render(
      <DesktopCell item={item} showAddIcon={true} isFavorite={true} />
    );

    expect(container.querySelector(".appName")?.textContent).toBe("world");
    expect(
      container.querySelector(".cellItem")?.classList.contains("hasClass")
    ).toBe(false);

    act(() => {
      fireEvent.click(container.querySelector("eo-link") as HTMLElement);
      fireEvent.click(container.querySelector("eo-icon") as HTMLElement);
    });
    expect(launchpadService.pushVisitor).toHaveBeenCalledWith("app", item.app);
    expect(launchpadService.setAsFavorite).toHaveBeenCalledWith({
      microAppId: item.id,
      launchpadCollection: {
        type: "microApp",
        name: (item.app as MicroApp).name,
      },
    });
  });

  it("should render a dir", () => {
    const item: DesktopItem = {
      type: "dir",
      id: "hello",
      name: "world",
      items: [
        {
          type: "app",
          id: "nihao",
          app: {
            id: "nihao",
            name: "shijie",
          } as any,
        },
      ],
    };
    const { container } = render(<DesktopCell item={item} active={true} />);
    expect(container.querySelector(".dirName")?.textContent).toBe("world");
    expect(
      container.querySelector(".cellItem")?.classList.contains("active")
    ).toBe(true);
  });

  it("should work with custom item", () => {
    const item: DesktopItemCustom = {
      type: "custom",
      id: "hello",
      name: "world",
      url: "/hello",
    };
    const { container } = render(
      <DesktopCell
        item={item}
        showAddIcon={true}
        isFavorite={true}
        position={"left"}
      />
    );
    expect(container.querySelector(".appName")?.textContent).toBe("world");
    expect(
      container.querySelector(".cellItem")?.classList.contains("active")
    ).toBe(false);

    act(() => {
      fireEvent.click(container.querySelector("eo-link") as HTMLElement);
      fireEvent.click(container.querySelector("eo-icon") as HTMLElement);
    });
    expect(launchpadService.pushVisitor).toHaveBeenCalledWith("custom", item);
    expect(launchpadService.setAsFavorite).toHaveBeenCalledWith({
      customItemId: "hello",
      launchpadCollection: {
        name: "world",
        type: "customItem",
      },
    });
  });
});
