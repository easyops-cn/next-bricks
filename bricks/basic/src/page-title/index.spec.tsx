import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoPageTitle } from "./index.js";
import { getRuntime } from "@next-core/runtime";
jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/runtime");

const mockGetRuntime = getRuntime as jest.Mock;
const featureFlagsFn = jest.fn().mockReturnValue({
  "support-ui-8.0-base-layout": true,
});
const currentRouteFn = jest.fn().mockReturnValue({
  bricks: [
    {
      brick: "base-layout.tpl-base-page-module",
    },
  ],
});
mockGetRuntime.mockReturnValue({
  applyPageTitle: jest.fn(),
  getFeatureFlags: featureFlagsFn,
  getCurrentRoute: currentRouteFn,
});
describe("eo-page-title", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-page-title") as EoPageTitle;
    element.pageTitle = "Hello World";
    element.pageTitleScale = 2;
    element.dashboardMode = true;
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".page-title-content"))
      .toMatchInlineSnapshot(`
      <span
        class="page-title-content"
        style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 76px; height: 100%; background-size: 100% 90px;"
      >
        Hello World
      </span>
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
