import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { EoBroadcastChannel } from "./index.js";

jest.mock("./polyfill", () => {
  const channels = new Map<string, Set<any>>();
  class BroadcastChannel {
    messageListeners = new Set<Function>();
    private channelName: string;
    constructor(channelName: string) {
      this.channelName = channelName;
      let list = channels.get(channelName);
      if (!list) {
        channels.set(channelName, (list = new Set()));
      }
      list.add(this);
    }
    addEventListener(eventType: string, fn: Function): void {
      if (eventType === "message") {
        this.messageListeners.add(fn);
      }
    }
    removeEventListener(eventType: string, fn: Function): void {
      if (eventType === "message") {
        this.messageListeners.delete(fn);
      }
    }
    postMessage(data: unknown): void {
      for (const channel of channels.get(this.channelName) ?? []) {
        if (channel !== this) {
          for (const fn of channel.messageListeners) {
            fn(data);
          }
        }
      }
    }
    close(): void {
      this.messageListeners.clear();
      channels.get(this.channelName)!.delete(this);
    }
  }

  return {
    getBroadcastChannelPolyfill: () => Promise.resolve(BroadcastChannel),
  };
});

describe("eo-broadcast-channel", () => {
  test("basic usage", async () => {
    const elementA = document.createElement(
      "eo-broadcast-channel"
    ) as EoBroadcastChannel;
    const elementB = document.createElement(
      "eo-broadcast-channel"
    ) as EoBroadcastChannel;
    const elementC = document.createElement(
      "eo-broadcast-channel"
    ) as EoBroadcastChannel;
    const elementD = document.createElement(
      "eo-broadcast-channel"
    ) as EoBroadcastChannel;
    elementA.channel = "test";
    elementB.channel = "test";
    elementC.channel = "other";
    // elementD has no channel

    const onMessageA = jest.fn();
    elementA.addEventListener("message", (e) => {
      onMessageA((e as CustomEvent).detail);
    });
    const onMessageB = jest.fn();
    elementB.addEventListener("message", (e) => {
      onMessageB((e as CustomEvent).detail);
    });
    const onMessageC = jest.fn();
    elementC.addEventListener("message", (e) => {
      onMessageC((e as CustomEvent).detail);
    });
    const onMessageD = jest.fn();
    elementD.addEventListener("message", (e) => {
      onMessageD((e as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(elementA);
      document.body.appendChild(elementB);
      document.body.appendChild(elementC);
      document.body.appendChild(elementD);
    });

    await act(async () => {
      await (global as any).flushPromises();
    });

    elementA.postMessage("message from A");
    expect(onMessageB).toBeCalledWith("message from A");

    elementB.postMessage("message from B");
    expect(onMessageA).toBeCalledWith("message from B");

    elementC.postMessage("message from B");
    expect(onMessageA).toBeCalledTimes(1);
    expect(onMessageB).toBeCalledTimes(1);
    expect(onMessageC).not.toBeCalled();
    expect(onMessageD).not.toBeCalled();

    act(() => {
      document.body.removeChild(elementA);
      document.body.removeChild(elementB);
      document.body.removeChild(elementC);
      document.body.removeChild(elementD);
    });
  });
});
