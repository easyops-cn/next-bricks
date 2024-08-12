import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { ErrorMessage } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const getIllustration = jest.fn(
  ({ name, category }) => `${category}/${name}.svg`
);

customElements.define(
  "illustrations.get-illustration",
  class extends HTMLElement {
    resolve = getIllustration;
  }
);

describe("illustrations.error-message", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "illustrations.error-message"
    ) as ErrorMessage;
    element.variant = "internet-disconnected";
    element.errorTitle = "Oops";
    element.description = "Yaks";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <div
          class="image"
        >
          <img
            src="easyops2/internet-disconnected.svg"
          />
        </div>,
        <div
          class="title"
        >
          Oops
        </div>,
        <div
          class="description"
        >
          Yaks
        </div>,
        <div
          class="extra"
        >
          <slot />
        </div>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("unknown error", async () => {
    const element = document.createElement(
      "illustrations.error-message"
    ) as ErrorMessage;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <div
          class="image"
        >
          <img
            src="easyops2/unknown-error.svg"
          />
        </div>,
        <div
          class="extra"
        >
          <slot />
        </div>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
