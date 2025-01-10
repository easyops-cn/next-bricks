import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import type { ChatAgent } from "./index.js";
import { createSSEStream } from "@next-core/utils/general";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/utils/general");
const consoleError = jest.spyOn(console, "error").mockReturnValue();
const mockCreateSSEStream = createSSEStream as jest.Mock<any>;

describe("ai.chat-agent", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("basic usage", async () => {
    const element = document.createElement("ai.chat-agent") as ChatAgent;
    element.agentId = "test";

    const onMessagesUpdate = jest.fn();
    element.addEventListener("messages.update", (event) => {
      onMessagesUpdate((event as CustomEvent).detail);
    });
    const onBusyChange = jest.fn();
    element.addEventListener("busy.change", (event) => {
      onBusyChange((event as CustomEvent).detail);
    });
    const onConversationIdChange = jest.fn();
    element.addEventListener("conversationId.change", (event) => {
      onConversationIdChange((event as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });

    mockCreateSSEStream.mockImplementation(async function () {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return (async function* () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield {
          delta: {
            role: "assistant",
            content: "Hello",
          },
          conversationId: "chat-1",
          key: 1,
        };
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield {
          delta: {
            role: "assistant",
            content: "World",
          },
          conversationId: "chat-1",
          key: 1,
        };
        await new Promise((resolve) => setTimeout(resolve, 100));
      })();
    });

    await (global as any).flushPromises();
    expect(onBusyChange).not.toHaveBeenCalled();
    expect(onMessagesUpdate).not.toHaveBeenCalled();

    let promise: Promise<string | null> | undefined;
    act(() => {
      promise = element.postMessage("Hi");
      // Should be ignored when the agent is busy.
      element.postMessage("Halo");
    });
    await (global as any).flushPromises();
    expect(onBusyChange).toHaveBeenCalledTimes(1);
    expect(onBusyChange).toHaveBeenLastCalledWith(true);

    // Should be ignored when the agent is busy.
    element.postMessage("你好");

    expect(onMessagesUpdate).toHaveBeenCalledTimes(1);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
    ]);

    jest.advanceTimersByTime(100);

    while (onMessagesUpdate.mock.calls.length < 2) {
      await act(async () => {
        await (global as any).flushPromises();
      });
    }

    expect(onMessagesUpdate).toHaveBeenCalledTimes(2);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
      {
        role: "assistant",
        content: "",
        key: 1,
        partial: true,
      },
    ]);

    expect(onConversationIdChange).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(onMessagesUpdate).toHaveBeenCalledTimes(3);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
      {
        role: "assistant",
        content: "Hello",
        key: 1,
        partial: true,
      },
    ]);

    expect(onConversationIdChange).toHaveBeenCalledTimes(1);
    expect(onConversationIdChange).toHaveBeenLastCalledWith("chat-1");

    jest.advanceTimersByTime(100);
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(onMessagesUpdate).toHaveBeenCalledTimes(4);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
      {
        role: "assistant",
        content: "HelloWorld",
        key: 1,
        partial: true,
      },
    ]);
    expect(onBusyChange).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(onMessagesUpdate).toHaveBeenCalledTimes(5);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
      {
        role: "assistant",
        content: "HelloWorld",
        key: 1,
        partial: false,
      },
    ]);
    expect(onBusyChange).toHaveBeenCalledTimes(2);
    expect(onBusyChange).toHaveBeenLastCalledWith(false);

    const conversationId = await promise!;
    expect(conversationId).toBe("chat-1");

    act(() => {
      document.body.removeChild(element);
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

  test("handle error", async () => {
    const element = document.createElement("ai.chat-agent") as ChatAgent;
    element.agentId = "test";

    const onMessagesUpdate = jest.fn();
    element.addEventListener("messages.update", (event) => {
      onMessagesUpdate((event as CustomEvent).detail);
    });
    const onBusyChange = jest.fn();
    element.addEventListener("busy.change", (event) => {
      onBusyChange((event as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });

    mockCreateSSEStream.mockImplementation(async function () {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return (async function* () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield {
          delta: {
            role: "assistant",
            content: "Hello",
          },
          key: 1,
        };
        throw new Error("Oops");
      })();
    });

    await (global as any).flushPromises();
    expect(onBusyChange).not.toHaveBeenCalled();
    expect(onMessagesUpdate).not.toHaveBeenCalled();

    act(() => {
      element.postMessage("Hi");
    });
    await (global as any).flushPromises();
    expect(onBusyChange).toHaveBeenCalledTimes(1);
    expect(onBusyChange).toHaveBeenLastCalledWith(true);

    // Should be ignored when the agent is busy.
    element.postMessage("Hi");

    expect(onMessagesUpdate).toHaveBeenCalledTimes(1);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
    ]);

    jest.advanceTimersByTime(100);

    while (onMessagesUpdate.mock.calls.length < 2) {
      await act(async () => {
        await (global as any).flushPromises();
      });
    }

    expect(onMessagesUpdate).toHaveBeenCalledTimes(2);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
      {
        role: "assistant",
        content: "",
        key: 1,
        partial: true,
      },
    ]);
    expect(onBusyChange).toHaveBeenCalledTimes(1);
    expect(consoleError).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(onMessagesUpdate).toHaveBeenCalledTimes(3);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
      {
        role: "assistant",
        content: "Hello",
        key: 1,
        partial: false,
        failed: true,
      },
      {
        role: "assistant",
        content: "系统错误",
        key: 2,
        failed: true,
      },
    ]);
    expect(onBusyChange).toHaveBeenCalledTimes(2);
    expect(onBusyChange).toHaveBeenLastCalledWith(false);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      "stream failed:",
      new Error("Oops")
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("new conversation after initial response", async () => {
    const element = document.createElement("ai.chat-agent") as ChatAgent;
    element.agentId = "test";

    const onMessagesUpdate = jest.fn();
    element.addEventListener("messages.update", (event) => {
      onMessagesUpdate((event as CustomEvent).detail);
    });
    const onBusyChange = jest.fn();
    element.addEventListener("busy.change", (event) => {
      onBusyChange((event as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });

    mockCreateSSEStream.mockImplementation(async function () {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return (async function* () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield {
          delta: {
            role: "assistant",
            content: "Hello",
          },
          conversationId: "chat-1",
          key: 1,
        };
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield {
          delta: {
            role: "assistant",
            content: "World",
          },
          conversationId: "chat-1",
          key: 1,
        };
        await new Promise((resolve) => setTimeout(resolve, 100));
      })();
    });

    await (global as any).flushPromises();
    expect(onBusyChange).not.toHaveBeenCalled();
    expect(onMessagesUpdate).not.toHaveBeenCalled();

    let conversationPromise: Promise<string | null> | undefined;
    act(() => {
      conversationPromise = element.postMessage("Hi");
      conversationPromise!.catch(() => {});
    });
    await (global as any).flushPromises();
    expect(onBusyChange).toHaveBeenCalledTimes(1);
    expect(onBusyChange).toHaveBeenLastCalledWith(true);

    expect(onMessagesUpdate).toHaveBeenCalledTimes(1);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
    ]);

    act(() => {
      element.newConversation();
    });

    jest.advanceTimersByTime(100);

    await expect(() => conversationPromise).rejects.toMatchInlineSnapshot(
      `[Error: New conversation started]`
    );

    expect(onBusyChange).toHaveBeenCalledTimes(2);
    expect(onBusyChange).toHaveBeenLastCalledWith(false);
    expect(onMessagesUpdate).toHaveBeenCalledTimes(2);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("new conversation during messages", async () => {
    const element = document.createElement("ai.chat-agent") as ChatAgent;
    element.agentId = "test";

    const onMessagesUpdate = jest.fn();
    element.addEventListener("messages.update", (event) => {
      onMessagesUpdate((event as CustomEvent).detail);
    });
    const onBusyChange = jest.fn();
    element.addEventListener("busy.change", (event) => {
      onBusyChange((event as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });

    mockCreateSSEStream.mockImplementation(async function () {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return (async function* () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield {
          delta: {
            role: "assistant",
            content: "Hello",
          },
          conversationId: "chat-1",
          key: 1,
        };
        await new Promise((resolve) => setTimeout(resolve, 100));
      })();
    });

    await (global as any).flushPromises();
    expect(onBusyChange).not.toHaveBeenCalled();
    expect(onMessagesUpdate).not.toHaveBeenCalled();

    let conversationPromise: Promise<string | null> | undefined;
    act(() => {
      conversationPromise = element.postMessage("Hi");
      conversationPromise!.catch(() => {});
    });
    await (global as any).flushPromises();
    expect(onBusyChange).toHaveBeenCalledTimes(1);
    expect(onBusyChange).toHaveBeenLastCalledWith(true);

    expect(onMessagesUpdate).toHaveBeenCalledTimes(1);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
    ]);

    jest.advanceTimersByTime(100);

    while (onMessagesUpdate.mock.calls.length < 2) {
      await act(async () => {
        await (global as any).flushPromises();
      });
    }

    expect(onMessagesUpdate).toHaveBeenCalledTimes(2);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
      {
        role: "assistant",
        content: "",
        key: 1,
        partial: true,
      },
    ]);
    expect(onBusyChange).toHaveBeenCalledTimes(1);
    expect(consoleError).not.toHaveBeenCalled();

    // jest.advanceTimersByTime(100);
    // await act(async () => {
    //   await (global as any).flushPromises();
    // });

    act(() => {
      element.newConversation();
    });

    jest.advanceTimersByTime(100);

    await expect(() => conversationPromise).rejects.toMatchInlineSnapshot(
      `[Error: New conversation started]`
    );

    expect(onBusyChange).toHaveBeenCalledTimes(2);
    expect(onBusyChange).toHaveBeenLastCalledWith(false);
    expect(onMessagesUpdate).toHaveBeenCalledTimes(3);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([]);

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("new conversation just before messages done", async () => {
    const element = document.createElement("ai.chat-agent") as ChatAgent;
    element.agentId = "test";

    const onMessagesUpdate = jest.fn();
    element.addEventListener("messages.update", (event) => {
      onMessagesUpdate((event as CustomEvent).detail);
    });
    const onBusyChange = jest.fn();
    element.addEventListener("busy.change", (event) => {
      onBusyChange((event as CustomEvent).detail);
    });
    const onConversationIdChange = jest.fn();
    element.addEventListener("conversationId.change", (event) => {
      onConversationIdChange((event as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });

    mockCreateSSEStream.mockImplementation(async function () {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return (async function* () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield {
          delta: {
            role: "assistant",
            content: "Hello",
          },
          conversationId: "chat-1",
          key: 1,
        };
        await new Promise((resolve) => setTimeout(resolve, 100));
      })();
    });

    await (global as any).flushPromises();
    expect(onBusyChange).not.toHaveBeenCalled();
    expect(onMessagesUpdate).not.toHaveBeenCalled();

    let conversationPromise: Promise<string | null> | undefined;
    act(() => {
      conversationPromise = element.sendRequest("Hi", "api/test", {});
      conversationPromise!.catch(() => {});
    });
    await (global as any).flushPromises();
    expect(onBusyChange).toHaveBeenCalledTimes(1);
    expect(onBusyChange).toHaveBeenLastCalledWith(true);

    expect(onMessagesUpdate).toHaveBeenCalledTimes(1);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
    ]);

    jest.advanceTimersByTime(100);

    while (onMessagesUpdate.mock.calls.length < 2) {
      await act(async () => {
        await (global as any).flushPromises();
      });
    }

    expect(onMessagesUpdate).toHaveBeenCalledTimes(2);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
      {
        role: "assistant",
        content: "",
        key: 1,
        partial: true,
      },
    ]);
    expect(onBusyChange).toHaveBeenCalledTimes(1);
    expect(consoleError).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(onMessagesUpdate).toHaveBeenCalledTimes(3);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([
      {
        role: "user",
        content: "Hi",
        key: 0,
      },
      {
        role: "assistant",
        content: "Hello",
        key: 1,
        partial: true,
      },
    ]);

    expect(onConversationIdChange).toHaveBeenCalledTimes(1);
    expect(onConversationIdChange).toHaveBeenLastCalledWith("chat-1");

    act(() => {
      element.newConversation();
    });

    jest.advanceTimersByTime(100);

    await expect(() => conversationPromise).rejects.toMatchInlineSnapshot(
      `[Error: New conversation started]`
    );

    expect(onBusyChange).toHaveBeenCalledTimes(2);
    expect(onBusyChange).toHaveBeenLastCalledWith(false);
    expect(onMessagesUpdate).toHaveBeenCalledTimes(4);
    expect(onMessagesUpdate).toHaveBeenLastCalledWith([]);
    expect(onConversationIdChange).toHaveBeenCalledTimes(2);
    expect(onConversationIdChange).toHaveBeenLastCalledWith(null);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
