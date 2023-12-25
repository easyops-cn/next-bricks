import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { EoCardItem } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

class MockEoMiniActions extends HTMLElement {
  triggerEvent(event: string) {
    this.dispatchEvent(new CustomEvent("action.click", { detail: { event } }));
  }
}
customElements.define("eo-mini-actions", MockEoMiniActions);

describe("eo-card-item", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-card-item") as EoCardItem;
    const onActionClick = jest.fn();
    element.hasHeader = true;
    element.avatar = {
      icon: {
        lib: "easyops",
        category: "default",
        icon: "monitor",
      },
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".card-header")).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".card-avatar eo-icon")
    ).toBeTruthy();

    await act(async () => {
      element.hasHeader = false;
      element.avatar = {
        imgSrc: "./test.jpg",
      };
    });
    expect(element.shadowRoot?.querySelector(".card-header")).toBeFalsy();
    expect(element.shadowRoot?.querySelector(".card-avatar img")).toBeTruthy();

    await act(async () => {
      element.avatar = null;
    });
    expect(element.shadowRoot?.querySelector(".card-avatar")).toBeFalsy();

    await act(async () => {
      element.addEventListener("download", onActionClick);
      (
        element.shadowRoot?.querySelector(
          "eo-mini-actions"
        ) as MockEoMiniActions
      ).triggerEvent("download");
    });
    expect(onActionClick).toBeCalled();

    await act(async () => {
      element.hasCover = true;
      element.coverColor = "#d6d6ff";
    });
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper")
    ).toBeTruthy();

    await act(async () => {
      element.coverColor = null;
      element.coverImage = "./test.jpg";
      element.avatarPosition = "cover";
      element.avatar = {
        imgSrc: "./test.jpg",
      };
    });
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper")
    ).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper .card-avatar img")
    ).toBeTruthy();

    await act(async () => {
      element.avatar = {
        icon: {
          lib: "easyops",
          category: "default",
          icon: "monitor",
        },
      };
    });
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper")
    ).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper .card-avatar")
    ).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
