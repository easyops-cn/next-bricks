import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./index.jsx";
import { Drawer } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));
const spyOnScrollTo = jest.fn();
window.HTMLElement.prototype.scrollTo = spyOnScrollTo;
const lockBodyScroll = jest.fn();
customElements.define(
  "basic.lock-body-scroll",
  class extends HTMLElement {
    resolve = lockBodyScroll;
  }
);
// todo: update unit test
describe("eo-drawer", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-drawer") as Drawer;

    element.visible = false;
    element.customTitle = "customTitle";
    element.footerSlot = true;
    const mockOpenEvent = jest.fn();
    const mockCloseEvnet = jest.fn();
    element.addEventListener("open", mockOpenEvent);
    element.addEventListener("close", mockCloseEvnet);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);
    expect(element.shadowRoot?.querySelector(".mask")).toBeTruthy();

    // open
    await act(async () => {
      element.open();
    });

    expect(element.shadowRoot?.childNodes.length).toBe(2);
    expect(mockOpenEvent).toBeCalledTimes(1);
    expect(element.visible).toBeTruthy();
    // close
    await act(async () => {
      (element.shadowRoot?.querySelector(".mask") as HTMLElement).click();
    });

    expect(element.visible).toBeFalsy();
    expect(mockCloseEvnet).toBeCalledTimes(1);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
