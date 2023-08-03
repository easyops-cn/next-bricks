import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoCounterBadge } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-counter-badge", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-counter-badge"
    ) as EoCounterBadge;
    element.icon = {
      icon: "plus-circle",
      lib: "antd",
      theme: "outlined",
    };
    element.count = 12;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelectorAll("eo-icon")?.length).toBe(1);

    element.dot = true;
    element.count = 200;

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
