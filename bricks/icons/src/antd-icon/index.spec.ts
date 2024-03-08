import { describe, test, expect } from "@jest/globals";
import "./index.js";
import type { AntdIcon } from "./index.js";

(global as any).fetch = jest.fn((url: string) =>
  Promise.resolve({
    ok: true,
    text: () =>
      Promise.resolve(
        url.endsWith("branches.svg")
          ? '<svg viewBox="64 64 896 896" focusable="false" fill="currentColor"><defs><style /></defs><path d="M952 474H829.8z" /></svg>'
          : '<svg viewBox="64 64 896 896" focusable="false" fill="currentColor"><path d="M148.2 674.6z" fill="#E6E6E6" /><path d="M578.9 546.7z" fill="#333" /></svg>'
      ),
  })
);

describe("eo-antd-icon", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-antd-icon") as AntdIcon;
    element.icon = "branches";

    expect(element.shadowRoot).toBeFalsy();
    document.body.appendChild(element);
    expect(element.shadowRoot).toBeTruthy();
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          DefineLinearGradient.shadow.css
      icons.shadow.css
        </style>,
        <svg
          fill="currentColor"
          focusable="false"
          height="1em"
          viewBox="64 64 896 896"
          width="1em"
        >
          <defs>
            <style />
          </defs>
          <path
            d="M952 474H829.8z"
          />
        </svg>,
      ]
    `);
    document.body.removeChild(element);
    expect(element.shadowRoot?.childNodes.length).toBe(0);

    // Re-connect
    document.body.appendChild(element);
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes.length).toBe(2);
    document.body.removeChild(element);
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("gradient", async () => {
    const element = document.createElement("eo-antd-icon") as AntdIcon;
    element.theme = "twotone";
    element.icon = "api";
    element.startColor = "#000000";
    element.endColor = "#ffffff";

    document.body.appendChild(element);
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          DefineLinearGradient.shadow.css
      icons.shadow.css
        </style>,
        <svg
          fill="currentColor"
          focusable="false"
          height="1em"
          viewBox="64 64 896 896"
          width="1em"
        >
          <path
            d="M148.2 674.6z"
            fill="#E6E6E6"
          />
          <path
            d="M578.9 546.7z"
            fill="#333"
          />
        </svg>,
        <div
          class="gradients"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            height="0"
            width="0"
          >
            <defs>
              <lineargradient
                id="linear-gradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stop-color="#000000"
                />
                <stop
                  offset="100%"
                  stop-color="#ffffff"
                />
              </lineargradient>
            </defs>
          </svg>
        </div>,
      ]
    `);

    // Update `gradientDirection`
    element.gradientDirection = "left-to-right";
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          DefineLinearGradient.shadow.css
      icons.shadow.css
        </style>,
        <svg
          fill="currentColor"
          focusable="false"
          height="1em"
          viewBox="64 64 896 896"
          width="1em"
        >
          <path
            d="M148.2 674.6z"
            fill="#E6E6E6"
          />
          <path
            d="M578.9 546.7z"
            fill="#333"
          />
        </svg>,
        <div
          class="gradients"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            height="0"
            width="0"
          >
            <defs>
              <lineargradient
                id="linear-gradient"
                x1="0"
                x2="1"
                y1="0"
                y2="0"
              >
                <stop
                  offset="0%"
                  stop-color="#000000"
                />
                <stop
                  offset="100%"
                  stop-color="#ffffff"
                />
              </lineargradient>
            </defs>
          </svg>
        </div>,
      ]
    `);

    document.body.removeChild(element);
  });

  test("no icon", async () => {
    const element = document.createElement("eo-antd-icon") as AntdIcon;

    const onIconFound = jest.fn();
    element.addEventListener("icon.found", (e) => {
      onIconFound((e as CustomEvent).detail);
    });

    document.body.appendChild(element);
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          DefineLinearGradient.shadow.css
      icons.shadow.css
        </style>,
      ]
    `);
    expect(onIconFound).toHaveBeenCalledWith(false);

    document.body.removeChild(element);
  });

  test("fix theme", async () => {
    const element = document.createElement("eo-antd-icon") as AntdIcon;
    element.icon = "branches";
    element.theme = "twoTone";

    document.body.appendChild(element);
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          DefineLinearGradient.shadow.css
      icons.shadow.css
        </style>,
        <svg
          fill="currentColor"
          focusable="false"
          height="1em"
          viewBox="64 64 896 896"
          width="1em"
        >
          <defs>
            <style />
          </defs>
          <path
            d="M952 474H829.8z"
          />
        </svg>,
      ]
    `);
    document.body.removeChild(element);
  });

  test("not connected", async () => {
    const element = document.createElement("eo-antd-icon") as AntdIcon;
    element.icon = "branches";
    (element as any)._render();
    expect(fetch).not.toBeCalled();
  });
});
