import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { EoMenuGroup } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-menu-group", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-menu-group") as EoMenuGroup;

    element.textContent = "custom group";
    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelector(".menu-group-title")?.innerHTML
    ).toEqual('<slot name="title"></slot>');

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
