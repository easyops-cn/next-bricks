import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoLoadingStep } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const lockBodyScroll = jest.fn();

customElements.define(
  "basic.lock-body-scroll",
  class extends HTMLElement {
    resolve = lockBodyScroll;
  }
);

describe("eo-loading-step", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-loading-step") as EoLoadingStep;
    element.stepTitle = "正在分析中";
    element.stepList = [
      {
        title: "正在从事件中获取资源信息...",
        key: "first",
      },
      {
        title: "事件资源获取成功。",
        key: "second",
      },
      {
        title: "正在匹配资源详情页...",
        key: "third",
      },
      {
        title: "已为您匹配到最佳资源详情页。",
        key: "fourth",
      },
      {
        title: "即将前往基础设施监控, 请等待...",
        key: "fifth",
      },
    ];

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(
      element.shadowRoot.querySelector(".root").classList.contains("close")
    ).toBeTruthy();

    await act(async () => {
      element.open();
      element.curStep = "fourth";
    });
    expect(
      element.shadowRoot.querySelector(".root").classList.contains("open")
    ).toBeTruthy();
    expect(element.shadowRoot.querySelectorAll(".step-item")).toHaveLength(5);

    expect(
      element.shadowRoot.querySelectorAll(".step-item.finished")
    ).toHaveLength(3);
    expect(
      element.shadowRoot.querySelectorAll(".step-item.pending")
    ).toHaveLength(1);
    expect(
      element.shadowRoot.querySelectorAll(".step-item.loading")
    ).toHaveLength(1);

    act(() => {
      element.close();
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
