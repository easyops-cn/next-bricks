import { describe, test, expect } from "@jest/globals";
import { showNotification } from "./show-notification.jsx";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";

customElements.define("sl-alert", class extends HTMLElement {});

type Animate = {
  (
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions | undefined
  ): Animation;
  (
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions | undefined
  ): Animation;
};

let originalAnimateFunction: Animate;

// Mock native animate function
beforeAll(() => {
  originalAnimateFunction = HTMLElement.prototype.animate;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  HTMLElement.prototype.animate = () => {
    const animation: {
      onfinish?: () => void;
    } = {};
    setTimeout(() => {
      animation.onfinish?.();
    }, 0);

    return animation;
  };
});

afterAll(() => {
  HTMLElement.prototype.animate = originalAnimateFunction;
});

beforeEach(() => {
  document.body.innerHTML = "";
});

jest.useFakeTimers();

describe("showNotification", () => {
  test("general", async () => {
    act(() => {
      showNotification({ type: "success", message: "Done!" });
    });
    expect(document.querySelector(".notification-wrapper-center")).toBeTruthy();
    expect(document.querySelectorAll(".notificationItem").length).toBe(1);
    expect(
      document.querySelector("eo-icon[slot=icon]")?.getAttribute("icon")
    ).toBe("check-circle");
    expect(document.querySelector(".message")?.innerHTML).toBe("Done!");

    act(() => {
      showNotification({ type: "error", message: "Oops!", title: "Error" });
    });
    expect(document.querySelectorAll(".notificationItem").length).toBe(2);
    expect(document.querySelector(".title")?.innerHTML).toBe("Error");
    expect(
      document
        .querySelector(".notificationItem:last-child eo-icon[slot=icon]")
        ?.getAttribute("icon")
    ).toBe("close-circle");

    act(() => {
      showNotification({ type: "warn", message: "Oops!", title: "Warn" });
    });
    expect(document.querySelectorAll(".notificationItem").length).toBe(3);
    expect(
      document
        .querySelector(".notificationItem:last-child eo-icon[slot=icon]")
        ?.getAttribute("icon")
    ).toBe("exclamation-circle");

    act(() => {
      showNotification({ message: "Normal", placement: "topRight" });
    });
    expect(document.querySelectorAll(".notificationItem").length).toBe(4);
    expect(
      document
        .querySelector(
          ".notification-wrapper-topRight .notificationItem eo-icon[slot=icon]"
        )
        ?.getAttribute("icon")
    ).toBe("info-circle");
  });

  test("promise confirm", async () => {
    let promise: Promise<void> | undefined;
    act(() => {
      promise = showNotification({
        htmlMessage: "<b>Normal Message</b>",
        placement: "topRight",
        closable: true,
        icon: { lib: "antd", icon: "search" },
        duration: 3000,
        showConfirm: true,
        confirmText: "确认吗",
      });
    });

    expect(document.querySelectorAll("eo-link").length).toBe(1);
    expect(document.querySelectorAll("eo-link")[0].innerHTML).toBe("确认吗");
    expect(
      document.querySelector("eo-icon[slot=icon]")?.getAttribute("icon")
    ).toBe("search");
    expect(document.querySelector("sl-alert")?.getAttribute("closable")).toBe(
      ""
    );

    act(() => {
      fireEvent.click(document.querySelector("eo-link:first-child")!);
    });
    await expect(promise).resolves.toEqual(undefined);
  });

  test("promise cancel", async () => {
    let promise: Promise<void> | undefined;
    act(() => {
      promise = showNotification({
        title: "Normal Message",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        placement: "topLeft",
        closable: true,
        icon: { lib: "antd", icon: "search" },
        duration: 3000,
        showConfirm: true,
        showCancel: true,
        confirmText: "确认吗",
        cancelText: "取消吗",
      });
    });

    expect(document.querySelectorAll("eo-link").length).toBe(2);
    expect(document.querySelectorAll("eo-link")[1].innerHTML).toBe("取消吗");

    act(() => {
      fireEvent.click(document.querySelector("eo-link[type=text]")!);
    });

    await expect(promise).rejects.toEqual(undefined);
  });

  test("sl-hide with rejects", async () => {
    let promise: Promise<void> | undefined;
    act(() => {
      promise = showNotification({
        title: "Normal Message",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        placement: "topLeft",
        closable: true,
        icon: { lib: "antd", icon: "search" },
        duration: 3000,
        showConfirm: true,
        showCancel: true,
        confirmText: "确认吗",
        cancelText: "取消吗",
      });
    });

    act(() => {
      fireEvent(document.querySelector("sl-alert")!, new Event("sl-hide"));
    });

    await expect(promise).rejects.toEqual(undefined);
  });

  test("sl-hide with resolves", async () => {
    let promise: Promise<void> | undefined;
    act(() => {
      promise = showNotification({
        title: "Normal Message",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        placement: "topLeft",
        closable: true,
        icon: { lib: "antd", icon: "search" },
        duration: 3000,
        showConfirm: true,
        // showCancel: true,
        confirmText: "确认吗",
        cancelText: "取消吗",
      });
    });

    act(() => {
      fireEvent(document.querySelector("sl-alert")!, new Event("sl-hide"));
    });

    await expect(promise).resolves.toEqual(undefined);
  });

  test("inline link", async () => {
    act(() => {
      showNotification({
        message: "Normal",
        placement: "topRight",
        inlineLink: { text: "查看详情", href: "https://example.com" },
      });
    });

    expect(document.querySelectorAll("eo-link").length).toBe(1);
    expect(document.querySelector("eo-link")?.innerHTML).toBe("查看详情");
    expect(document.querySelector("eo-link")?.getAttribute("href")).toBe(
      "https://example.com"
    );
  });
});
