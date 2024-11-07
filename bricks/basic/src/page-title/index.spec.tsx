import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoPageTitle } from "./index.js";
import { getRuntime } from "@next-core/runtime";
jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/runtime");

const mockGetRuntime = getRuntime as jest.Mock;
mockGetRuntime.mockReturnValue({
  applyPageTitle: jest.fn(),
});
describe("eo-page-title", () => {
  test("basic usage", async () => {
    document.documentElement.dataset.mode = "default";
    const element = document.createElement("eo-page-title") as EoPageTitle;
    element.pageTitle = "Hello World";
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector("span")).toMatchInlineSnapshot(`
      <span>
        Hello World
      </span>
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("dashboard mode", async () => {
    document.documentElement.dataset.mode = "dashboard";
    const element = document.createElement("eo-page-title") as EoPageTitle;
    element.pageTitle = "Hello Dashboard";
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.querySelector("span")).toMatchInlineSnapshot(`
      <span
        class="dashboard"
      >
        Hello Dashboard
      </span>
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
