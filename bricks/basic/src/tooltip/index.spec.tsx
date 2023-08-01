import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoTooltip } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

class SlTooltipElement extends HTMLElement {
  show() {
    this.dispatchEvent(new Event("sl-show"));
    setTimeout(() => {
      this.dispatchEvent(new Event("sl-after-show"));
    }, 1000);
  }
  hide() {
    this.dispatchEvent(new Event("sl-hide"));
    setTimeout(() => {
      this.dispatchEvent(new Event("sl-after-hide"));
    }, 1000);
  }
}
customElements.define("sl-tooltip", SlTooltipElement);

jest.useFakeTimers();

describe("eo-tooltip", () => {
  test("basic usage", async () => {
    const onOpenChange = jest.fn();
    const onAfterOpenChange = jest.fn();
    const element = document.createElement("eo-tooltip") as EoTooltip;
    element.addEventListener("open.change", onOpenChange);
    element.addEventListener("after.open.change", onAfterOpenChange);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const slTooltipElement = element.shadowRoot?.querySelector(
      "sl-tooltip"
    ) as SlTooltipElement;

    act(() => {
      slTooltipElement.show();
    });
    expect(onOpenChange).lastCalledWith(
      expect.objectContaining({
        detail: true,
      })
    );
    expect(onAfterOpenChange).not.toBeCalled();
    jest.runAllTimers();
    expect(onAfterOpenChange).lastCalledWith(
      expect.objectContaining({
        detail: true,
      })
    );

    act(() => {
      slTooltipElement.hide();
    });
    expect(onOpenChange).lastCalledWith(
      expect.objectContaining({
        detail: false,
      })
    );
    expect(onAfterOpenChange).not.toBeCalledWith(
      expect.objectContaining({
        detail: false,
      })
    );
    jest.runAllTimers();
    expect(onAfterOpenChange).lastCalledWith(
      expect.objectContaining({
        detail: false,
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("don't show tooltip when content is empty", async () => {
    const element = document.createElement("eo-tooltip") as EoTooltip;
    const contentElement = document.createElement("div");
    contentElement.slot = "content";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      element.shadowRoot?.querySelector("sl-tooltip")?.hasAttribute("disabled")
    ).toBeTruthy();

    await act(async () => {
      element.content = "test";
    });
    expect(
      element.shadowRoot?.querySelector("sl-tooltip")?.hasAttribute("disabled")
    ).toBeFalsy();

    await act(async () => {
      element.content = undefined;
      element.appendChild(contentElement);
    });
    expect(
      element.shadowRoot?.querySelector("sl-tooltip")?.hasAttribute("disabled")
    ).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
