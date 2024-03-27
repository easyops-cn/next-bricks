import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import ".";
import type { ChatView } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("advanced.chat-view", () => {
  test("basic usage", async () => {
    (window as any).ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }));
    const element = document.createElement("advanced.chat-view") as ChatView;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
