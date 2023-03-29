import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { Modal } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("basic.general-button", () => {
  test("basic usage", async () => {
    const element = document.createElement("basic.general-modal") as Modal;
    const bodyElement = document.createElement("div");
    bodyElement.textContent = "This is a body";
    element.modalTitle = "Modal Title";
    element.maskClosable = true;
    element.fullscreen = true;
    element.width = 180;

    const mockOpenEvent = jest.fn();
    const mockCloseEvnet = jest.fn();
    const mockConfirmEvent = jest.fn();
    const mockCancelEvent = jest.fn();
    element.addEventListener("open", mockOpenEvent);
    element.addEventListener("close", mockCloseEvnet);
    element.addEventListener("confirm", mockConfirmEvent);
    element.addEventListener("cancel", mockCancelEvent);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.appendChild(bodyElement);
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(1);
    expect(element.innerHTML).toBe(
      "<div>This is a body</div>"
    );

    expect(element.visible).toBeFalsy();
    expect(element.shadowRoot?.querySelector(".modal")).toBeFalsy();

    // open
    await act(async () => {
      element.open();
    });

    expect(element.shadowRoot?.childNodes.length).toBe(2);
    expect(mockOpenEvent).toBeCalledTimes(1);
    expect(element.visible).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".modal")).toBeTruthy();
    expect((element.shadowRoot?.querySelector(".modal-container") as HTMLElement).className).toBe("modal-container fullscreen");

    // close
    await act(async () => {
      (element.shadowRoot?.querySelector(".close-btn") as HTMLElement).click();
    })

    expect(element.visible).toBeFalsy();
    expect(mockCloseEvnet).toBeCalledTimes(1);
    expect(element.shadowRoot?.querySelector(".modal")).toBeFalsy();

    // confirm
    await act(async () => {
      element.open();
    });

    expect(element.visible).toBeTruthy();

    await act(async () => {
      (element.shadowRoot?.querySelector(".modal-footer")?.lastChild as HTMLElement).click()
    });

    expect(element.visible).toBeFalsy();
    expect(mockConfirmEvent).toBeCalledTimes(1);
    expect(mockCloseEvnet).toBeCalledTimes(2);

    // cancel
    await act(async () => {
      element.open();
    });

    await act(async () => {
      (element.shadowRoot?.querySelector(".modal-footer")?.firstChild as HTMLElement).click()
    });

    expect(element.visible).toBeFalsy();
    expect(mockCancelEvent).toBeCalled();
    expect(mockCloseEvnet).toBeCalledTimes(3);

    // click mask and modal close
    await act(async () => {
      element.open();
    });

    await act(async () => {
      (element.shadowRoot?.querySelector(".modal-wrap") as HTMLElement).click();
    });

    expect(element.visible).toBeFalsy();
    expect(mockCloseEvnet).toBeCalledTimes(4);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("closeWhenConfirm was true and click confirm button not close the modal", async () => {
    const element = document.createElement("basic.general-modal") as Modal;
    element.modalTitle = "Modal Title";
    element.closeWhenConfirm = false;

    const mockCloseEvnet = jest.fn();
    const mockConfirmEvent = jest.fn();
    element.addEventListener("close", mockCloseEvnet);
    element.addEventListener("confirm", mockConfirmEvent);

    act(() => {
      document.body.appendChild(element);
    });

    expect(mockCloseEvnet).toBeCalledTimes(0);
    expect(element.visible).toBeFalsy();

    await act(async () => {
      element.open();
    });

    await act(async () => {
      (element.shadowRoot?.querySelector(".modal-footer")?.lastChild as HTMLElement).click()
    });

    expect(mockConfirmEvent).toBeCalledTimes(1);
    expect(mockCloseEvnet).toBeCalledTimes(0);
    expect(element.visible).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
  })
});
