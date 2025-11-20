import { describe, test, expect } from "@jest/globals";
import { getByTestId, fireEvent } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import "./";
import { Modal } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const lockBodyScroll = jest.fn();
customElements.define(
  "basic.lock-body-scroll",
  class extends HTMLElement {
    resolve = lockBodyScroll;
  }
);

const requireModalStack = jest.fn(() => ({
  push: jest.fn(),
  pull: jest.fn(),
  isTop: jest.fn(() => true),
}));
customElements.define(
  "basic.require-modal-stack",
  class extends HTMLElement {
    resolve = requireModalStack;
  }
);

describe("eo-modal", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-modal") as Modal;
    const bodyElement = document.createElement("div");
    bodyElement.textContent = "This is a body";
    element.modalTitle = "Modal Title";
    element.maskClosable = true;
    element.fullscreen = true;
    element.width = 180;

    const mockOpenEvent = jest.fn();
    const mockCloseEvent = jest.fn();
    const mockConfirmEvent = jest.fn();
    const mockCancelEvent = jest.fn();
    element.addEventListener("open", mockOpenEvent);
    element.addEventListener("close", mockCloseEvent);
    element.addEventListener("confirm", mockConfirmEvent);
    element.addEventListener("cancel", mockCancelEvent);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.appendChild(bodyElement);
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(1);
    expect(element.innerHTML).toBe("<div>This is a body</div>");

    expect(element.visible).toBeFalsy();
    expect(element.shadowRoot?.querySelector(".modal-root")).toBeFalsy();

    // open
    await act(async () => {
      element.open();
    });

    expect(element.shadowRoot?.childNodes.length).toBe(2);
    expect(mockOpenEvent).toHaveBeenCalledTimes(1);
    expect(element.visible).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".modal-root")).toBeTruthy();
    expect(
      (element.shadowRoot?.querySelector(".modal") as HTMLElement).className
    ).toBe("modal fullscreen");

    // close
    await act(async () => {
      (element.shadowRoot?.querySelector(".close-btn") as HTMLElement).click();
    });

    expect(element.visible).toBeFalsy();
    expect(mockCloseEvent).toHaveBeenCalledTimes(1);
    expect(element.shadowRoot?.querySelector(".modal-root")).toBeFalsy();

    // confirm
    await act(async () => {
      element.open();
    });

    expect(element.visible).toBeTruthy();

    await act(async () => {
      fireEvent.click(
        getByTestId(
          element.shadowRoot as unknown as HTMLElement,
          "confirm-button"
        )
      );
    });

    expect(element.visible).toBeFalsy();
    expect(mockConfirmEvent).toHaveBeenCalledTimes(1);
    expect(mockCloseEvent).toHaveBeenCalledTimes(2);

    // cancel
    await act(async () => {
      element.open();
    });

    await act(async () => {
      fireEvent.click(
        getByTestId(
          element.shadowRoot as unknown as HTMLElement,
          "cancel-button"
        )
      );
    });

    expect(element.visible).toBeFalsy();
    expect(mockCancelEvent).toHaveBeenCalled();
    expect(mockCloseEvent).toHaveBeenCalledTimes(3);

    // click mask and modal close
    await act(async () => {
      element.open();
    });

    await act(async () => {
      (element.shadowRoot?.querySelector(".modal-wrap") as HTMLElement).click();
    });

    expect(element.visible).toBeFalsy();
    expect(mockCloseEvent).toHaveBeenCalledTimes(4);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("closeWhenConfirm was true and click confirm button not close the modal", async () => {
    const element = document.createElement("eo-modal") as Modal;
    element.modalTitle = "Modal Title";
    element.closeWhenConfirm = false;

    const mockCloseEvent = jest.fn();
    const mockConfirmEvent = jest.fn();
    element.addEventListener("close", mockCloseEvent);
    element.addEventListener("confirm", mockConfirmEvent);

    act(() => {
      document.body.appendChild(element);
    });

    expect(mockCloseEvent).toHaveBeenCalledTimes(0);
    expect(element.visible).toBeFalsy();

    await act(async () => {
      element.open();
    });

    await act(async () => {
      fireEvent.click(
        getByTestId(
          element.shadowRoot as unknown as HTMLElement,
          "confirm-button"
        )
      );
    });

    expect(mockConfirmEvent).toHaveBeenCalledTimes(1);
    expect(mockCloseEvent).toHaveBeenCalledTimes(0);
    expect(element.visible).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("close by esc key", async () => {
    const element = document.createElement("eo-modal") as Modal;
    element.modalTitle = "Modal Title";
    element.keyboard = true;

    const mockCloseEvent = jest.fn();
    element.addEventListener("close", mockCloseEvent);

    act(() => {
      document.body.appendChild(element);
    });

    await act(async () => {
      element.open();
    });

    expect(mockCloseEvent).toHaveBeenCalledTimes(0);
    expect(element.visible).toBeTruthy();

    await act(async () => {
      fireEvent.keyDown(document, { key: "Enter" });
    });

    expect(mockCloseEvent).toHaveBeenCalledTimes(0);
    expect(element.visible).toBeTruthy();

    await act(async () => {
      fireEvent.keyDown(element.shadowRoot!.querySelector(".modal-container"), {
        key: "Escape",
      });
    });

    expect(mockCloseEvent).toHaveBeenCalledTimes(1);
    expect(element.visible).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("modal without sidebar content", async () => {
    const element = document.createElement("eo-modal") as Modal;
    element.modalTitle = "Modal Title";

    const bodyElement = document.createElement("div");
    bodyElement.textContent = "This is main content";

    act(() => {
      element.appendChild(bodyElement);
      document.body.appendChild(element);
    });

    await act(async () => {
      element.open();
    });

    expect(element.visible).toBeTruthy();

    // 没有 sidebar 内容时，不应该有 has-sidebar 类
    const modalElement = element.shadowRoot?.querySelector(".modal");
    expect(modalElement?.classList.contains("has-sidebar")).toBeFalsy();

    // sidebar 应该存在但被隐藏
    const sidebarElement = element.shadowRoot?.querySelector(".modal-sidebar");
    expect(sidebarElement).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("modal with sidebar content", async () => {
    const element = document.createElement("eo-modal") as Modal;
    element.modalTitle = "Modal Title with Sidebar";

    const bodyElement = document.createElement("div");
    bodyElement.textContent = "This is main content";

    const sidebarElement = document.createElement("div");
    sidebarElement.slot = "sidebar";
    sidebarElement.textContent = "This is sidebar content";

    act(() => {
      element.appendChild(bodyElement);
      element.appendChild(sidebarElement);
      document.body.appendChild(element);
    });

    await act(async () => {
      element.open();
    });

    // 等待 slotchange 事件触发和状态更新
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(element.visible).toBeTruthy();

    // 有 sidebar 内容时，应该有 has-sidebar 类
    const modalElement = element.shadowRoot?.querySelector(".modal");
    expect(modalElement?.classList.contains("has-sidebar")).toBeTruthy();

    // 检查 sidebar 插槽是否正确渲染内容
    const sidebarSlot = element.shadowRoot?.querySelector(
      'slot[name="sidebar"]'
    ) as HTMLSlotElement;
    expect(sidebarSlot).toBeTruthy();
    expect(sidebarSlot?.assignedElements().length).toBeGreaterThan(0);

    // 验证 modal-main-content 存在
    const mainContent = element.shadowRoot?.querySelector(
      ".modal-main-content"
    );
    expect(mainContent).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("sidebar content dynamically added", async () => {
    const element = document.createElement("eo-modal") as Modal;
    element.modalTitle = "Modal Title";

    const bodyElement = document.createElement("div");
    bodyElement.textContent = "This is main content";

    act(() => {
      element.appendChild(bodyElement);
      document.body.appendChild(element);
    });

    await act(async () => {
      element.open();
    });

    // 初始没有 has-sidebar 类
    let modalElement = element.shadowRoot?.querySelector(".modal");
    expect(modalElement?.classList.contains("has-sidebar")).toBeFalsy();

    // 动态添加 sidebar 内容
    const sidebarElement = document.createElement("div");
    sidebarElement.slot = "sidebar";
    sidebarElement.textContent = "Dynamically added sidebar";

    await act(async () => {
      element.appendChild(sidebarElement);
    });

    // 等待 slotchange 事件触发
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // 现在应该有 has-sidebar 类
    modalElement = element.shadowRoot?.querySelector(".modal");
    expect(modalElement?.classList.contains("has-sidebar")).toBeTruthy();

    // 移除 sidebar 内容
    await act(async () => {
      element.removeChild(sidebarElement);
    });

    // 等待 slotchange 事件触发
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // 应该移除 has-sidebar 类
    modalElement = element.shadowRoot?.querySelector(".modal");
    expect(modalElement?.classList.contains("has-sidebar")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
  });
});
