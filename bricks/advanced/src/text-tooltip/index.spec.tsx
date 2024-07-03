import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import ".";
import type { EoTextTooltip } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-text-tooltip", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-text-tooltip") as EoTextTooltip;
    element.label = "显示文案";
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
