import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { EoAvatar } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const LOAD_FAILURE_FLAG = ":LOAD_FAILURE_FLAG";
Object.defineProperty(global.Image.prototype, "src", {
  set(src) {
    if (src.endsWith(LOAD_FAILURE_FLAG)) {
      setTimeout(() => {
        this.dispatchEvent(new Event("error"));
      }, 100);
    } else {
      setTimeout(() => {
        this.dispatchEvent(new Event("load"));
      }, 100);
    }
  },
});

jest.useFakeTimers();

describe("eo-avatar", () => {
  test("img load success", async () => {
    const element = document.createElement("eo-avatar") as EoAvatar;
    element.src = "success";
    element.icon = {
      lib: "antd",
      icon: "user",
      theme: "outlined",
    };

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    await act(async () => {
      jest.runAllTimers();
    });
    expect(element.shadowRoot?.querySelector(".type-img")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".avatar-img")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("img load failed", async () => {
    const element = document.createElement("eo-avatar") as EoAvatar;
    element.src = "failed" + LOAD_FAILURE_FLAG;
    element.icon = {
      lib: "antd",
      icon: "user",
      theme: "outlined",
    };

    expect(element.shadowRoot).toBeFalsy();

    await act(async () => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    await act(async () => {
      jest.runAllTimers();
    });
    expect(element.shadowRoot?.querySelector(".type-icon")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".avatar-icon")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("icon avatar", async () => {
    const element = document.createElement("eo-avatar") as EoAvatar;
    element.icon = {
      lib: "antd",
      icon: "user",
      theme: "outlined",
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".type-icon")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".avatar-icon")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("text avatar", async () => {
    const element = document.createElement("eo-avatar") as EoAvatar;
    element.name = "Lucy";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".type-text")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".avatar-text")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
