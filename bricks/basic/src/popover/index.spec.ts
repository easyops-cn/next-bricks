import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { Popover } from "./index.jsx";
import { fireEvent } from "@testing-library/react";

jest.mock("@next-core/theme", () => ({}));

describe("basic.general-popover", () => {
  test("trigger is click, and placement is default(bottom)", async () => {
    const element = document.createElement("basic.general-popover") as Popover;

    const button = document.createElement("button");
    button.setAttribute("slot", "trigger");
    button.textContent = "btn";

    const content = document.createElement("div");
    content.textContent = "hello world";

    element.append(button);
    element.append(content);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
