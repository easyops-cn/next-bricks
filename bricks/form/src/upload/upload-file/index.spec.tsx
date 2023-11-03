import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { waitFor, fireEvent } from "@testing-library/react";
import "./index.jsx";
import { EoUploadFile } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

jest.mock("react-i18next", () => {
  const originalModule = jest.requireActual("react-i18next") as any;
  return {
    ...originalModule,
    Trans: jest.fn(),
  };
});

jest.useFakeTimers();

describe("eo-upload-file", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-upload-file") as EoUploadFile;
    const files = [
      new File([""], "success1.png", { type: "image/png" }),
      new File([""], "filtered.mp4", { type: "video/mp4" }),
      new File([""], "success2.jpeg", { type: "image/jpeg" }),
    ];
    const onChange = jest.fn();
    element.addEventListener("change", onChange);
    element.uploadDraggable = false;
    element.maxCount = 3;
    element.autoUpload = false;
    element.accept = "image/*";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(
      element.shadowRoot?.querySelector(".upload-drag-button")
    ).toBeFalsy();

    act(() => {
      fireEvent.change(
        element.shadowRoot?.querySelector("input") as HTMLInputElement,
        { target: { files } }
      );
    });
    await waitFor(() => {
      expect(onChange).toBeCalledWith(
        expect.objectContaining({
          detail: expect.arrayContaining([
            expect.objectContaining({ status: "done", file: files[0] }),
            expect.objectContaining({ status: "done", file: files[2] }),
          ]),
        })
      );
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("should show error when  uploaded file exceeded size limit", async () => {
    const element = document.createElement("eo-upload-file") as EoUploadFile;

    const file = new File([""], "success1.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 1024 * 1024 * 1024 * 3 });
    const files = [file];

    const onChange = jest.fn();
    element.addEventListener("change", onChange);
    element.uploadDraggable = false;
    element.maxCount = 3;
    element.limitSize = 0.1;
    element.autoUpload = false;
    element.accept = "image/*";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    act(() => {
      fireEvent.change(
        element.shadowRoot?.querySelector("input") as HTMLInputElement,
        { target: { files } }
      );
    });

    await waitFor(() => {
      expect(
        (onChange.mock.calls[0][0] as CustomEvent).detail[0].errors[0]
      ).toEqual(new Error("The uploaded file exceeded size limit: 0.1 MB"));
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("uploadDraggable is true", async () => {
    const element = document.createElement("eo-upload-file") as EoUploadFile;
    const files = [
      new File([""], "success1.png", { type: "image/png" }),
      new File([""], "filtered.mp4", { type: "video/mp4" }),
      new File([""], "success2.jpeg", { type: "image/jpeg" }),
    ];
    const onChange = jest.fn();
    element.addEventListener("change", onChange);
    element.uploadDraggable = true;
    element.draggableUploadTip = "tips";
    element.autoUpload = false;
    element.accept = "image/*";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelector(".upload-drag-tip")).toBeTruthy();
    const uploadDragButton = element.shadowRoot?.querySelector(
      ".upload-drag-button"
    ) as HTMLDivElement;
    expect(uploadDragButton).toBeTruthy();

    act(() => {
      fireEvent.dragEnter(uploadDragButton);
      fireEvent.dragOver(uploadDragButton);
    });
    expect(
      uploadDragButton.classList.contains("upload-drag-button-drag-over")
    ).toBeTruthy();

    act(() => {
      fireEvent.dragLeave(uploadDragButton);
    });
    expect(
      uploadDragButton.classList.contains("upload-drag-button-drag-over")
    ).toBeFalsy();

    act(() => {
      fireEvent.drop(uploadDragButton, { dataTransfer: { files } });
    });
    await waitFor(() => {
      expect(onChange).toBeCalledWith(
        expect.objectContaining({
          detail: expect.arrayContaining([
            expect.objectContaining({ status: "done", file: files[0] }),
            expect.objectContaining({ status: "done", file: files[2] }),
          ]),
        })
      );
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
