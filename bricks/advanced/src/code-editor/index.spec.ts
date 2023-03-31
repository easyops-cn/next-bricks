import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { CodeEditor } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

// todo: write unit test
describe("advanced.code-editor", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "advanced.code-editor"
    ) as CodeEditor;

    const codeChangeEvent = jest.fn();
    element.addEventListener("change", codeChangeEvent);
    element.mode = "brick_next_yaml";
    element.value = "- a: <% CTX.a %>";
    element.theme = 'github';

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(5);

    expect(codeChangeEvent).toBeCalledTimes(0);

    act(() => {
      element["_handleChange"]("- b: <% APP.homepage %>");
    })

    expect(codeChangeEvent).toBeCalledTimes(1);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
