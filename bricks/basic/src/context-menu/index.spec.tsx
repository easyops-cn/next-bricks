import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./";
import type { EoContextMenu } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const lockBodyScroll = jest.fn();

customElements.define(
  "basic.lock-body-scroll",
  class extends HTMLElement {
    resolve = lockBodyScroll;
  }
);

customElements.define(
  "eo-actions",
  class extends HTMLElement {
    actions?: unknown[];
  }
);

describe("eo-context-menu", () => {
  test("basic usage", async () => {
    const onActionClick = jest.fn();
    const element = document.createElement("eo-context-menu") as EoContextMenu;
    element.addEventListener("action.click", (e: Event) =>
      onActionClick((e as CustomEvent).detail)
    );

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(lockBodyScroll).toBeCalledTimes(1);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(1, element, false);

    element.open({ position: [10, 20] });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(true);
    expect(lockBodyScroll).toBeCalledTimes(2);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(2, element, true);

    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style
        .left
    ).toBe("10px");
    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style.top
    ).toBe("20px");

    // Click on an action
    act(() => {
      fireEvent(
        element.shadowRoot!.querySelector("eo-actions")!,
        new CustomEvent("action.click", { detail: { event: "a.click" } })
      );
    });
    expect(onActionClick).toBeCalledWith({
      event: "a.click",
    });

    // Closed after action click
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(false);
    expect(lockBodyScroll).toBeCalledTimes(3);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(3, element, false);

    // Re-open again
    element.open({ position: [20, 30] });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(true);
    expect(lockBodyScroll).toBeCalledTimes(4);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(4, element, true);

    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style
        .left
    ).toBe("20px");
    expect(
      (element.shadowRoot!.querySelector("eo-actions") as HTMLElement).style.top
    ).toBe("30px");

    // Closed after mask click
    // Click on an action
    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector(".mask")!);
    });
    await act(() => (global as any).flushPromises());
    expect(element.active).toBe(false);
    expect(lockBodyScroll).toBeCalledTimes(5);
    expect(lockBodyScroll).toHaveBeenNthCalledWith(5, element, false);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
