import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import { EoBreadcrumbItem } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-breadcrumb-item", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-breadcrumb-item"
    ) as EoBreadcrumbItem;
    element.textContent = "test";
    element.url = "/url";

    const suffixElement = document.createElement("div");
    const prefixElement = document.createElement("div");
    const separatorElement = document.createElement("div");
    suffixElement.slot = "suffix";
    prefixElement.slot = "prefix";
    separatorElement.slot = "separator";

    element.appendChild(suffixElement);
    element.appendChild(prefixElement);
    element.appendChild(separatorElement);

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelector("slot[name='group-separator']")
    ).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
