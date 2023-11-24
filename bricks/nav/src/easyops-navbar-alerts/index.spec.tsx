import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { auth } from "@next-core/easyops-runtime";
import { fireEvent } from "@testing-library/react";
import "./";
import type { EasyopsNavbarAlerts } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/runtime", () => ({
  getRuntime() {
    return {
      getMiscSettings() {
        return {
          loadTime: 3000,
        };
      },
    };
  },
}));
jest.mock("@next-core/easyops-runtime", () => ({
  auth: {
    getAuth: jest.fn(() => ({})),
  },
}));
jest.mock("@next-core/react-runtime", () => ({
  useCurrentApp() {
    return {
      isBuildPush: true,
    };
  },
}));

const mockGetAuth = auth.getAuth as jest.Mock<any>;

describe("nav.easyops-navbar-alerts", () => {
  test("no alerts", () => {
    const element = document.createElement(
      "nav.easyops-navbar-alerts"
    ) as EasyopsNavbarAlerts;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(0);
    expect(element.shadowRoot?.querySelectorAll(".alert")?.length).toBe(0);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("license expire soon", () => {
    mockGetAuth.mockReturnValue({
      license: {
        validDaysLeft: 7,
      },
      isAdmin: true,
    });

    const element = document.createElement(
      "nav.easyops-navbar-alerts"
    ) as EasyopsNavbarAlerts;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelectorAll(".alert")?.length).toBe(1);

    fireEvent.click(element.shadowRoot?.querySelector(".icon") as HTMLElement);
    expect(element.shadowRoot?.querySelectorAll(".alert")?.length).toBe(0);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("license expire not soon", () => {
    mockGetAuth.mockReturnValue({
      license: {
        validDaysLeft: 20,
      },
      isAdmin: true,
    });

    const element = document.createElement(
      "nav.easyops-navbar-alerts"
    ) as EasyopsNavbarAlerts;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelectorAll(".alert")?.length).toBe(0);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("render alert", () => {
    const element = document.createElement(
      "nav.easyops-navbar-alerts"
    ) as EasyopsNavbarAlerts;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelectorAll(".alert")?.length).toBe(0);

    act(() => {
      window.dispatchEvent(
        new CustomEvent("route.render", {
          detail: { renderTime: 3456 },
        })
      );
    });
    expect(element.shadowRoot?.querySelectorAll(".alert")?.length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
