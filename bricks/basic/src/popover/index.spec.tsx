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
    style: {},
    animate: function () {
      let state = true;
      const animation: {
        onfinish?: () => void;
        reverse: () => void;
        cancel: () => void;
      } = {
        reverse: () => {
          //
        },
        cancel: () => {
          state = false;
        },
      };
      setTimeout(() => {
        state && animation.onfinish?.();
      }, 0);

      return animation;
    },
  };
});

afterAll(() => {
  HTMLElement.prototype.animate = originalAnimateFunction;
});

jest.useFakeTimers();

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

    await act(async () => {
      element.querySelector("button")?.click();
    });
    jest.runAllTimers();

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
      document.body?.click();
    });
    jest.runAllTimers();

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
    const mockListener = jest.fn();
    element.addEventListener("visible.change", mockListener);

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

    await act(async () => {
      fireEvent.click(content);
    });
    jest.runAllTimers();

    expect(mockListener).not.toBeCalled();
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

    await act(async () => {
      fireEvent.mouseOver(element.querySelector("button") as HTMLElement);
    });
    jest.runAllTimers();

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
      fireEvent.mouseLeave(element);
    });
    jest.runAllTimers();

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

    element.arrow = true;
    element.arrowColor = "pink";

    const mockListener = jest.fn();
    element.append(button);
    element.append(content);
    element.addEventListener("visible.change", mockListener);

    expect(element.shadowRoot).toBeFalsy();
    await act(async () => {
      document.body.appendChild(element);
    });
    jest.runAllTimers();

    expect(mockListener).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        detail: false,
      })
    );

    await act(async () => {
      button.click();
    });
    jest.runAllTimers();
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

  test("update status frequently should work", async () => {
    const element = document.createElement("basic.general-popover") as Popover;

    const button = document.createElement("button");
    button.setAttribute("slot", "anchor");
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    const onVisibleChange = jest.fn();
    const onBeforeVisibleChange = jest.fn();

    element.append(button);
    element.append(content);
    element.addEventListener("visible.change", onVisibleChange);
    element.addEventListener("before.visible.change", onBeforeVisibleChange);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    await act(async () => {
      element.querySelector("button")?.click();
    });
    await act(async () => {
      document.body?.click();
    });
    await act(async () => {
      element.querySelector("button")?.click();
    });
    jest.runAllTimers();

    expect(onVisibleChange).toHaveBeenCalledTimes(1);
    expect(onVisibleChange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        detail: true,
      })
    );
    expect(onBeforeVisibleChange).toHaveBeenCalledTimes(3);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
