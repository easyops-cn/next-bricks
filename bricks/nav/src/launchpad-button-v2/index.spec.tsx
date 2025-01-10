import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent } from "@testing-library/react";
import { createHistory, getHistory } from "@next-core/runtime";
import "./";
import type { EoLaunchpadButtonV2 } from "./index.js";

createHistory();
jest.mock("@next-core/theme", () => ({}));
jest.mock("./Launchpad");

const lockBodyScroll = jest.fn();
customElements.define(
  "basic.lock-body-scroll",
  class extends HTMLElement {
    resolve = lockBodyScroll;
  }
);

describe("eo-launchpad-button-v2", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-launchpad-button-v2"
    ) as EoLaunchpadButtonV2;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(lockBodyScroll).toBeCalledWith(element, false);

    const button = element.shadowRoot?.querySelector("a") as HTMLElement;
    expect(button.classList.contains("active")).toBe(false);
    fireEvent.click(button);
    expect(button.classList.contains("active")).toBe(true);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(2, element, true);

    act(() => {
      getHistory().push("/tmp");
    });
    expect(button.classList.contains("active")).toBe(false);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(3, element, false);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(4, element, false);
    expect(lockBodyScroll).toBeCalledTimes(4);
  });
});
