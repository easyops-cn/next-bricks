import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent } from "@testing-library/dom";
import "./";
import type { Iframe } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-iframe", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-iframe") as Iframe;
    element.src = "http://localhost/iframe";

    const onLoad = jest.fn();
    element.addEventListener("load", onLoad);

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const iframe = element.shadowRoot?.querySelector(
      "iframe"
    ) as HTMLIFrameElement;
    fireEvent.load(iframe);
    expect(onLoad).toBeCalledTimes(1);

    const mockPostMessage = jest.fn();
    Object.defineProperty(iframe, "contentWindow", {
      get() {
        return {
          postMessage: mockPostMessage,
        } as any;
      },
    });
    element.postMessage("hello", location.origin);
    expect(mockPostMessage).toBeCalledWith("hello", location.origin);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("set src later", async () => {
    const element = document.createElement("eo-iframe") as Iframe;

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelectorAll("iframe").length).toBe(0);

    await act(async () => {
      element.src = "http://localhost/iframe";
      await (global as any).flushPromises();
    });
    expect(element.shadowRoot?.querySelectorAll("iframe").length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
