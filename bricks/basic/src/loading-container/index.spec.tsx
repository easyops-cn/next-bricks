import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { LoadingContainer } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-loading-container", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  test("basic usage", async () => {
    const element = document.createElement(
      "eo-loading-container"
    ) as LoadingContainer;
    element.loading = true;

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <div
          class="mask"
        >
          <eo-icon
            class="icon"
            icon="loading"
            lib="antd"
            spinning=""
          />
        </div>,
        <slot
          class="loading"
        />,
      ]
    `);

    element.loading = false;
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <slot
          class=""
        />,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("delay", async () => {
    jest.useFakeTimers();
    const element = document.createElement(
      "eo-loading-container"
    ) as LoadingContainer;
    element.delay = 100;
    element.loading = true;

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <slot
          class=""
        />,
      ]
    `);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <div
          class="mask"
        >
          <eo-icon
            class="icon"
            icon="loading"
            lib="antd"
            spinning=""
          />
        </div>,
        <slot
          class="loading"
        />,
      ]
    `);

    element.loading = false;
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <slot
          class=""
        />,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
