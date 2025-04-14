import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { createHistory } from "@next-core/runtime";
import "../link/index";
import "./";
import type { CardBox } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

createHistory();

describe("eo-card-box", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-card-box") as CardBox;
    element.href = "/test";

    const slots = ["avatar", "title", "description", "", "footer"];
    const classNames = [
      "avatar",
      "title",
      "description",
      "content",
      "footer",
      "body",
      "detail",
    ];
    for (const slot of slots) {
      const slotElement = document.createElement("div");
      slotElement.slot = slot;
      element.appendChild(slotElement);
    }

    act(() => {
      document.body.appendChild(element);
    });

    expect(
      element.shadowRoot?.querySelector("eo-link")?.getAttribute("href")
    ).toBe("/test");
    expect(
      element.shadowRoot
        ?.querySelector("eo-link")
        ?.classList.contains("clickable")
    ).toBe(true);

    for (const className of classNames) {
      expect(
        element.shadowRoot
          ?.querySelector(`.${className}`)
          ?.classList.contains("hidden")
      ).toBe(false);
    }

    // Remove all children
    await act(async () => {
      element.replaceChildren();
    });

    for (const className of classNames) {
      expect(
        element.shadowRoot
          ?.querySelector(`.${className}`)
          ?.classList.contains("hidden")
      ).toBe(true);
    }

    // Unset href
    element.href = undefined;
    await act(async () => {
      // wait
    });
    expect(
      element.shadowRoot?.querySelector("eo-link")?.getAttribute("href")
    ).toBe(null);
    expect(
      element.shadowRoot
        ?.querySelector("eo-link")
        ?.classList.contains("clickable")
    ).toBe(false);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
