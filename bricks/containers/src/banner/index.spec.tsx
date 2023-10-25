import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoBanner } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

customElements.define(
  "eo-page-title",
  class MockPageTitle extends HTMLElement {
    pageTitle: string;
  }
);

describe("eo-banner", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-banner") as EoBanner;
    element.bannerTitle = "Hello";
    element.bannerDescription = "World";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelector("eo-narrow-view")).toHaveProperty(
      "size",
      "full"
    );
    expect(element.shadowRoot?.querySelector("eo-page-title")).toHaveProperty(
      "pageTitle",
      "Hello"
    );
    expect(element.shadowRoot?.querySelector(".page-desc")).toHaveProperty(
      "textContent",
      "World"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("no title nor desc", async () => {
    const element = document.createElement("eo-banner") as EoBanner;

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("eo-page-title")).toBe(null);
    expect(element.shadowRoot?.querySelector(".page-desc")).toBe(null);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("narrow", async () => {
    const element = document.createElement("eo-banner") as EoBanner;
    element.narrow = "medium";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("eo-narrow-view")).toHaveProperty(
      "size",
      "medium"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });
});
