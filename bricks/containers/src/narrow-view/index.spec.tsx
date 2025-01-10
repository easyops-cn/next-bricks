import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { EoNarrowView } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-narrow-view", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-narrow-view") as EoNarrowView;

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
