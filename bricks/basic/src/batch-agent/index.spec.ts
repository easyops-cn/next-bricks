import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoBatchAgent } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-batch-agent", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-batch-agent") as EoBatchAgent;

    const onTrigger = jest.fn();
    element.addEventListener("trigger", (e) => {
      onTrigger((e as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });

    element.trigger("foo");
    element.trigger("bar");
    element.trigger("foo");
    expect(onTrigger).not.toHaveBeenCalled();

    await Promise.resolve();
    expect(onTrigger).toHaveBeenCalledTimes(2);
    expect(onTrigger).toHaveBeenNthCalledWith(1, { type: "foo" });
    expect(onTrigger).toHaveBeenNthCalledWith(2, { type: "bar" });

    element.trigger("bar");
    expect(onTrigger).toHaveBeenCalledTimes(2);
    await Promise.resolve();
    expect(onTrigger).toHaveBeenCalledTimes(3);
    expect(onTrigger).toHaveBeenNthCalledWith(3, { type: "bar" });

    act(() => {
      document.body.removeChild(element);
    });
  });
});
