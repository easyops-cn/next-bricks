import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./";
import { Button } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-button", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-button") as Button;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.textContent = "Hello world";
      element.size = "large";
      element.type = "primary";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    const button = element.shadowRoot?.querySelector("button");
    const icon = element.shadowRoot?.querySelector(".icon");
    expect(button?.className).toBe("large primary");
    expect(icon).toBe(null);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("danger button", async () => {
    const element = document.createElement("eo-button") as Button;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.textContent = "Hello world";
      element.danger = true;
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    const button = element.shadowRoot?.querySelector("button");
    expect(button?.className).toBe("medium default danger");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("link button", async () => {
    const element1 = document.createElement("eo-button") as Button;
    const element2 = document.createElement("eo-button") as Button;

    expect(element1.shadowRoot).toBeFalsy();
    act(() => {
      element1.textContent = "Hello world";
      element1.type = "link";
      element1.href = "www.baidu.com";
      element2.type = "link";
      document.body.appendChild(element1);
      document.body.appendChild(element2);
    });
    expect(element1.shadowRoot).toBeTruthy();
    expect(element1.shadowRoot?.childNodes.length).toBe(2);

    expect(element1.shadowRoot?.querySelector("button")).toBeTruthy();
    expect(element1.shadowRoot?.querySelector("eo-link")).toBeTruthy();
    expect(element2.shadowRoot?.querySelector("button")).toBeTruthy();
    expect(element2.shadowRoot?.querySelector("eo-link")).toBeFalsy();

    act(() => {
      document.body.removeChild(element1);
      document.body.removeChild(element2);
    });
    expect(element1.shadowRoot?.childNodes.length).toBe(0);
    expect(element2.shadowRoot?.childNodes.length).toBe(0);
  });

  test("button with icon", async () => {
    const element = document.createElement("eo-button") as Button;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.icon = {
        lib: "antd",
        icon: "setting",
        theme: "filled",
      };
      element.shape = "circle";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.querySelector("eo-icon")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("disabled button", async () => {
    const element = document.createElement("eo-button") as Button;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.disabled = true;
      element.textContent = "disabled";
      element.tooltip = "disabled";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(
      element.shadowRoot?.querySelector("button")?.parentElement?.tagName
    ).toBe("SPAN");

    expect(element.shadowRoot?.querySelector("eo-tooltip")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("handle unknown types/sizes/shapes", async () => {
    const element = document.createElement("eo-button") as Button;
    element.textContent = "Hello";
    element.size = "oops" as any;
    element.type = "ouch" as any;
    element.shape = "yaks" as any;

    act(() => {
      document.body.appendChild(element);
    });

    const button = element.shadowRoot?.querySelector("button");
    expect(button?.className).toBe("medium default");

    act(() => {
      document.body.removeChild(element);
    });
  });
});
