import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { SimpleCardItem } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("data-view.simple-card-item", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.simple-card-item"
    ) as SimpleCardItem;
    element.cardTitle = "custom Title";
    element.description = "description ...";
    element.status = "normal";
    element.descriptionList = [
      {
        key: "test",
        value: "123",
      },
    ];

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(
      element.shadowRoot.querySelector(".card-item-title").textContent
    ).toBe("custom Title");
    expect(
      element.shadowRoot
        .querySelector(".card-item-container")
        .classList.contains(".status-normal")
    );
    expect(
      element.shadowRoot.querySelector(".card-item-description").textContent
    ).toBe("description ...");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
