import React from "react";
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { Popover } from "./index.jsx";
import { fireEvent } from "@testing-library/react";

jest.mock("@next-core/theme", () => ({}));
type Animate = {
  (
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions | undefined
  ): Animation;
  (
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions | undefined
  ): Animation;
};

let originalAnimateFunction: Animate;

// Mock native animate function
beforeAll(() => {
  originalAnimateFunction = HTMLElement.prototype.animate;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  HTMLElement.prototype.popup = {
    animate: () => ({
      addEventListener: (_: string, resolve: () => void) => resolve(),
    }),
  };
});

afterAll(() => {
  HTMLElement.prototype.animate = originalAnimateFunction;
});

describe("basic.general-popover", () => {
  test("trigger is click should work", async () => {
    const element = document.createElement("basic.general-popover") as Popover;

    const button = document.createElement("button");
    button.setAttribute("slot", "anchor");
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    const mockListener = jest.fn();
    element.append(button);
    element.append(content);
    element.addEventListener("visible.change", mockListener);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
<sl-popup
  distance="4"
  exportparts="popup"
  placement="bottom"
  shift=""
  shiftpadding="24"
  trigger="click"
>
  <slot
    name="anchor"
    slot="anchor"
    style="padding: 4px; margin: -4px; display: inline-block;"
  />
  <slot
    hidden=""
  />
</sl-popup>
`);

    act(() => {
      element.querySelector("button")?.click();
    });

    await (global as any).flushPromises();

    expect(mockListener).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        detail: true,
      })
    );

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
<sl-popup
  distance="4"
  exportparts="popup"
  placement="bottom"
  shift=""
  shiftpadding="24"
  trigger="click"
>
  <slot
    name="anchor"
    slot="anchor"
    style="padding: 4px; margin: -4px; display: inline-block;"
  />
  <slot />
</sl-popup>
`);

    await act(async () => {
      await document.body?.click();
    });
    await (global as any).flushPromises();

    expect(mockListener).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        detail: false,
      })
    );

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
<sl-popup
  distance="4"
  exportparts="popup"
  placement="bottom"
  shift=""
  shiftpadding="24"
  trigger="click"
>
  <slot
    name="anchor"
    slot="anchor"
    style="padding: 4px; margin: -4px; display: inline-block;"
  />
  <slot
    hidden=""
  />
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
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
<sl-popup
  distance="4"
  exportparts="popup"
  placement="bottom"
  shift=""
  shiftpadding="24"
  strategy="fixed"
  trigger="hover"
>
  <slot
    name="anchor"
    slot="anchor"
    style="padding: 4px; margin: -4px; display: inline-block;"
  />
  <slot
    hidden=""
  />
</sl-popup>
`);

    act(() => {
      fireEvent.click(content);
    });

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
<sl-popup
  distance="4"
  exportparts="popup"
  placement="bottom"
  shift=""
  shiftpadding="24"
  strategy="fixed"
  trigger="hover"
>
  <slot
    name="anchor"
    slot="anchor"
    style="padding: 4px; margin: -4px; display: inline-block;"
  />
  <slot
    hidden=""
  />
</sl-popup>
`);

    act(() => {
      fireEvent.mouseOver(element.querySelector("button") as HTMLElement);
    });

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
<sl-popup
  distance="4"
  exportparts="popup"
  placement="bottom"
  shift=""
  shiftpadding="24"
  strategy="fixed"
  trigger="hover"
>
  <slot
    name="anchor"
    slot="anchor"
    style="padding: 4px; margin: -4px; display: inline-block;"
  />
  <slot />
</sl-popup>
`);

    await act(async () => {
      await fireEvent.mouseOver(document.body);
    });
    await (global as any).flushPromises();

    expect(element.shadowRoot?.querySelector("sl-popup"))
      .toMatchInlineSnapshot(`
<sl-popup
  distance="4"
  exportparts="popup"
  placement="bottom"
  shift=""
  shiftpadding="24"
  strategy="fixed"
  trigger="hover"
>
  <slot
    name="anchor"
    slot="anchor"
    style="padding: 4px; margin: -4px; display: inline-block;"
  />
  <slot />
</sl-popup>
`);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });

  test("disabled should work & arrowColor", async () => {
    const element = document.createElement("basic.general-popover") as Popover;
    element.active = true;
    element.disabled = true;

    const button = document.createElement("button");
    button.slot = "anchor";
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    element.arrowColor = "pink";

    const mockListener = jest.fn();
    element.append(button);
    element.append(content);
    element.addEventListener("visible.change", mockListener);

    expect(element.shadowRoot).toBeFalsy();
    await act(async () => {
      document.body.appendChild(element);
    });

    expect(mockListener).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        detail: false,
      })
    );

    await act(async () => {
      button.click();
    });
    expect(mockListener).toHaveBeenCalledTimes(1);

    expect(
      (
        element.shadowRoot?.querySelector("sl-popup") as HTMLElement
      ).style.getPropertyValue("--arrow-color")
    ).toBe("pink");

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
