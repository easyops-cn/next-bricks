import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { MicroView } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-micro-view", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-micro-view") as MicroView;
    element.pageTitle = "Hello world";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot.querySelector("eo-page-title")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
