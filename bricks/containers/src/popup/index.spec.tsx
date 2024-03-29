import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoPopup } from "./index.js";
import { fireEvent } from "@testing-library/react";

jest.mock("@next-core/theme", () => ({}));

jest.mock("@next-shared/general/debounceByAnimationFrame", () => ({
  debounceByAnimationFrame: jest.fn((fn) => fn),
}));
jest.mock("@next-core/utils/general", () => ({
  JsonStorage: jest.fn(() => {
    return {
      getItem: () => [66, 66],
      setItem: jest.fn(),
    };
  }),
}));
jest.mock("@next-core/runtime", () => ({
  getCssPropertyValue: () => "56",
}));

window.innerWidth = 1000;
window.innerHeight = 500;

const originalOffsetWidth = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetWidth"
);
const originalOffsetHeight = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetHeight"
);
const getBoundingClientRectSpy = jest.fn(() => ({
  width: 600,
  height: 400,
  left: 100,
  top: 100,
}));
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    value: 600,
  });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    value: 400,
  });
  Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
    configurable: true,
    value: getBoundingClientRectSpy,
  });
});

afterAll(() => {
  Object.defineProperty(
    HTMLElement.prototype,
    "offsetHeight",
    originalOffsetHeight
  );
  Object.defineProperty(
    HTMLElement.prototype,
    "offsetWidth",
    originalOffsetWidth
  );
});

describe("eo-popup", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-popup") as EoPopup;
    element.visible = true;
    element.popupTitle = "title";
    element.popupWidth = 600;
    element.popupHeight = 400;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const GeneralPopupElement =
      element.shadowRoot!.querySelector(".general-popup");
    expect(GeneralPopupElement).toBeTruthy();
    // init position
    expect((GeneralPopupElement as HTMLElement).style.transform).toBe(
      "translate(200px, 50px)"
    );

    const headerElement = element.shadowRoot.querySelector(
      ".general-popup-header"
    );

    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, "offsetX", { get: () => 20 });
    Object.defineProperty(event, "offsetY", { get: () => 10 });

    expect(headerElement).toBeTruthy();

    fireEvent(headerElement, event);

    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: 100,
        clientY: 100,
      })
    );
    await window.dispatchEvent(new MouseEvent("mouseup", {}));

    expect((GeneralPopupElement as HTMLElement).style.transform).toBe(
      "translate(80px, 90px)"
    );

    // move to outside window
    // left top
    fireEvent(headerElement, event);

    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: -100,
        clientY: -100,
      })
    );

    await window.dispatchEvent(new MouseEvent("mouseup", {}));

    expect((GeneralPopupElement as HTMLElement).style.transform).toBe(
      "translate(0px, 0px)"
    );

    // right top
    fireEvent(headerElement, event);

    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: 1200,
        clientY: 0,
      })
    );

    await window.dispatchEvent(new MouseEvent("mouseup", {}));

    expect((GeneralPopupElement as HTMLElement).style.transform).toBe(
      "translate(400px, 0px)"
    );

    // left bottom
    fireEvent(headerElement, event);

    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: -100,
        clientY: 600,
      })
    );

    await window.dispatchEvent(new MouseEvent("mouseup", {}));

    expect((GeneralPopupElement as HTMLElement).style.transform).toBe(
      "translate(0px, 100px)"
    );

    // right bottom
    fireEvent(headerElement, event);

    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: 1200,
        clientY: 600,
      })
    );
    await window.dispatchEvent(new MouseEvent("mouseup", {}));

    expect((GeneralPopupElement as HTMLElement).style.transform).toBe(
      "translate(400px, 100px)"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("should hidde", async () => {
    const element = document.createElement("eo-popup") as EoPopup;
    element.visible = false;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(1);

    expect(element.shadowRoot.querySelector(".general-popup")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("popup should use localstory position", async () => {
    const element = document.createElement("eo-popup") as EoPopup;
    element.popupId = "popup-a";
    element.visible = true;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      (element.shadowRoot.querySelector(".general-popup") as HTMLElement).style
        .transform
    ).toBe("translate(66px, 66px)");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("should work with resizable", () => {
    const element = document.createElement("eo-popup") as EoPopup;
    element.resizable = true;
    element.visible = true;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const contentElement = element.shadowRoot.querySelector(
      ".content"
    ) as HTMLElement;
    expect(contentElement.style.resize).toEqual("both");
    expect(contentElement.style.maxWidth).toBe("860px");
    expect(contentElement.style.maxHeight).toBe("316px");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("method should work", async () => {
    const element = document.createElement("eo-popup") as EoPopup;
    const toolbarElement = document.createElement("div");
    toolbarElement.textContent = "toolbar";
    toolbarElement.slot = "toolbar";
    element.appendChild(toolbarElement);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(1);

    expect(element.shadowRoot.querySelector(".general-popup")).toBeFalsy();

    await act(async () => {
      await element.open();
    });

    expect(element.shadowRoot.querySelector(".general-popup")).toBeTruthy();

    expect(element.querySelector("div[slot='toolbar']")).toBeTruthy();

    fireEvent.mouseDown(element.querySelector("div[slot='toolbar']"));

    expect(element.visible).toBe(true);

    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });

    fireEvent(element.shadowRoot.querySelector("eo-icon[icon='close']"), event);

    await window.dispatchEvent(new MouseEvent("mouseup", {}));

    expect(element.visible).toBe(false);

    await act(async () => {
      await element.open();
    });

    expect(element.shadowRoot.querySelector(".general-popup")).toBeTruthy();

    await act(async () => {
      await element.close();
    });

    expect(element.shadowRoot.querySelector(".general-popup")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
