import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { Popover } from "./index.jsx";
import { fireEvent } from "@testing-library/react";

jest.mock("@next-core/theme", () => ({}));

describe("basic.general-popover", () => {
  test("trigger is click should work", async () => {
    const element = document.createElement("basic.general-popover") as Popover;

    const button = document.createElement("button");
    button.setAttribute("slot", "anchor");
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    element.append(button);
    element.append(content);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(1);

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
      <sl-popup
        curelement="[object HTMLElement]"
      >
        <slot
          name="anchor"
          slot="anchor"
        />
        <slot />
      </sl-popup>
    `);

    act(() => {
      element.querySelector("button")?.click();
    });

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
      <sl-popup
        active=""
        curelement="[object HTMLElement]"
      >
        <slot
          name="anchor"
          slot="anchor"
        />
        <slot />
      </sl-popup>
    `);

    act(() => {
      document.body?.click();
    });

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
      <sl-popup
        curelement="[object HTMLElement]"
      >
        <slot
          name="anchor"
          slot="anchor"
        />
        <slot />
      </sl-popup>
    `);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });

  test("trigger is hover should work", async () => {
    const element = document.createElement("basic.general-popover") as Popover;

    const button = document.createElement("button");
    button.setAttribute("slot", "anchor");
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    element.append(button);
    element.append(content);
    element.trigger = "hover";
    element.strategy = "fixed";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(1);

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
      <sl-popup
        curelement="[object HTMLElement]"
        strategy="fixed"
        trigger="hover"
      >
        <slot
          name="anchor"
          slot="anchor"
        />
        <slot />
      </sl-popup>
    `);

    act(() => {
      fireEvent.mouseOver(element.querySelector("button") as HTMLElement);
    });

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
      <sl-popup
        active=""
        curelement="[object HTMLElement]"
        strategy="fixed"
        trigger="hover"
      >
        <slot
          name="anchor"
          slot="anchor"
        />
        <slot />
      </sl-popup>
    `);

    act(() => {
      fireEvent.mouseOver(document.body);
    });

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
      <sl-popup
        curelement="[object HTMLElement]"
        strategy="fixed"
        trigger="hover"
      >
        <slot
          name="anchor"
          slot="anchor"
        />
        <slot />
      </sl-popup>
    `);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
