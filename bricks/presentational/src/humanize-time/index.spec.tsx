import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoHumanizeTime } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-humanize-time", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-humanize-time"
    ) as EoHumanizeTime;

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
