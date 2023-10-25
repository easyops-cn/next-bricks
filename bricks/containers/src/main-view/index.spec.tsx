import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoMainView } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-main-view", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-main-view") as EoMainView;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "narrow",
      "full"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("narrow", async () => {
    const element = document.createElement("eo-main-view") as EoMainView;
    element.narrow = "medium";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "narrow",
      "medium"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("banner alone", async () => {
    const element = document.createElement("eo-main-view") as EoMainView;
    element.bannerAlone = true;
    element.bannerTitle = "Hello";
    element.bannerDescription = "World";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "bannerTitle",
      "Hello"
    );
    expect(element.shadowRoot?.querySelector("eo-banner")).toHaveProperty(
      "bannerDescription",
      "World"
    );

    act(() => {
      document.body.removeChild(element);
    });
  });
});
