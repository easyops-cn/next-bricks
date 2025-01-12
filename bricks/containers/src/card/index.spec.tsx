import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./";
import { Card } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}));

describe("eo-card", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-card") as Card;

    element.cardTitle = "title";
    element.textContent = "context";
    element.hasExtraSlot = true;
    element.operationButtons = [{ text: "1", id: "1" } as any];

    const footerElement = document.createElement("div");
    footerElement.textContent = "footer";
    footerElement.slot = "footer";
    element.appendChild(footerElement);
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);
    expect(element.shadowRoot?.querySelector("eo-button")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
