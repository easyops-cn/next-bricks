import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./index.jsx";
import { AppWallCardItem } from "./index.jsx";

describe("data-view.app-wall-card-item", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.app-wall-card-item"
    ) as AppWallCardItem;

    element.cardTitle = "card-title";
    element.description = "--description--";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(element.shadowRoot.querySelector(".card-item-title").textContent).toBe(
      "card-title"
    );
    expect(element.shadowRoot.querySelector(".card-item-description").textContent).toBe(
      "--description--"
    );
    expect(new Set(element.shadowRoot.querySelector(".card-item-container").classList).has("status-normal")).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
