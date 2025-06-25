import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import type { EasyOpsIcon } from "./index.js";
import "../img-icon/index.js";

(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () =>
      Promise.resolve(
        `<?xml version="1.0" encoding="UTF-8"?>
<svg width="15px" height="17px" viewBox="0 0 15 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>WILL BE REMOVED</title>
    <mask fill="white"></mask>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-1804.000000, -58.000000)" stroke="#595959">
            <g transform="translate(1805.000000, 59.000000)">
                <circle cx="6.512" cy="3.552" r="3.552"></circle>
                <path d="M10.448,8.184 Z" stroke-linecap="square"></path>
            </g>
        </g>
    </g>
</svg>`.replace(/>\s+</g, "><")
      ),
  })
);

describe("eo-easyops-icon", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-easyops-icon") as EasyOpsIcon;
    element.icon = "account";

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
          <mask
            fill="white"
          />
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

  test("colored icon", async () => {
    const element = document.createElement("eo-easyops-icon") as EasyOpsIcon;
    element.category = "colored-presudo-3d";
    element.icon = "app";

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
          <mask
            fill="white"
          />
          <g
            fill="none"
            fill-rule="evenodd"
            stroke="none"
            stroke-width="1"
          >
            <g
              stroke="#595959"
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
  });

  test("image icon", () => {
    const element = document.createElement("eo-easyops-icon") as EasyOpsIcon;
    element.category = "image";
    element.icon = "any-png";

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <eo-img-icon
          img-src="chunks/easyops-icons/image/any.png"
        />,
      ]
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("no icon", async () => {
    const element = document.createElement("eo-easyops-icon") as EasyOpsIcon;

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
    const element = document.createElement("eo-easyops-icon") as EasyOpsIcon;
    element.icon = "account";
    (element as any)._render();
    expect(fetch).not.toHaveBeenCalled();
  });
});
