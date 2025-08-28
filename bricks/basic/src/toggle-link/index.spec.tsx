import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/dom";
import "./";
import type { ToggleLink } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-toggle-link", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-toggle-link") as ToggleLink;

    expect(element.shadowRoot).toBeFalsy();
    const onToggle = jest.fn();
    element.addEventListener("toggle", (e) => {
      onToggle((e as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.open).toBeFalsy();
    expect(onToggle).toHaveBeenCalledTimes(0);

    fireEvent.click(element.shadowRoot!.querySelector("eo-link")!);
    expect(element.open).toBe(true);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenLastCalledWith(true);

    fireEvent.click(element.shadowRoot!.querySelector("eo-link")!);
    expect(element.open).toBe(false);
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenLastCalledWith(false);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
