import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoEventAgent } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-event-agent", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-event-agent") as EoEventAgent;

    const onTrigger = jest.fn();
    element.addEventListener("trigger", (e) => {
      onTrigger((e as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });

    element.trigger({ type: "foo" });
    expect(onTrigger).toBeCalledWith({ type: "foo" });

    act(() => {
      document.body.removeChild(element);
    });
  });
});
