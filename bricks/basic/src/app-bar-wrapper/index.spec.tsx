import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoAppBarWrapper } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-app-bar-wrapper", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-app-bar-wrapper"
    ) as EoAppBarWrapper;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelectorAll(".leftContainer").length).toBe(
      1
    );
    expect(element.shadowRoot?.querySelectorAll(".rightContainer").length).toBe(
      1
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
