import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { IllustrationMessage } from "./index.js";

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

describe("eo-illustration-message", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-illustration-message"
    ) as IllustrationMessage;
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
            alt="internet-disconnected"
            src="easyops2/internet-disconnected.svg"
          />
        </div>,
        <div
          class="heading"
        >
          Oops
        </div>,
        <div
          class="description"
        >
          Yaks
        </div>,
        <div>
          <slot />
        </div>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("not found", async () => {
    const element = document.createElement(
      "eo-illustration-message"
    ) as IllustrationMessage;
    element.variant = "not-found";

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
            alt="not-found"
            src="exception/http-404.svg"
          />
        </div>,
        <div>
          <slot />
        </div>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("unknown error", async () => {
    const element = document.createElement(
      "eo-illustration-message"
    ) as IllustrationMessage;

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
        <div>
          <slot />
        </div>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("status variants", async () => {
    const element = document.createElement(
      "eo-illustration-message"
    ) as IllustrationMessage;
    element.variant = "success";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <div
          class="status success"
        >
          <eo-icon
            icon="check-circle"
            lib="antd"
            theme="filled"
          />
        </div>,
        <div>
          <slot />
        </div>,
      ]
    `);

    await act(async () => {
      element.variant = "error";
    });
    expect(
      element.shadowRoot?.querySelector("eo-icon")?.getAttribute("icon")
    ).toBe("close-circle");

    await act(async () => {
      element.variant = "warning";
    });
    expect(
      element.shadowRoot?.querySelector("eo-icon")?.getAttribute("icon")
    ).toBe("warning");

    await act(async () => {
      element.variant = "info";
    });
    expect(
      element.shadowRoot?.querySelector("eo-icon")?.getAttribute("icon")
    ).toBe("exclamation-circle");

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("customize image", async () => {
    const element = document.createElement(
      "eo-illustration-message"
    ) as IllustrationMessage;
    element.customizeImage = {
      category: "my-category",
      name: "my-image",
    };

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
            src="my-category/my-image.svg"
          />
        </div>,
        <div>
          <slot />
        </div>,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
