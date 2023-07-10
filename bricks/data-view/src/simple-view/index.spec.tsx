import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { SimpleView } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("data-view.dot-view", () => {
  test("basic usage", async () => {
    const element = document.createElement("data-view.simple-view") as SimpleView;

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
