import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import { GeneralAlert } from "./index.js";
import { AlertType } from "./constants.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/runtime", () => ({
  getHistory: () => ({
    location: {
      pathname: "/test",
    },
  }),
}));

describe("presentational.general-alert", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "presentational.general-alert"
    ) as GeneralAlert;
    element.textContent = "content";
    element.type = AlertType.INFO;
    element.closable = true;
    element.localStorageKey = "test";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(
      element.shadowRoot?.querySelector(".alert-wrapper-no-title")
    ).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".alert-title")).toBeFalsy();

    act(() => {
      fireEvent.click(element.shadowRoot?.querySelector(".close-icon"));
    });
    expect(element.shadowRoot?.querySelector("alert-wrapper")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("has title", async () => {
    const element = document.createElement(
      "presentational.general-alert"
    ) as GeneralAlert;
    element.textContent = "content";
    element.type = AlertType.INFO;
    element.hasTitle = true;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(
      element.shadowRoot?.querySelector(".alert-wrapper-has-title")
    ).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".alert-title")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
