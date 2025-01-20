import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { EoPopup } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
const mockStorageSetItem = jest.fn();
jest.mock("@next-core/utils/general", () => ({
  JsonStorage: jest.fn(() => {
    return {
      getItem: () => ({
        position: [66, 66],
        size: [315, 388],
      }),
      setItem: mockStorageSetItem,
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
  width: 200,
  height: 300,
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

beforeEach(() => {
  jest.clearAllMocks();
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

    expect(element.shadowRoot.querySelector(".general-popup")).toBeTruthy();

    expect(
      (element.shadowRoot.querySelector(".general-popup") as HTMLElement)!.style
        .width
    ).toBe("600px");
    expect(
      (element.shadowRoot.querySelector(".general-popup") as HTMLElement)!.style
        .height
    ).toBe("400px");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
