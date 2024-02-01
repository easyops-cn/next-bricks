import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoSnapshot } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-snapshot", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-snapshot") as EoSnapshot;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(0);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
