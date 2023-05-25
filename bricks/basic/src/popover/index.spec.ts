import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { Popover } from "./index.jsx";
import { fireEvent } from "@testing-library/react";

jest.mock("@next-core/theme", () => ({}));

describe("basic.general-popover", () => {
  test("trigger is click, and placement is default(bottom)", async () => {
    const element = document.createElement("basic.general-popover") as Popover;

    const button = document.createElement("button");
    button.setAttribute("slot", "trigger");
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    element.append(button);
    element.append(content);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    const wrapperElement = element.shadowRoot?.querySelector(
      ".popover-wrapper"
    ) as HTMLElement;
    wrapperElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 100,
        height: 100,
        x: 10,
        y: 10,
      } as DOMRect;
    });
    const contentElement = element.shadowRoot?.querySelector(
      ".popover-content"
    ) as HTMLElement;
    contentElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 50,
        height: 100,
        x: 0,
        y: 0,
      } as DOMRect;
    });

    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelector(".close")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".open")).toBeFalsy();

    act(() => {
      (
        element.shadowRoot?.querySelector("slot[name='trigger']") as HTMLElement
      ).click();
    });

    expect(
      (element.shadowRoot?.querySelector(".open") as HTMLElement).style.left
    ).toBe("10px");
    expect(
      (element.shadowRoot?.querySelector(".open") as HTMLElement).style.top
    ).toBe("114px");
    expect(element.shadowRoot?.querySelector(".open")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".close")).toBeFalsy();

    act(() => {
      document.body.click();
    });

    expect(element.shadowRoot?.querySelector(".close")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".open")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });

  test("trigger is hover, and placement is top", async () => {
    const element = document.createElement("basic.general-popover") as Popover;

    const button = document.createElement("button");
    button.setAttribute("slot", "trigger");
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    element.append(button);
    element.append(content);

    element.trigger = "hover";
    element.placement = "top";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    const wrapperElement = element.shadowRoot?.querySelector(
      ".popover-wrapper"
    ) as HTMLElement;
    wrapperElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 100,
        height: 100,
        x: 10,
        y: 10,
      } as DOMRect;
    });
    const contentElement = element.shadowRoot?.querySelector(
      ".popover-content"
    ) as HTMLElement;
    contentElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 50,
        height: 100,
        x: 0,
        y: 0,
      } as DOMRect;
    });

    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelector(".close")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".open")).toBeFalsy();

    act(() => {
      fireEvent.mouseOver(
        element.shadowRoot?.querySelector("slot[name='trigger']") as HTMLElement
      );
    });

    expect(
      (element.shadowRoot?.querySelector(".open") as HTMLElement).style.left
    ).toBe("10px");
    expect(
      (element.shadowRoot?.querySelector(".open") as HTMLElement).style.top
    ).toBe("-94px");
    expect(element.shadowRoot?.querySelector(".open")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".close")).toBeFalsy();

    act(() => {
      fireEvent.mouseOver(document.body);
    });

    expect(element.shadowRoot?.querySelector(".close")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".open")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });

  test("trigger is hover, and placement is left", async () => {
    const element = document.createElement("basic.general-popover") as Popover;

    const button = document.createElement("button");
    button.setAttribute("slot", "trigger");
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    element.append(button);
    element.append(content);

    element.trigger = "hover";
    element.placement = "left";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    const wrapperElement = element.shadowRoot?.querySelector(
      ".popover-wrapper"
    ) as HTMLElement;
    wrapperElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 100,
        height: 100,
        x: 10,
        y: 10,
      } as DOMRect;
    });
    const contentElement = element.shadowRoot?.querySelector(
      ".popover-content"
    ) as HTMLElement;
    contentElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 50,
        height: 100,
        x: 0,
        y: 0,
      } as DOMRect;
    });

    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelector(".close")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".open")).toBeFalsy();

    act(() => {
      fireEvent.mouseOver(
        element.shadowRoot?.querySelector("slot[name='trigger']") as HTMLElement
      );
    });

    expect(
      (element.shadowRoot?.querySelector(".open") as HTMLElement).style.left
    ).toBe("-44px");
    expect(
      (element.shadowRoot?.querySelector(".open") as HTMLElement).style.top
    ).toBe("10px");
    expect(element.shadowRoot?.querySelector(".open")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".close")).toBeFalsy();

    act(() => {
      fireEvent.mouseOver(document.body);
    });

    expect(element.shadowRoot?.querySelector(".close")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".open")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });

  test("trigger is click, and placement is right", async () => {
    const element = document.createElement("basic.general-popover") as Popover;

    const button = document.createElement("button");
    button.setAttribute("slot", "trigger");
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    element.append(button);
    element.append(content);

    element.trigger = "click";
    element.placement = "right";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    const wrapperElement = element.shadowRoot?.querySelector(
      ".popover-wrapper"
    ) as HTMLElement;
    wrapperElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 100,
        height: 100,
        x: 10,
        y: 10,
      } as DOMRect;
    });
    const contentElement = element.shadowRoot?.querySelector(
      ".popover-content"
    ) as HTMLElement;
    contentElement.getBoundingClientRect = jest.fn(() => {
      return {
        width: 50,
        height: 100,
        x: 0,
        y: 0,
      } as DOMRect;
    });

    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelector(".close")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".open")).toBeFalsy();

    act(() => {
      (
        element.shadowRoot?.querySelector("slot[name='trigger']") as HTMLElement
      ).click();
    });

    expect(
      (element.shadowRoot?.querySelector(".open") as HTMLElement).style.left
    ).toBe("114px");
    expect(
      (element.shadowRoot?.querySelector(".open") as HTMLElement).style.top
    ).toBe("10px");
    expect(element.shadowRoot?.querySelector(".open")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".close")).toBeFalsy();

    act(() => {
      document.body.click();
    });

    expect(element.shadowRoot?.querySelector(".close")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".open")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
