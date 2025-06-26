import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoMessageListener } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const spyOnAddEventListener = jest.spyOn(window, "addEventListener");
const spyOnRemoveEventListener = jest.spyOn(window, "removeEventListener");

describe("eo-message-listener", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-message-listener"
    ) as EoMessageListener;

    const onMessage = jest.fn();
    element.addEventListener("message", (e) => {
      onMessage((e as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });

    act(() => {
      // window.postMessage is not implemented in jest-dom
      (spyOnAddEventListener.mock.calls[0][1] as any)({
        data: "hello",
        origin: location.origin,
      });
    });
    expect(onMessage).toHaveBeenCalledWith({
      data: "hello",
      origin: location.origin,
    });

    act(() => {
      (spyOnAddEventListener.mock.calls[0][1] as any)({
        data: "hi",
        origin: "http://example.com",
      });
    });
    // not called because of sameOrigin
    expect(onMessage).toHaveBeenCalledTimes(1);

    act(() => {
      (spyOnAddEventListener.mock.calls[0][1] as any)({
        data: "world",
        origin: location.origin,
      });
    });
    expect(onMessage).toHaveBeenCalledWith({
      data: "world",
      origin: location.origin,
    });

    act(() => {
      document.body.removeChild(element);
    });

    expect(spyOnRemoveEventListener).toHaveBeenCalledWith(
      ...spyOnAddEventListener.mock.calls[0]
    );
  });
  test("disable same origin", async () => {
    const element = document.createElement(
      "eo-message-listener"
    ) as EoMessageListener;
    element.sameOrigin = false;

    const onMessage = jest.fn();
    element.addEventListener("message", (e) => {
      onMessage((e as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });

    act(() => {
      (spyOnAddEventListener.mock.calls[0][1] as any)({
        data: "hello",
        origin: "http://example.com",
      });
    });
    expect(onMessage).toHaveBeenCalledWith({
      data: "hello",
      origin: "http://example.com",
    });

    act(() => {
      document.body.removeChild(element);
    });
  });
});
