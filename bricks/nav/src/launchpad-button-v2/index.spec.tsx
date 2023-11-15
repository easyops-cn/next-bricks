import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { createHistory } from "@next-core/runtime";
import "./";
import type { EoLaunchpadButtonV2 } from "./index.js";

createHistory();
jest.mock("@next-core/theme", () => ({}));

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

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
