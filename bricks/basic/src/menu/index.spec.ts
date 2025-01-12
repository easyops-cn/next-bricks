import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./index.js";
import { Menu } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-menu", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-menu") as Menu;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
