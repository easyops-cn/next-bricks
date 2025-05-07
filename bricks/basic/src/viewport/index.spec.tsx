import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { Viewport } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-viewport", () => {
  beforeEach(() => {
    const metaTags = document.querySelectorAll('meta[name="viewport"]');
    for (const metaTag of metaTags) {
      metaTag.remove();
    }
  });

  test("basic usage", async () => {
    const element = document.createElement("eo-viewport") as Viewport;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    const metaTag = document.querySelector('meta[name="viewport"]');
    expect(metaTag?.getAttribute("content")).toBe(
      "width=device-width, initial-scale=1, minimum-scale=0.1, maximum-scale=10, user-scalable=1"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.querySelector('meta[name="viewport"]')).toBeNull();
  });

  test("props", () => {
    const element = document.createElement("eo-viewport") as Viewport;
    element.width = "1000px";
    element.initialScale = 2;
    element.minimumScale = 1;
    element.maximumScale = 2;
    element.userScalable = "no";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    const metaTag = document.querySelector('meta[name="viewport"]');
    expect(metaTag?.getAttribute("content")).toBe(
      "width=1000px, initial-scale=2, minimum-scale=1, maximum-scale=2, user-scalable=no"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.querySelector('meta[name="viewport"]')).toBeNull();
  });

  test("ignore if the meta already exists", () => {
    const element = document.createElement("eo-viewport") as Viewport;
    const metaTag = document.createElement("meta");
    metaTag.name = "viewport";
    metaTag.content = "width=2000px, initial-scale=3";
    document.head.appendChild(metaTag);

    act(() => {
      document.body.appendChild(element);
    });

    const metaTags = document.querySelectorAll('meta[name="viewport"]');
    expect(metaTags.length).toBe(1);
    expect(metaTags[0]).toBe(metaTag);
    expect(metaTag.getAttribute("content")).toBe(
      "width=2000px, initial-scale=3"
    );

    act(() => {
      document.body.removeChild(element);
    });

    const metaTagsAfter = document.querySelectorAll('meta[name="viewport"]');
    expect(metaTagsAfter.length).toBe(1);
    expect(metaTagsAfter[0]).toBe(metaTag);
    expect(metaTag.getAttribute("content")).toBe(
      "width=2000px, initial-scale=3"
    );
  });
});
