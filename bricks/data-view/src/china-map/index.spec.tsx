import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { ChinaMap } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("data-view.china-map", () => {
  test("basic usage", async () => {
    const element = document.createElement("data-view.china-map") as ChinaMap;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
