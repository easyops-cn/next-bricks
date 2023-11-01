import { describe, test, expect } from "@jest/globals";
import { act } from "@testing-library/react";
import "./";
import { Form } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-form", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-form") as Form;
    element.layout = "vertical";
    element.values = {
      name: "test",
    };
    element.setInitValue({ age: 10, name: "test" });

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(1);
    expect(element.isFormElement).toEqual(true);

    expect(element.shadowRoot?.querySelector("slot")?.style.display).toBe(
      "flex"
    );

    expect(element.shadowRoot?.querySelector("slot")?.style.flexDirection).toBe(
      "column"
    );

    await act(async () => {
      await (element.layout = "inline");
    });

    expect(element.shadowRoot?.querySelector("slot")?.style.flexDirection).toBe(
      ""
    );

    expect(element.shadowRoot?.querySelector("slot")?.style.gap).toBe("10px");

    await act(async () => {
      await (element.layout = "horizontal");
    });

    expect(element.shadowRoot?.querySelector("slot")?.style.flexDirection).toBe(
      "column"
    );

    expect(element.shadowRoot?.querySelector("slot")?.style.gap).toBe("");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
