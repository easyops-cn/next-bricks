import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/dom";
import { getRuntime } from "@next-core/runtime";
import "./";
import { EoMainView } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const disconnect = jest.fn();
(global.IntersectionObserver as any) = jest.fn((callback: any) => ({
  observe() {
    callback([{ intersectionRatio: 0.99 }]);
  },
  disconnect,
}));

jest.mock("@next-core/runtime", () => ({
  getRuntime: jest.fn(() => ({
    getBrandSettings() {
      return {};
    },
  })),
}));

describe("eo-main-view", () => {
  beforeEach(() => {
    document.documentElement.dataset.mode = "default";
  });

  test("basic usage", () => {
    const element = document.createElement("eo-main-view") as EoMainView;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "narrow",
      "full"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("narrow", () => {
    const element = document.createElement("eo-main-view") as EoMainView;
    element.narrow = "medium";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "narrow",
      "medium"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("banner alone", () => {
    const element = document.createElement("eo-main-view") as EoMainView;
    element.bannerAlone = true;
    element.bannerTitle = "Hello";
    element.bannerDescription = "World";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "bannerTitle",
      "Hello"
    );
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "bannerDescription",
      "World"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("showBanner", async () => {
    const element = document.createElement("eo-main-view") as EoMainView;

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("eo-banner")).toBeTruthy();

    element.showBanner = false;
    await act(() => (global as any).flushPromises());
    expect(element.shadowRoot?.querySelector("eo-banner")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("footer", async () => {
    const element = document.createElement("eo-main-view") as EoMainView;

    act(() => {
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot?.querySelector(".footer").classList.contains("pinned")
    ).toBe(false);

    element.showFooter = true;
    await act(() => (global as any).flushPromises());
    expect(
      element.shadowRoot?.querySelector(".footer").classList.contains("pinned")
    ).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("dashboard mode: basic usage", async () => {
    document.documentElement.dataset.mode = "dashboard";
    const element = document.createElement("eo-main-view") as EoMainView;

    const onDashboardExit = jest.fn();
    element.addEventListener("dashboard.exit", onDashboardExit);

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <eo-banner
          narrow="full"
        >
          <div
            class="breadcrumb"
          >
            <slot
              name="breadcrumb"
            />
          </div>
          <div
            class="titlebar dashboard"
          >
            <div
              class="dashboard-logo"
            >
              <svg>
                logo.svg
              </svg>
            </div>
            <div
              class="dashboard-title-before"
            />
            <div
              class="page-title"
            >
              <slot
                name="pageTitle"
              />
            </div>
            <div
              class="dashboard-title-after"
            />
            <div
              class="toolbar"
            >
              <slot
                name="toolbar"
              />
            </div>
            <a
              class="dashboard-exit"
              role="button"
            >
              <svg
                aria-hidden="true"
                data-icon="poweroff"
                fill="currentColor"
                focusable="false"
                height="1em"
                viewBox="64 64 896 896"
                width="1em"
              >
                <path
                  d="M705.6 124.9a8 8 0 00-11.6 7.2v64.2c0 5.5 2.9 10.6 7.5 13.6a352.2 352.2 0 0162.2 49.8c32.7 32.8 58.4 70.9 76.3 113.3a355 355 0 0127.9 138.7c0 48.1-9.4 94.8-27.9 138.7a355.92 355.92 0 01-76.3 113.3 353.06 353.06 0 01-113.2 76.4c-43.8 18.6-90.5 28-138.5 28s-94.7-9.4-138.5-28a353.06 353.06 0 01-113.2-76.4A355.92 355.92 0 01184 650.4a355 355 0 01-27.9-138.7c0-48.1 9.4-94.8 27.9-138.7 17.9-42.4 43.6-80.5 76.3-113.3 19-19 39.8-35.6 62.2-49.8 4.7-2.9 7.5-8.1 7.5-13.6V132c0-6-6.3-9.8-11.6-7.2C178.5 195.2 82 339.3 80 506.3 77.2 745.1 272.5 943.5 511.2 944c239 .5 432.8-193.3 432.8-432.4 0-169.2-97-315.7-238.4-386.7zM480 560h64c4.4 0 8-3.6 8-8V88c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8z"
                />
              </svg>
            </a>
          </div>
          <div
            class="banner"
          >
            <slot
              name="banner"
            />
          </div>
        </eo-banner>,
        <eo-narrow-view
          class="content"
          size="full"
        >
          <slot />
        </eo-narrow-view>,
        <div
          class="footer"
        >
          <eo-narrow-view
            size="full"
          >
            <slot
              name="footer"
            />
          </eo-narrow-view>
        </div>,
      ]
    `);

    fireEvent.click(element.shadowRoot!.querySelector(".dashboard-exit"));
    expect(onDashboardExit).toHaveBeenCalledTimes(1);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("dashboard mode: no logo nor exit", async () => {
    document.documentElement.dataset.mode = "dashboard";
    const element = document.createElement("eo-main-view") as EoMainView;
    element.showDashboardLogo = false;
    element.showDashboardExit = false;

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <eo-banner
          narrow="full"
        >
          <div
            class="breadcrumb"
          >
            <slot
              name="breadcrumb"
            />
          </div>
          <div
            class="titlebar dashboard"
          >
            <div
              class="dashboard-title-before"
            />
            <div
              class="page-title"
            >
              <slot
                name="pageTitle"
              />
            </div>
            <div
              class="dashboard-title-after"
            />
            <div
              class="toolbar"
            >
              <slot
                name="toolbar"
              />
            </div>
          </div>
          <div
            class="banner"
          >
            <slot
              name="banner"
            />
          </div>
        </eo-banner>,
        <eo-narrow-view
          class="content"
          size="full"
        >
          <slot />
        </eo-narrow-view>,
        <div
          class="footer"
        >
          <eo-narrow-view
            size="full"
          >
            <slot
              name="footer"
            />
          </eo-narrow-view>
        </div>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("dashboard mode customized logo url", async () => {
    document.documentElement.dataset.mode = "dashboard";
    (getRuntime as jest.Mock).mockReturnValueOnce({
      getBrandSettings() {
        return { dashboard_mode_logo_url: "custom.png" };
      },
    });

    const element = document.createElement("eo-main-view") as EoMainView;

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelector("img")?.getAttribute("src")).toBe(
      "custom.png"
    );
    expect(element.shadowRoot?.querySelector(".dashboard-logo svg")).toBe(null);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
