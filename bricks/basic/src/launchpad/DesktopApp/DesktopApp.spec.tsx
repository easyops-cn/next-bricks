import React from "react";
import { render, fireEvent, createEvent } from "@testing-library/react";
import { MicroApp } from "@next-core/types";
import { DesktopApp } from "./DesktopApp.js";
import { act } from "react-dom/test-utils";

jest.mock("@next-core/runtime", () => ({
  getRuntime: () => ({
    resetWorkspaceStack: jest.fn(),
  }),
}));

beforeEach(() => {
  window.STANDALONE_MICRO_APPS = false;
  window.PUBLIC_ROOT = "";
  window.PUBLIC_CDN = "";
});

describe("DesktopApp", () => {
  it("should work", () => {
    const stopPropagation = jest.fn();
    const handleClick = jest.fn();
    const handleAddClick = jest.fn();
    const app: MicroApp = {
      id: "hello",
      name: "世界",
      localeName: "world",
      homepage: "/hello",
      iconBackground: "circle",
    };
    const { container, rerender } = render(
      <DesktopApp
        app={app}
        onAddClick={handleAddClick}
        onClick={handleClick}
        showAddIcon={true}
        isFavorite={true}
      />
    );

    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "default-app-icon.png"
    );
    const mockEvent = createEvent.click(
      container.querySelector("basic\\.general-link") as HTMLElement
    );
    mockEvent.stopPropagation = stopPropagation;
    act(() => {
      fireEvent(
        container.querySelector("basic\\.general-link") as HTMLElement,
        mockEvent
      );
    });

    expect(stopPropagation).toBeCalled();
    expect(mockEvent.defaultPrevented).toBeFalsy();
    expect(handleClick).toBeCalled();

    expect(container.querySelector(".addIcon")).toBeTruthy();
    act(() => {
      fireEvent.click(container.querySelector(".addIcon") as HTMLElement);
    });
    expect(handleAddClick).toBeCalledTimes(1);

    rerender(
      <DesktopApp
        app={{
          ...app,
          installStatus: "running",
        }}
        onAddClick={handleAddClick}
        onClick={handleClick}
        showAddIcon={true}
        isFavorite={true}
      />
    );
    act(() => {
      fireEvent(
        container.querySelector("basic\\.general-link") as HTMLElement,
        mockEvent
      );
    });

    expect(stopPropagation).toBeCalledTimes(2);
    expect(mockEvent.defaultPrevented).toBeTruthy();
    expect(
      container.querySelectorAll("icons\\.general-icon")[1].getAttribute("icon")
    ).toBe("loading-3-quarters");
  });

  it("should render icon", () => {
    const app: MicroApp = {
      id: "hello",
      name: "世界",
      localeName: "world",
      homepage: "/hello",
      icons: {
        large: "icons/large.png",
      },
    };
    const { container, rerender } = render(<DesktopApp app={app} />);
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      `micro-apps/hello/icons/large.png`
    );

    rerender(
      <DesktopApp
        showAddIcon={true}
        isFavorite={true}
        app={{
          ...app,
          icons: {
            large: "http://a.com/b.jpg",
          },
          iconBackground: "square",
        }}
      />
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "http://a.com/b.jpg"
    );
    expect(
      container.querySelector(".addIcon")?.classList.contains("squareIcon")
    ).toEqual(true);
  });

  it("should render standalone-micro-apps icon", () => {
    window.STANDALONE_MICRO_APPS = true;
    const app1: MicroApp = {
      id: "hello",
      name: "世界",
      localeName: "world",
      homepage: "/hello",
      icons: {
        large: "icons/large.png",
      },
      currentVersion: "1.0.1",
      standaloneMode: true,
    };
    window.PUBLIC_ROOT = "/sa-static/";
    const { container: container1 } = render(<DesktopApp app={app1} />);
    expect(container1.querySelector("img")?.getAttribute("src")).toBe(
      `/sa-static/hello/versions/1.0.1/webroot/-/micro-apps/hello/icons/large.png`
    );

    const app2: MicroApp = {
      id: "hello",
      name: "世界",
      localeName: "world",
      homepage: "/hello",
      icons: {
        large: "icons/large.png",
      },
      currentVersion: "1.0.1",
      standaloneMode: false,
    };
    const { container: container2 } = render(<DesktopApp app={app2} />);
    expect(container2.querySelector("img")?.getAttribute("src")).toBe(
      `micro-apps/hello/icons/large.png`
    );
  });

  it("window.PUBLIC_ROOT and window.PUBLIC_CDN had value and url should be work", () => {
    window.STANDALONE_MICRO_APPS = true;
    window.PUBLIC_CDN = "/sa-static/app/1.0.2/";
    window.PUBLIC_ROOT = "/public_cdn/";
    const app1: MicroApp = {
      id: "hello",
      name: "世界",
      localeName: "world",
      homepage: "/hello",
      icons: {
        large: "icons/large.png",
      },
      currentVersion: "1.0.1",
      standaloneMode: false,
    };
    const { container: container1 } = render(<DesktopApp app={app1} />);
    expect(container1.querySelector("img")?.getAttribute("src")).toBe(
      `/sa-static/app/1.0.2/micro-apps/hello/icons/large.png`
    );

    window.STANDALONE_MICRO_APPS = false;

    const app2: MicroApp = {
      id: "hello",
      name: "世界",
      localeName: "world",
      homepage: "/hello",
      icons: {
        large: "icons/large.png",
      },
      currentVersion: "1.0.1",
    };
    const { container: container2 } = render(<DesktopApp app={app2} />);
    expect(container2.querySelector("img")?.getAttribute("src")).toBe(
      `/public_cdn/micro-apps/hello/icons/large.png`
    );
  });
});
