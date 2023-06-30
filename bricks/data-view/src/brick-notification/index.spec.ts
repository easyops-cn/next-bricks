import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { BrickNotification } from "./index.js";

describe("data-view.brick-notification", () => {
  test("basic usage", () => {
    const element = document.createElement(
      "data-view.brick-notification"
    ) as BrickNotification;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.message = "This is the content of the notification.";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot.querySelector(".message").textContent).toBe(
      "This is the content of the notification."
    );
    expect(element.shadowRoot.querySelector(".icon").getAttribute("lib")).toBe(
      "fa"
    );
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("icon is antd", () => {
    const element = document.createElement(
      "data-view.brick-notification"
    ) as BrickNotification;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.message = "This is the content of the notification.";
      element.icon = {
        lib: "antd",
        icon: "smile",
        theme: "outlined",
      };
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot.querySelector(".message").textContent).toBe(
      "This is the content of the notification."
    );
    expect(element.shadowRoot.querySelector(".icon").getAttribute("lib")).toBe(
      "antd"
    );
    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
