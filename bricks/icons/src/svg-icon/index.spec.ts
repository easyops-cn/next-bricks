import { describe, test, expect } from "@jest/globals";
import "./index.js";
import type { SvgIcon } from "./index.js";

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="15px" height="17px" viewBox="0 0 15 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-1804.000000, -58.000000)" stroke="#595959">
            <g transform="translate(1805.000000, 59.000000)">
                <circle cx="6.512" cy="3.552" r="3.552"></circle>
                <path d="M10.448,8.184 Z" stroke-linecap="square"></path>
            </g>
        </g>
    </g>
</svg>`.replace(/>\s+</g, "><");

(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(svgContent),
  })
);

describe("eo-svg-icon", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-svg-icon") as SvgIcon;
    element.imgSrc = "account.svg";

    expect(element.shadowRoot).toBeFalsy();
    document.body.appendChild(element);
    expect(element.shadowRoot).toBeTruthy();
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          icons.shadow.css
        </style>,
        <svg
          height="1em"
          version="1.1"
          viewBox="0 0 15 17"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g
            fill="none"
            fill-rule="evenodd"
            stroke="none"
            stroke-width="1"
          >
            <g
              stroke="currentColor"
              transform="translate(-1804.000000, -58.000000)"
            >
              <g
                transform="translate(1805.000000, 59.000000)"
              >
                <circle
                  cx="6.512"
                  cy="3.552"
                  r="3.552"
                />
                <path
                  d="M10.448,8.184 Z"
                  stroke-linecap="square"
                />
              </g>
            </g>
          </g>
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

  test("no imgSrc", async () => {
    const element = document.createElement("eo-svg-icon") as SvgIcon;

    const onIconFound = jest.fn();
    element.addEventListener("icon.found", (e) => {
      onIconFound((e as CustomEvent).detail);
    });

    document.body.appendChild(element);
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes.length).toBe(1);
    expect(onIconFound).toHaveBeenCalledWith(false);

    document.body.removeChild(element);
  });

  test("not connected", async () => {
    const element = document.createElement("eo-svg-icon") as SvgIcon;
    element.imgSrc = "account.svg";
    (element as any)._render();
    expect(fetch).not.toBeCalled();
  });

  test("use svg content", async () => {
    const element = document.createElement("eo-svg-icon") as SvgIcon;
    element.svgContent = svgContent;

    expect(element.shadowRoot).toBeFalsy();
    document.body.appendChild(element);
    expect(element.shadowRoot).toBeTruthy();
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          icons.shadow.css
        </style>,
        <svg
          height="1em"
          version="1.1"
          viewBox="0 0 15 17"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g
            fill="none"
            fill-rule="evenodd"
            stroke="none"
            stroke-width="1"
          >
            <g
              stroke="currentColor"
              transform="translate(-1804.000000, -58.000000)"
            >
              <g
                transform="translate(1805.000000, 59.000000)"
              >
                <circle
                  cx="6.512"
                  cy="3.552"
                  r="3.552"
                />
                <path
                  d="M10.448,8.184 Z"
                  stroke-linecap="square"
                />
              </g>
            </g>
          </g>
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
});
